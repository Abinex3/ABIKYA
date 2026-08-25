import { z } from "zod";

const comboItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const createAdminProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name is required."),

    sku: z
      .string()
      .trim()
      .min(2, "SKU is required."),

    shortDescription: z
      .string()
      .trim()
      .min(5, "Short description is required."),

    description: z
      .string()
      .trim()
      .min(10, "Full description is required."),

    productType: z.enum([
      "SINGLE",
      "COMBO",
    ]),

    jewelleryType: z.enum([
      "STUD",
      "RING",
      "HOOP",
      "BARBELL",
      "CURVED_BARBELL",
      "OTHER",
    ]),

    materialId: z.string().optional(),
    customMaterialName: z
      .string()
      .trim()
      .optional(),

    colorId: z.string().optional(),
    customColorName: z
      .string()
      .trim()
      .optional(),

    customColorHex: z
      .string()
      .trim()
      .optional(),

    antiRust: z.boolean().default(false),

    gauge: z
      .string()
      .trim()
      .optional(),

    diameter: z
      .string()
      .trim()
      .optional(),

    price: z.coerce
      .number()
      .positive(),

    salePrice: z.coerce
      .number()
      .positive()
      .optional()
      .nullable(),

    stock: z.coerce
      .number()
      .int()
      .min(0)
      .optional()
      .nullable(),

    status: z.enum([
      "DRAFT",
      "ACTIVE",
      "ARCHIVED",
    ]),

    categoryIds: z
      .array(z.string())
      .default([]),

    collectionIds: z
      .array(z.string())
      .default([]),

    isFeatured: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),

    comboItems: z
      .array(comboItemSchema)
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (
      data.salePrice != null &&
      data.salePrice >= data.price
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message:
          "Sale price must be lower than regular price.",
      });
    }

    if (
      data.productType === "SINGLE" &&
      data.stock == null
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["stock"],
        message:
          "Stock is required for single products.",
      });
    }

    if (
      data.productType === "COMBO" &&
      data.comboItems.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["comboItems"],
        message:
          "Combo products must contain at least one product.",
      });
    }

    if (
      !data.materialId &&
      !data.customMaterialName
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["materialId"],
        message:
          "Material is required.",
      });
    }

    if (
      !data.colorId &&
      !data.customColorName
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["colorId"],
        message:
          "Colour is required.",
      });
    }

    if (
      data.customColorName &&
      !data.customColorHex
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["customColorHex"],
        message:
          "Hex code is required for a custom colour.",
      });
    }

    if (
      data.status === "ACTIVE" &&
      data.categoryIds.length === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["categoryIds"],
        message:
          "At least one category is required for an active product.",
      });
    }
  });

export type CreateAdminProductInput =
  z.infer<typeof createAdminProductSchema>;