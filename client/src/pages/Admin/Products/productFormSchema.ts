import { z } from "zod";

export type ProductFormMode =
  | "draft"
  | "publish";

export const createProductFormSchema = (
  mode: ProductFormMode
) =>
  z
    .object({
      name: z.string().trim(),
      sku: z.string().trim(),

      productType: z.enum([
        "SINGLE",
        "COMBO",
      ]),

      jewelleryType: z.string(),

      shortDescription: z.string().trim(),
      description: z.string().trim(),

      materialId: z.string(),
      customMaterialName: z.string().trim(),

      colorId: z.string(),
      customColorName: z.string().trim(),
      customColorHex: z.string().trim(),

      antiRust: z.boolean(),

      gauge: z.string().trim(),
      diameter: z.string().trim(),

      price: z.string().trim(),
      salePrice: z.string().trim(),
      stock: z.string().trim(),

      status: z.enum([
        "DRAFT",
        "ACTIVE",
        "ARCHIVED",
      ]),

      categoryIds: z.array(z.string()),
      collectionIds: z.array(z.string()),

      isFeatured: z.boolean(),
      isBestSeller: z.boolean(),
      isNewArrival: z.boolean(),

      productImage: z.instanceof(File).nullable(),
      wornImage: z.instanceof(File).nullable(),

      comboItems: z.array(
        z.object({
          productId: z.string(),
          quantity: z.number().int().min(1),
        })
      ),
    })
    .superRefine((data, ctx) => {
      const publishing = mode === "publish";

      const addError = (
        field: string,
        message: string
      ) => {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message,
        });
      };

      if (publishing && !data.name) {
        addError(
          "name",
          "Product name is required."
        );
      }

      if (publishing && !data.sku) {
        addError(
          "sku",
          "SKU is required."
        );
      }

      if (
        publishing &&
        !data.jewelleryType
      ) {
        addError(
          "jewelleryType",
          "Jewellery type is required."
        );
      }

      if (
        publishing &&
        !data.shortDescription
      ) {
        addError(
          "shortDescription",
          "Short description is required."
        );
      }

      if (
        publishing &&
        !data.description
      ) {
        addError(
          "description",
          "Full description is required."
        );
      }

      if (
        publishing &&
        !data.materialId
      ) {
        addError(
          "materialId",
          "Material is required."
        );
      }

      if (
        data.materialId === "OTHER" &&
        publishing &&
        !data.customMaterialName
      ) {
        addError(
          "customMaterialName",
          "Enter the new material name."
        );
      }

      if (
        publishing &&
        !data.colorId
      ) {
        addError(
          "colorId",
          "Colour is required."
        );
      }

      if (
        data.colorId === "OTHER" &&
        publishing
      ) {
        if (!data.customColorName) {
          addError(
            "customColorName",
            "Enter the colour name."
          );
        }

        if (!data.customColorHex) {
          addError(
            "customColorHex",
            "Choose a colour."
          );
        }
      }

      if (data.price) {
        const price = Number(data.price);

        if (
          Number.isNaN(price) ||
          price <= 0
        ) {
          addError(
            "price",
            "Regular price must be greater than 0."
          );
        }
      } else if (publishing) {
        addError(
          "price",
          "Regular price is required."
        );
      }

      if (data.salePrice) {
        const salePrice =
          Number(data.salePrice);

        if (
          Number.isNaN(salePrice) ||
          salePrice <= 0
        ) {
          addError(
            "salePrice",
            "Sale price must be greater than 0."
          );
        }

        if (data.price) {
          const price = Number(data.price);

          if (
            !Number.isNaN(price) &&
            salePrice >= price
          ) {
            addError(
              "salePrice",
              "Sale price must be lower than regular price."
            );
          }
        }
      }

      if (
        data.productType === "SINGLE"
      ) {
        if (!data.stock && publishing) {
          addError(
            "stock",
            "Stock is required."
          );
        }

        if (data.stock) {
          const stock = Number(data.stock);

          if (
            Number.isNaN(stock) ||
            stock < 0 ||
            !Number.isInteger(stock)
          ) {
            addError(
              "stock",
              "Stock must be a whole number of 0 or more."
            );
          }
        }
      }

      if (
        publishing &&
        data.categoryIds.length === 0
      ) {
        addError(
          "categoryIds",
          "Select at least one piercing category."
        );
      }

      if (
        publishing &&
        !data.productImage
      ) {
        addError(
          "productImage",
          "Product image is required."
        );
      }

      if (
        publishing &&
        !data.wornImage
      ) {
        addError(
          "wornImage",
          "Worn image is required."
        );
      }

      if (
        publishing &&
        data.productType === "COMBO" &&
        data.comboItems.length === 0
      ) {
        addError(
          "comboItems",
          "Add at least one product to the combo."
        );
      }
    });