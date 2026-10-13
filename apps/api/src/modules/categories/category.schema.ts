import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, { message: "Category name is required" }).max(100, { message: "Category name is too long" }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be URL-friendly (e.g. electronics, home-appliances)" })
    .optional(),
  excerpt: z.string().trim().max(500, { message: "Excerpt must not exceed 500 characters" }).optional().nullable(),
  image: z.string().trim().url({ message: "Image must be a valid URL" }),
  storageKey: z.string().trim().min(1, { message: "Storage key is required" }),
  altText: z.string().trim().min(1, { message: "Alt text is required" }).max(200, { message: "Alt text is too long" }),
  isActive: z.boolean().optional().default(true),
  parentId: z.string().trim().nullable().optional(),
})

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, { message: "Category name cannot be empty" }).max(100, { message: "Category name is too long" }).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be URL-friendly" })
    .optional(),
  excerpt: z.string().trim().max(500, { message: "Excerpt must not exceed 500 characters" }).optional().nullable(),
  image: z.string().trim().url({ message: "Image must be a valid URL" }).optional(),
  storageKey: z.string().trim().min(1, { message: "Storage key cannot be empty" }).optional(),
  altText: z.string().trim().min(1, { message: "Alt text cannot be empty" }).max(200, { message: "Alt text is too long" }).optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().trim().nullable().optional(),
})

export const toggleCategoryStatusSchema = z.object({
  isActive: z.boolean(),
})

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().optional(),
  parentId: z.string().trim().nullable().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
})

export const getCategoryTreeQuerySchema = z.object({
  includeInactive: z
    .string()
    .optional()
    .transform((val) => val === "true"),
})
