import { z } from "zod";

/* =========================
   CREATE / UPDATE GIFT RULE
========================= */

export const createAdminGiftRuleSchema =
  z
    .object({
      minimumOrderQuantity: z
        .number()
        .int()
        .min(
          1,
          "Minimum order quantity must be at least 1."
        ),

      minimumOrderValue: z
        .number()
        .min(
          0,
          "Minimum order value cannot be negative."
        )
        .nullable()
        .optional(),

      giftProductId: z
        .string()
        .trim()
        .min(
          1,
          "Gift product is required."
        ),

      giftQuantity: z
        .number()
        .int()
        .min(
          1,
          "Gift quantity must be at least 1."
        ),

      isActive: z.boolean(),

      startAt: z.coerce.date(),

      endAt: z.coerce.date(),
    })
    .superRefine(
      (
        data,
        ctx
      ) => {
        if (
          data.endAt <=
          data.startAt
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "endAt",
            ],

            message:
              "End date must be after start date.",
          });
        }
      }
    );

export type CreateAdminGiftRuleInput =
  z.infer<
    typeof createAdminGiftRuleSchema
  >;