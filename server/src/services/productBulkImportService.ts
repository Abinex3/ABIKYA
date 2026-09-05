import { parse as parseCsv } from "csv-parse/sync";
import ExcelJS from "exceljs";

import type { PrismaClient } from "../generated/prisma/client.js";

import {
  bulkImportCsvRowSchema,
  mapCsvRecordToSchemaInput,
  type BulkImportCsvRow,
} from "../validators/adminProductBulkImport.js";

import { createSkuBatchGenerator } from "./skuBatchGenerator.js";

export type BulkImportRowError = {
  row: number; // 1-based, matches spreadsheet row (header = row 1)
  identifier: string; // name or SKU reference, for the client's own tracking
  message: string;
};

export type BulkImportCreatedProduct = {
  row: number;
  id: string;
  sku: string;
  name: string;
  productType: "SINGLE" | "COMBO";
};

export type BulkImportResult = {
  totalRows: number;
  successCount: number;
  failedCount: number;
  created: BulkImportCreatedProduct[];
  errors: BulkImportRowError[];
};

class RowImportError extends Error {}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Reads the "Products" worksheet from an .xlsx workbook (as produced
 * by downloadProductImportTemplate) into the same shape parseCsvBuffer
 * produces: an array of string-keyed records, one per data row.
 */
async function parseXlsxBuffer(
  buffer: Buffer
): Promise<Record<string, string>[]> {
  const workbook = new ExcelJS.Workbook();

  try {
    // If TypeScript flags a Buffer type mismatch here, it's almost
    // always two different @types/node versions in node_modules
    // (one from your project, one nested under exceljs) producing
    // structurally-identical-but-nominally-different Buffer types.
    // The cast is safe — this is genuinely a Node Buffer at runtime.
    await workbook.xlsx.load(buffer as any);
  } catch (error) {
    throw new Error(
      "Could not read the Excel file. Please make sure it's a valid .xlsx file."
    );
  }

  const sheet =
    workbook.getWorksheet("Products") ??
    workbook.worksheets[0];

  if (!sheet) {
    throw new Error(
      "The Excel file has no worksheet to import from."
    );
  }

  const headerRow = sheet.getRow(1);
  const headers: string[] = [];

  headerRow.eachCell(
    { includeEmpty: false },
    (cell, colNumber) => {
      headers[colNumber] = String(
        cell.value ?? ""
      ).trim();
    }
  );

  const records: Record<string, string>[] = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // header row

    const record: Record<string, string> = {};
    let hasAnyValue = false;

    row.eachCell(
      { includeEmpty: true },
      (cell, colNumber) => {
        const header = headers[colNumber];
        if (!header) return;

        let value = cell.value;

        // Excel gives back Dates, formula results ({result: ...}),
        // and rich text objects for some cells — normalize to a
        // plain string the same way a CSV cell would arrive.
        if (
          value &&
          typeof value === "object" &&
          "result" in (value as object)
        ) {
          value = (value as { result: unknown })
            .result as typeof value;
        }

        if (value instanceof Date) {
          value = value.toISOString();
        }

        const stringValue =
          value === null || value === undefined
            ? ""
            : String(value).trim();

        if (stringValue) hasAnyValue = true;

        record[header] = stringValue;
      }
    );

    if (hasAnyValue) {
      records.push(record);
    }
  });

  return records;
}

/**
 * Parses the uploaded file buffer into an array of raw string-keyed
 * records. Accepts either .csv or the .xlsx template. Throws on
 * structural problems (unreadable file, no rows) before any per-row
 * validation begins.
 */
async function parseUploadBuffer(
  buffer: Buffer,
  originalFilename: string
): Promise<Record<string, string>[]> {
  const isXlsx = originalFilename
    .toLowerCase()
    .endsWith(".xlsx");

  let records: Record<string, string>[];

  if (isXlsx) {
    records = await parseXlsxBuffer(buffer);
  } else {
    try {
      records = parseCsv(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
      });
    } catch (error) {
      throw new Error(
        "Could not read the CSV file. Please make sure it is a valid, comma-separated CSV export from Excel or Google Sheets."
      );
    }
  }

  if (records.length === 0) {
    throw new Error("The file has no data rows.");
  }

  if (records.length > 500) {
    throw new Error(
      `The file has ${records.length} rows. Please import in batches of 500 or fewer.`
    );
  }

  return records;
}

type ParsedRow = {
  row: number;
  identifier: string;
  data: BulkImportCsvRow | null;
};

