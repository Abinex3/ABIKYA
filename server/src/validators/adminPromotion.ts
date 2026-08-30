import { z } from "zod";

export const createAdminPromotionSchema =
  z
    .object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Promotion name is required."
        ),

      type: z.enum([
        "WELCOME",
        "FESTIVAL",
      ]),

      discountType: z.enum([
        "PERCENTAGE",
        "FLAT",
      ]),

      discountValue: z.coerce
        .number()
        .positive(
          "Discount value must be greater than 0."
        ),

      scope: z.enum([
        "ALL_PRODUCTS",
        "SELECTED_PRODUCTS",
        "CATEGORIES",
        "COLLECTIONS",
      ]),

      startAt: z.coerce.date(),

      endAt: z.coerce.date(),

      isActive: z.boolean().default(true),

      productIds: z
        .array(z.string().min(1))
        .default([]),

      categoryIds: z
        .array(z.string().min(1))
        .default([]),

      collectionIds: z
        .array(z.string().min(1))
        .default([]),
    })
    .superRefine(
      (data, ctx) => {
        if (
          data.discountType ===
            "PERCENTAGE" &&
          data.discountValue > 100
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["discountValue"],
            message:
              "Percentage discount cannot be greater than 100.",
          });
        }

        if (
          data.endAt <= data.startAt
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["endAt"],
            message:
              "End date must be after start date.",
          });
        }

        if (
          data.scope ===
            "SELECTED_PRODUCTS" &&
          data.productIds.length === 0
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["productIds"],
            message:
              "Select at least one product.",
          });
        }

        if (
          data.scope ===
            "CATEGORIES" &&
          data.categoryIds.length === 0
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["categoryIds"],
            message:
              "Select at least one category.",
          });
        }

        if (
          data.scope ===
            "COLLECTIONS" &&
          data.collectionIds.length === 0
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["collectionIds"],
            message:
              "Select at least one collection.",
          });
        }

        if (
          data.scope ===
            "ALL_PRODUCTS" &&
          (
            data.productIds.length > 0 ||
            data.categoryIds.length > 0 ||
            data.collectionIds.length > 0
          )
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["scope"],
            message:
              "All Products promotions must not include specific applicability selections.",
          });
        }
      }
    );

export type CreateAdminPromotionInput =
  z.infer<
    typeof createAdminPromotionSchema
  >;