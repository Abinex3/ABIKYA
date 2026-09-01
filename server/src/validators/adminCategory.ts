import { z } from "zod";

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required.")
  .max(100, "Category name must be 100 characters or less.");

const categorySlugSchema = z
  .string()
  .trim()
  .min(1, "Category slug is required.")
  .max(120, "Category slug must be 120 characters or less.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Category slug must contain only lowercase letters, numbers, and hyphens."
  );

const categoryDescriptionSchema = z
  .string()
  .trim()
  .max(
    500,
    "Category description must be 500 characters or less."
  )
  .optional()
  .nullable();

export const createCategorySchema = z.object({
  name: categoryNameSchema,

  slug: categorySlugSchema,

  description: categoryDescriptionSchema,

  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z.object({
  name: categoryNameSchema,

  slug: categorySlugSchema,

  description: categoryDescriptionSchema,

  isActive: z.boolean(),
});

export const updateCategoryStatusSchema = z.object({
  isActive: z.boolean(),
});