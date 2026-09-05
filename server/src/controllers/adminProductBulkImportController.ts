import type { Request, Response } from "express";
import ExcelJS from "exceljs";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { bulkImportProducts } from "../services/productBulkImportService.js";
import { CSV_TEMPLATE_HEADERS } from "../validators/adminProductBulkImport.js";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function bulkImportProductsHandler(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "A CSV file is required.",
      });
    }

    const result = await bulkImportProducts(
      prisma,
      req.file.buffer,
      req.file.originalname
    );

    return res.status(200).json({
      message:
        result.failedCount === 0
          ? `Imported all ${result.successCount} products successfully.`
          : `Imported ${result.successCount} of ${result.totalRows} products. ${result.failedCount} row(s) need fixes.`,

      ...result,
    });
  } catch (error) {
    console.error(
      "Bulk product import failed:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to process the CSV file.";

    return res.status(400).json({
      message,
    });
  }
}

const JEWELLERY_TYPES = [
  "STUD",
  "RING",
  "HOOP",
  "BARBELL",
  "CURVED_BARBELL",
  "OTHER",
];

const BOOLEAN_CHOICES = ["TRUE", "FALSE"];
const PRODUCT_TYPES = ["SINGLE", "COMBO"];

/**
 * 1-based Excel column index for a header name, so validation can
 * be attached to the right column even if CSV_TEMPLATE_HEADERS
 * ever gets reordered.
 */
function columnLetterFor(
  headerName: (typeof CSV_TEMPLATE_HEADERS)[number]
): string {
  const index =
    CSV_TEMPLATE_HEADERS.indexOf(headerName) + 1;

  let letters = "";
  let remaining = index;

  while (remaining > 0) {
    const rem = (remaining - 1) % 26;
    letters = String.fromCharCode(65 + rem) + letters;
    remaining = Math.floor((remaining - 1) / 26);
  }

  return letters;
}

/** Applies a dropdown (list validation) to every data row in a column. */
function applyListValidation(
  worksheet: ExcelJS.Worksheet,
  headerName: (typeof CSV_TEMPLATE_HEADERS)[number],
  choices: string[],
  lastRow: number
) {
  const column = columnLetterFor(headerName);

  for (let row = 2; row <= lastRow; row += 1) {
    worksheet.getCell(`${column}${row}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${choices.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid value",
      error: `Please choose one of: ${choices.join(", ")}`,
    };
  }
}

export async function downloadProductImportTemplate(
  _req: Request,
  res: Response
) {
  try {
    const [categories, collections] =
      await Promise.all([
        prisma.category.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { name: true },
        }),

        prisma.collection.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { name: true },
        }),
      ]);

    const workbook = new ExcelJS.Workbook();

    // --- Reference sheet: valid category/collection names ---
    // Categories and collections are comma-separated (a product can
    // have several), so they can't be a strict single-value Excel
    // dropdown — instead this sheet gives the client the exact
    // spelling to copy into the "categories"/"collections" columns
    // on the Products sheet.
    const referenceSheet = workbook.addWorksheet(
      "Valid Names (reference)"
    );

    referenceSheet.columns = [
      { header: "Category names", key: "category", width: 28 },
      { header: "Collection names", key: "collection", width: 28 },
    ];

    referenceSheet.getRow(1).font = { bold: true };

    const maxRows = Math.max(
      categories.length,
      collections.length,
      1
    );

    for (let i = 0; i < maxRows; i += 1) {
      referenceSheet.addRow({
        category: categories[i]?.name ?? "",
        collection: collections[i]?.name ?? "",
      });
    }

    // --- Main Products sheet ---
    const sheet = workbook.addWorksheet("Products");

    sheet.columns = CSV_TEMPLATE_HEADERS.map(
      (header) => ({
        header,
        key: header,
        width: header.length < 14 ? 16 : 26,
      })
    );

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEEE9FF" },
    };

    sheet.addRow({
      productType: "SINGLE",
      name: "Gold Plated Stud",
      shortDescription:
        "Elegant everyday stud earring",
      description:
        "A lightweight, tarnish-resistant stud crafted for daily wear with a secure butterfly back.",
      jewelleryType: "STUD",
      materialName: "Surgical Steel",
      colorName: "Gold",
      colorHex: "#D4AF37",
      antiRust: "TRUE",
      gauge: "",
      diameter: "",
      price: 499,
      salePrice: 399,
      stock: 50,
      categories: categories[0]?.name ?? "",
      collections: collections[0]?.name ?? "",
      isFeatured: "TRUE",
      isBestSeller: "FALSE",
      isNewArrival: "FALSE",
      comboItems: "",
    });

    sheet.addRow({
      productType: "COMBO",
      name: "Stud + Ring Combo",
      shortDescription:
        "A matching stud and ring set",
      description:
        "Pair this stud with our classic ring for a coordinated everyday look. Sold as a set at a bundled price.",
      jewelleryType: "OTHER",
      materialName: "Surgical Steel",
      colorName: "Silver",
      colorHex: "#C0C0C0",
      antiRust: "TRUE",
      gauge: "",
      diameter: "",
      price: 899,
      salePrice: "",
      stock: "",
      categories: "",
      collections: collections[0]?.name ?? "",
      isFeatured: "FALSE",
      isBestSeller: "TRUE",
      isNewArrival: "FALSE",
      comboItems: "ABK-ST-0001:1|ABK-RG-0001:1",
    });

    // Pre-provision dropdowns down to row 502 (2 example rows + 500
    // data rows) so the client can keep pasting without losing them.
    const lastRow = 502;

    applyListValidation(
      sheet,
      "productType",
      PRODUCT_TYPES,
      lastRow
    );

    applyListValidation(
      sheet,
      "jewelleryType",
      JEWELLERY_TYPES,
      lastRow
    );

    applyListValidation(
      sheet,
      "antiRust",
      BOOLEAN_CHOICES,
      lastRow
    );

    applyListValidation(
      sheet,
      "isFeatured",
      BOOLEAN_CHOICES,
      lastRow
    );

    applyListValidation(
      sheet,
      "isBestSeller",
      BOOLEAN_CHOICES,
      lastRow
    );

    applyListValidation(
      sheet,
      "isNewArrival",
      BOOLEAN_CHOICES,
      lastRow
    );

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="product-import-template.xlsx"'
    );

    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error(
      "Failed to generate import template:",
      error
    );

    return res.status(500).json({
      message: "Unable to generate the template file.",
    });
  }
}