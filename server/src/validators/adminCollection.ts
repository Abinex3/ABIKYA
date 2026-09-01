import { z } from "zod";

const collectionNameSchema = z
  .string()
  .trim()
  .min(1, "Collection name is required.")
  .max(100, "Collection name must be 100 characters or less.");

const collectionSlugSchema = z
  .string()
  .trim()
  .min(1, "Collection slug is required.")
  .max(120, "Collection slug must be 120 characters or less.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Collection slug must contain only lowercase letters, numbers, and hyphens."
  );

const collectionDescriptionSchema = z
  .string()
  .trim()
  .max(
    500,
    "Collection description must be 500 characters or less."
  )
  .optional()
  .nullable();

export const createCollectionSchema = z.object({
  name: collectionNameSchema,

  slug: collectionSlugSchema,

  description: collectionDescriptionSchema,

  isActive: z.boolean().default(true),
});

export const updateCollectionSchema = z.object({
  name: collectionNameSchema,

  slug: collectionSlugSchema,

  description: collectionDescriptionSchema,

  isActive: z.boolean(),
});

export const updateCollectionStatusSchema = z.object({
  isActive: z.boolean(),
});