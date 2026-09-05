import { z } from "zod";

/**
 * Raw shape of a single row as it comes out of the CSV parser.
 * Every CSV cell arrives as a string (or undefined for a missing
 * column), so this schema's job is to coerce + validate that
 * loosely-typed input before it touches business logic.
 */
const booleanFromCsv = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) return false;

    return ["true", "1", "yes", "y"].includes(
      value.toLowerCase()
    );
  });

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

/**
 * comboItems column format: "SKU:qty|SKU:qty"
 * e.g. "ABK-ST-0001:2|ABK-RG-0003:1"
 * Pipe-separated so it never collides with the CSV's own comma
 * delimiter (categories/collections already use commas).
 */
function parseComboItemsCell(
  raw: string | undefined
): { sku: string; quantity: number }[] {
  if (!raw || !raw.trim()) return [];

  return raw
    .split("|")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [skuPart, qtyPart] = chunk.split(":");

      return {
        sku: (skuPart ?? "").trim(),
        quantity: Number((qtyPart ?? "1").trim()),
      };
    });
}

function parseNameListCell(
  raw: string | undefined
): string[] {
  if (!raw || !raw.trim()) return [];

  return [
    ...new Set(
      raw
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    ),
  ];
}

export const bulkImportCsvRowSchema = z
  .object({
    productType: z.enum(["SINGLE", "COMBO"], {
      errorMap: () => ({
        message:
          "productType must be SINGLE or COMBO.",
      }),
    }),

    name: z
      .string()
      .trim()
      .min(2, "Product name is required."),

    shortDescription: z
      .string()
      .trim()
      .min(5, "Short description is required."),

    description: z
      .string()
      .trim()
      .min(10, "Full description is required."),

    jewelleryType: z.enum(
      [
        "STUD",
        "RING",
        "HOOP",
        "BARBELL",
        "CURVED_BARBELL",
        "OTHER",
      ],
      {
        errorMap: () => ({
          message: "Invalid jewelleryType.",
        }),
      }
    ),

    materialName: z
      .string()
      .trim()
      .min(1, "materialName is required."),

    colorName: z
      .string()
      .trim()
      .min(1, "colorName is required."),

    // Only required if colorName does not already exist —
    // checked later against the DB, not here.
    colorHex: optionalTrimmedString,

    antiRust: booleanFromCsv,

    gauge: optionalTrimmedString,
    diameter: optionalTrimmedString,

    price: z.coerce
      .number()
      .positive("price must be a positive number."),

    salePrice: z
      .string()
      .trim()
      .optional()
      .transform((value) =>
        value ? Number(value) : undefined
      ),

    stock: z
      .string()
      .trim()
      .optional()
      .transform((value) =>
        value ? Number(value) : undefined
      ),

    categoriesRaw: optionalTrimmedString,
    collectionsRaw: optionalTrimmedString,

    isFeatured: booleanFromCsv,
    isBestSeller: booleanFromCsv,
    isNewArrival: booleanFromCsv,

    comboItemsRaw: optionalTrimmedString,
  })
  .transform((data) => ({
    ...data,
    categoryNames: parseNameListCell(
      data.categoriesRaw
    ),
    collectionNames: parseNameListCell(
      data.collectionsRaw
    ),
    comboItems: parseComboItemsCell(
      data.comboItemsRaw
    ),
  }))
  .superRefine((data, ctx) => {
    if (
      data.salePrice != null &&
      Number.isNaN(data.salePrice)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message: "salePrice must be a number.",
      });
    }

    if (
      data.salePrice != null &&
      !Number.isNaN(data.salePrice) &&
      data.salePrice >= data.price
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message:
          "salePrice must be lower than price.",
      });
    }

    if (data.productType === "SINGLE") {
      if (
        data.stock == null ||
        Number.isNaN(data.stock) ||
        data.stock < 0
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["stock"],
          message:
            "stock is required for SINGLE products and must be 0 or more.",
        });
      }
    }

    if (data.productType === "COMBO") {
      if (data.comboItems.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["comboItemsRaw"],
          message:
            "COMBO products need at least one comboItems entry (SKU:qty).",
        });
      }

      const skuSet = new Set(
        data.comboItems.map((item) => item.sku)
      );

      if (skuSet.size !== data.comboItems.length) {
        ctx.addIssue({
          code: "custom",
          path: ["comboItemsRaw"],
          message:
            "The same SKU appears more than once in comboItems.",
        });
      }

      for (const item of data.comboItems) {
        if (!item.sku) {
          ctx.addIssue({
            code: "custom",
            path: ["comboItemsRaw"],
            message:
              "comboItems has an entry with a blank SKU.",
          });
        }

        if (
          Number.isNaN(item.quantity) ||
          item.quantity < 1
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["comboItemsRaw"],
            message: `comboItems quantity for ${item.sku || "(blank)"} must be 1 or more.`,
          });
        }
      }
    }
    // Whether colorHex is *actually* required depends on whether
    // colorName already exists in the DB — that check needs a query,
    // so it happens in the service layer, not here.
  });

export type BulkImportCsvRow = z.infer<
  typeof bulkImportCsvRowSchema
>;

/**
 * User-facing CSV column headers (what the client sees in Excel).
 * These get mapped onto the schema's internal *Raw field names
 * before validation — see mapCsvRecordToSchemaInput() in the
 * service layer.
 */
export const CSV_TEMPLATE_HEADERS = [
  "productType",
  "name",
  "shortDescription",
  "description",
  "jewelleryType",
  "materialName",
  "colorName",
  "colorHex",
  "antiRust",
  "gauge",
  "diameter",
  "price",
  "salePrice",
  "stock",
  "categories",
  "collections",
  "isFeatured",
  "isBestSeller",
  "isNewArrival",
  "comboItems",
] as const;

/**
 * Maps a raw CSV record (friendly headers) onto the field names
 * bulkImportCsvRowSchema expects.
 */
export function mapCsvRecordToSchemaInput(
  record: Record<string, string | undefined>
) {
  return {
    productType: record.productType,
    name: record.name,
    shortDescription: record.shortDescription,
    description: record.description,
    jewelleryType: record.jewelleryType,
    materialName: record.materialName,
    colorName: record.colorName,
    colorHex: record.colorHex,
    antiRust: record.antiRust,
    gauge: record.gauge,
    diameter: record.diameter,
    price: record.price,
    salePrice: record.salePrice,
    stock: record.stock,
    categoriesRaw: record.categories,
    collectionsRaw: record.collections,
    isFeatured: record.isFeatured,
    isBestSeller: record.isBestSeller,
    isNewArrival: record.isNewArrival,
    comboItemsRaw: record.comboItems,
  };
}