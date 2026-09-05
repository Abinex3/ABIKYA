import { z } from "zod";

export const bulkProductIdsSchema = z.object({
  productIds: z
    .array(z.string().min(1))
    .min(1, "Select at least one product."),
});

export const bulkStatusUpdateSchema = bulkProductIdsSchema.extend({
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export const bulkDeleteSchema = bulkProductIdsSchema.extend({
  password: z.string().min(1, "Password is required."),
});