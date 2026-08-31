import { z } from "zod";

export const inventoryMovementSchema = z
  .object({
    type: z.enum([
      "RECEIVE",
      "DAMAGE_LOSS",
      "RETURN",
      "MANUAL_ADJUSTMENT",
    ]),

    quantity: z.coerce
      .number()
      .int("Quantity must be a whole number."),

    note: z
      .string()
      .trim()
      .max(500, "Note must be 500 characters or less.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === "RECEIVE" ||
      data.type === "DAMAGE_LOSS" ||
      data.type === "RETURN"
    ) {
      if (data.quantity <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Quantity must be greater than 0.",
        });
      }
    }

    if (
      data.type === "MANUAL_ADJUSTMENT" &&
      data.quantity === 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message:
          "Manual adjustment quantity cannot be 0.",
      });
    }
  });

  

export type InventoryMovementInput =
  z.infer<typeof inventoryMovementSchema>;

  export const updateLowStockThresholdSchema =
  z.object({
    lowStockThreshold: z.coerce
      .number()
      .int("Low-stock threshold must be a whole number.")
      .min(
        0,
        "Low-stock threshold cannot be negative."
      ),
  });

export type UpdateLowStockThresholdInput =
  z.infer<
    typeof updateLowStockThresholdSchema
  >;