/**
 * Parses + shape-validates every row via Zod. Doesn't touch the DB —
 * that happens once, in batch, afterward.
 */
function parseAndValidateRows(
  rawRecords: Record<string, string>[],
  errors: BulkImportRowError[]
): ParsedRow[] {
  return rawRecords.map((record, index) => {
    const rowNumber = index + 2; // +2: header row + 1-based index
    const identifier =
      record.name || record.productType || "(blank)";

    const result = bulkImportCsvRowSchema.safeParse(
      mapCsvRecordToSchemaInput(record)
    );

    if (!result.success) {
      const message = result.error.issues
        .map(
          (issue) =>
            `${issue.path.join(".")}: ${issue.message}`
        )
        .join("; ");

      errors.push({ row: rowNumber, identifier, message });

      return { row: rowNumber, identifier, data: null };
    }

    return {
      row: rowNumber,
      identifier,
      data: result.data,
    };
  });
}

/**
 * Resolves every category/collection name referenced anywhere in the
 * file with two queries total (not two per row). A missing name
 * fails only the rows that reference it.
 */
async function resolveCategoriesAndCollections(
  prisma: PrismaClient,
  validRows: ParsedRow[],
  errors: BulkImportRowError[]
): Promise<{
  categoryIdByName: Map<string, string>;
  collectionIdByName: Map<string, string>;
  failedRows: Set<number>;
}> {
  const allCategoryNames = new Set<string>();
  const allCollectionNames = new Set<string>();

  for (const entry of validRows) {
    entry.data!.categoryNames.forEach((n) =>
      allCategoryNames.add(n)
    );
    entry.data!.collectionNames.forEach((n) =>
      allCollectionNames.add(n)
    );
  }

  const [categoryRows, collectionRows] =
    await Promise.all([
      allCategoryNames.size > 0
        ? prisma.category.findMany({
            where: {
              name: { in: [...allCategoryNames] },
              isActive: true,
            },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),

      allCollectionNames.size > 0
        ? prisma.collection.findMany({
            where: {
              name: { in: [...allCollectionNames] },
              isActive: true,
            },
            select: { id: true, name: true },
          })
        : Promise.resolve([]),
    ]);

  const categoryIdByName = new Map(
    categoryRows.map((c) => [c.name, c.id])
  );
  const collectionIdByName = new Map(
    collectionRows.map((c) => [c.name, c.id])
  );

  const failedRows = new Set<number>();

  for (const entry of validRows) {
    const row = entry.data!;

    const missingCategories = row.categoryNames.filter(
      (n) => !categoryIdByName.has(n)
    );
    const missingCollections = row.collectionNames.filter(
      (n) => !collectionIdByName.has(n)
    );

    if (missingCategories.length > 0) {
      errors.push({
        row: entry.row,
        identifier: entry.identifier,
        message: `Unknown categories: ${missingCategories.join(", ")}. Create them in Admin first.`,
      });
      failedRows.add(entry.row);
    } else if (missingCollections.length > 0) {
      errors.push({
        row: entry.row,
        identifier: entry.identifier,
        message: `Unknown collections: ${missingCollections.join(", ")}. Create them in Admin first.`,
      });
      failedRows.add(entry.row);
    }
  }

  return { categoryIdByName, collectionIdByName, failedRows };
}

/**
 * Upserts every unique materialName once (not once per row), in
 * parallel — safe because each is a distinct unique-constraint value.
 */
async function resolveMaterials(
  prisma: PrismaClient,
  validRows: ParsedRow[]
): Promise<Map<string, string>> {
  const uniqueNames = [
    ...new Set(
      validRows.map((r) => r.data!.materialName)
    ),
  ];

  const materials = await Promise.all(
    uniqueNames.map((name) =>
      prisma.material.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return new Map(
    materials.map((m) => [m.name, m.id])
  );
}

/**
 * Resolves every unique colorName once. New colours need a hex code
 * from somewhere in the file (last non-empty value wins, matching
 * what sequential per-row upserts would have done); missing it fails
 * every row that references that colour name.
 */
async function resolveColors(
  prisma: PrismaClient,
  validRows: ParsedRow[],
  errors: BulkImportRowError[]
): Promise<{
  colorIdByName: Map<string, string>;
  failedRows: Set<number>;
}> {
  const uniqueNames = [
    ...new Set(validRows.map((r) => r.data!.colorName)),
  ];

  const hexByName = new Map<string, string>();
  for (const entry of validRows) {
    const row = entry.data!;
    if (row.colorHex) {
      hexByName.set(row.colorName, row.colorHex);
    }
  }

  const existingColors = await prisma.color.findMany({
    where: { name: { in: uniqueNames } },
    select: { id: true, name: true },
  });

  const colorIdByName = new Map(
    existingColors.map((c) => [c.name, c.id])
  );

  const namesNeedingCreate = uniqueNames.filter(
    (name) => !colorIdByName.has(name)
  );

  const failedRows = new Set<number>();
  const creatableNames: string[] = [];

  for (const name of namesNeedingCreate) {
    if (!hexByName.get(name)) {
      for (const entry of validRows) {
        if (entry.data!.colorName === name) {
          errors.push({
            row: entry.row,
            identifier: entry.identifier,
            message: `colorHex is required because "${name}" is a new colour.`,
          });
          failedRows.add(entry.row);
        }
      }
    } else {
      creatableNames.push(name);
    }
  }

  const createdColors = await Promise.all(
    creatableNames.map((name) =>
      prisma.color.upsert({
        where: { name },
        update: {},
        create: { name, hexCode: hexByName.get(name)! },
      })
    )
  );

  for (const color of createdColors) {
    colorIdByName.set(color.name, color.id);
  }

  return { colorIdByName, failedRows };
}

/**
 * Builds a slug picker backed by a single query for the whole batch
 * (every existing product slug) instead of a findUnique per row per
 * collision attempt. Assigns slugs in row order so intra-batch
 * collisions (two rows with very similar names) resolve the same way
 * sequential per-row generation would have.
 */
async function createSlugPicker(
  prisma: PrismaClient
): Promise<(name: string) => string> {
  const existing = await prisma.product.findMany({
    select: { slug: true },
  });

  const taken = new Set(existing.map((p) => p.slug));

  return (name: string) => {
    const base = slugify(name);

    let slug = base;
    let counter = 1;

    while (taken.has(slug)) {
      slug = `${base}-${counter}`;
      counter += 1;
    }

    taken.add(slug);
    return slug;
  };
}

export async function bulkImportProducts(
  prisma: PrismaClient,
  fileBuffer: Buffer,
  originalFilename: string
): Promise<BulkImportResult> {
  const rawRecords = await parseUploadBuffer(
    fileBuffer,
    originalFilename
  );

  const errors: BulkImportRowError[] = [];
  const created: BulkImportCreatedProduct[] = [];

  const parsedRows = parseAndValidateRows(
    rawRecords,
    errors
  );

  const validRows = parsedRows.filter(
    (r): r is ParsedRow & { data: BulkImportCsvRow } =>
      r.data !== null
  );

  // --- Batch-resolve everything shared across rows, once ---
  const skuGenerator = createSkuBatchGenerator(prisma);
  const getSlugFor = await createSlugPicker(prisma);

  const materialIdByName = await resolveMaterials(
    prisma,
    validRows
  );

  const { colorIdByName, failedRows: colorFailedRows } =
    await resolveColors(prisma, validRows, errors);

  const {
    categoryIdByName,
    collectionIdByName,
    failedRows: refFailedRows,
  } = await resolveCategoriesAndCollections(
    prisma,
    validRows,
    errors
  );

  const preFailedRows = new Set([
    ...colorFailedRows,
    ...refFailedRows,
  ]);

  // --- Pass 1: SINGLE products ---
  // Combo rows depend on SINGLE SKUs existing, so these go first.
  for (const entry of validRows) {
    const row = entry.data;

    if (row.productType !== "SINGLE") continue;
    if (preFailedRows.has(entry.row)) continue;

    try {
      const materialId = materialIdByName.get(
        row.materialName
      );
      const colorId = colorIdByName.get(row.colorName);

      if (!materialId || !colorId) {
        throw new RowImportError(
          "Unable to resolve material or colour for this row."
        );
      }

      const sku = await skuGenerator.getNextSku(
        "SINGLE",
        row.jewelleryType
      );

      const slug = getSlugFor(row.name);

      // A single prisma.create() with nested relation writes runs
      // as one atomic operation — no explicit $transaction needed.
      const product = await prisma.product.create({
        data: {
          name: row.name,
          slug,
          sku,

          shortDescription: row.shortDescription,
          description: row.description,

          productType: "SINGLE",
          jewelleryType: row.jewelleryType,

          materialId,
          colorId,

          antiRust: row.antiRust,

          gauge: row.gauge || null,
          diameter: row.diameter || null,

          price: row.price,
          salePrice: row.salePrice ?? null,

          stock: row.stock ?? 0,

          // Always DRAFT on import — ACTIVE requires product +
          // worn images, which CSV cannot carry. The client
          // uploads images per product afterward, then publishes
          // from Admin.
          status: "DRAFT",

          isFeatured: row.isFeatured,
          isBestSeller: row.isBestSeller,
          isNewArrival: row.isNewArrival,

          categories: {
            create: row.categoryNames.map((name) => ({
              categoryId: categoryIdByName.get(name)!,
            })),
          },

          collections: {
            create: row.collectionNames.map((name) => ({
              collectionId: collectionIdByName.get(
                name
              )!,
            })),
          },
        },
        select: { id: true, sku: true, name: true },
      });

      created.push({
        row: entry.row,
        id: product.id,
        sku: product.sku,
        name: product.name,
        productType: "SINGLE",
      });
    } catch (error) {
      errors.push({
        row: entry.row,
        identifier: entry.identifier,
        message:
          error instanceof RowImportError
            ? error.message
            : "Unable to create this product. Please check the row and try again.",
      });

      if (!(error instanceof RowImportError)) {
        console.error(
          `Bulk import failed on row ${entry.row}:`,
          error
        );
      }
    }
  }

  // --- Pass 2: COMBO products ---
  // Resolve comboItems SKUs against both products just created in
  // this batch AND pre-existing products already in the DB.
  for (const entry of validRows) {
    const row = entry.data;

    if (row.productType !== "COMBO") continue;
    if (preFailedRows.has(entry.row)) continue;

    try {
      const materialId = materialIdByName.get(
        row.materialName
      );
      const colorId = colorIdByName.get(row.colorName);

      if (!materialId || !colorId) {
        throw new RowImportError(
          "Unable to resolve material or colour for this row."
        );
      }

      const requestedSkus = row.comboItems.map(
        (item) => item.sku
      );

      const existingComboProducts =
        await prisma.product.findMany({
          where: {
            sku: { in: requestedSkus },
            productType: "SINGLE",
            status: { not: "ARCHIVED" },
          },
          select: { id: true, sku: true },
        });

      const idBySku = new Map(
        existingComboProducts.map((p) => [p.sku, p.id])
      );

      const missingSkus = requestedSkus.filter(
        (sku) => !idBySku.has(sku)
      );

      if (missingSkus.length > 0) {
        throw new RowImportError(
          `comboItems references unknown or non-SINGLE SKUs: ${missingSkus.join(", ")}.`
        );
      }

      const sku = await skuGenerator.getNextSku(
        "COMBO",
        row.jewelleryType
      );

      const slug = getSlugFor(row.name);

      const product = await prisma.product.create({
        data: {
          name: row.name,
          slug,
          sku,

          shortDescription: row.shortDescription,
          description: row.description,

          productType: "COMBO",
          jewelleryType: row.jewelleryType,

          materialId,
          colorId,

          antiRust: row.antiRust,

          gauge: row.gauge || null,
          diameter: row.diameter || null,

          price: row.price,
          salePrice: row.salePrice ?? null,

          stock: null,

          status: "DRAFT",

          isFeatured: row.isFeatured,
          isBestSeller: row.isBestSeller,
          isNewArrival: row.isNewArrival,

          categories: {
            create: row.categoryNames.map((name) => ({
              categoryId: categoryIdByName.get(name)!,
            })),
          },

          collections: {
            create: row.collectionNames.map((name) => ({
              collectionId: collectionIdByName.get(
                name
              )!,
            })),
          },

          comboItems: {
            create: row.comboItems.map((item) => ({
              itemProductId: idBySku.get(item.sku)!,
              quantity: item.quantity,
            })),
          },
        },
        select: { id: true, sku: true, name: true },
      });

      created.push({
        row: entry.row,
        id: product.id,
        sku: product.sku,
        name: product.name,
        productType: "COMBO",
      });
    } catch (error) {
      errors.push({
        row: entry.row,
        identifier: entry.identifier,
        message:
          error instanceof RowImportError
            ? error.message
            : "Unable to create this combo product. Please check the row and try again.",
      });

      if (!(error instanceof RowImportError)) {
        console.error(
          `Bulk import failed on row ${entry.row}:`,
          error
        );
      }
    }
  }

  // Sort errors/created by row so the client's report reads
  // top-to-bottom the same way their spreadsheet does.
  errors.sort((a, b) => a.row - b.row);
  created.sort((a, b) => a.row - b.row);

  return {
    totalRows: rawRecords.length,
    successCount: created.length,
    failedCount: errors.length,
    created,
    errors,
  };
}