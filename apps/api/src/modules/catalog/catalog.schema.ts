import { z } from "zod"

// ---------------- Brands ----------------
export const createBrandSchema = z.object({
  name: z.string().trim().min(1, "Brand name is required").max(100),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly")
    .optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  website: z.string().trim().url("Invalid website URL").nullable().optional(),
  logoMediaId: z.string().trim().nullable().optional(),
  isVerified: z.boolean().optional().default(false),
})

export const updateBrandSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  website: z.string().trim().url("Invalid website URL").nullable().optional(),
  logoMediaId: z.string().trim().nullable().optional(),
  isVerified: z.boolean().optional(),
})

export const listBrandsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().optional(),
  isVerified: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
})

// ---------------- Products (Master SPU) ----------------
export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(255),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly")
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  highlights: z.array(z.string().trim().min(1)).optional().default([]),
  specifications: z.record(z.string(), z.unknown()).optional(),
  categoryId: z.string().trim().min(1, "Category is required"),
  brandId: z.string().trim().nullable().optional(),
})

export const updateProductSchema = z.object({
  title: z.string().trim().min(3).max(255).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().trim().min(10).optional(),
  highlights: z.array(z.string().trim().min(1)).optional(),
  specifications: z.record(z.string(), z.unknown()).optional(),
  categoryId: z.string().trim().min(1).optional(),
  brandId: z.string().trim().nullable().optional(),
})

export const reviewProductSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewFeedback: z.string().trim().max(1000).optional(),
})

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  category: z.string().trim().optional(),
  brandId: z.string().trim().optional(),
  sellerId: z.string().trim().optional(),
  status: z
    .enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "ARCHIVED"])
    .optional(),
})

// ---------------- Product Variants (Canonical SKU) ----------------
export const createProductVariantSchema = z.object({
  sku: z.string().trim().min(2, "Master SKU is required").max(100),
  barcode: z.string().trim().max(100).nullable().optional(),
  attributes: z.record(z.string(), z.unknown()),
  weightGrams: z.number().int().nonnegative().nullable().optional(),
  dimensions: z.record(z.string(), z.unknown()).nullable().optional(),
})

export const updateProductVariantSchema = z.object({
  sku: z.string().trim().min(2).max(100).optional(),
  barcode: z.string().trim().max(100).nullable().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DISCONTINUED"]).optional(),
  weightGrams: z.number().int().nonnegative().nullable().optional(),
  dimensions: z.record(z.string(), z.unknown()).nullable().optional(),
})

// ---------------- Product Media ----------------
export const addProductMediaSchema = z.object({
  mediaId: z.string().trim().min(1, "Media ID is required"),
  variantId: z.string().trim().nullable().optional(),
  isPrimary: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
})

// ---------------- Seller Listings (Offers) ----------------
export const createSellerListingSchema = z
  .object({
    variantId: z.string().trim().min(1, "Variant ID is required"),
    sellerSku: z.string().trim().min(1, "Seller SKU is required").max(100),
    mrpPrice: z.number().int().positive("MRP must be greater than 0"),
    sellingPrice: z
      .number()
      .int()
      .positive("Selling price must be greater than 0"),
    currency: z.string().trim().length(3).optional().default("INR"),
    condition: z
      .enum(["NEW", "REFURBISHED", "USED_LIKE_NEW", "USED_GOOD", "USED_FAIR"])
      .optional()
      .default("NEW"),
    conditionNote: z.string().trim().max(500).nullable().optional(),
    handlingTimeDays: z.number().int().min(0).max(30).optional().default(1),
    warranty: z.string().trim().max(255).nullable().optional(),
  })
  .refine((data) => data.sellingPrice <= data.mrpPrice, {
    message: "Selling price cannot exceed MRP",
    path: ["sellingPrice"],
  })

export const updateSellerListingSchema = z
  .object({
    mrpPrice: z.number().int().positive().optional(),
    sellingPrice: z.number().int().positive().optional(),
    condition: z
      .enum(["NEW", "REFURBISHED", "USED_LIKE_NEW", "USED_GOOD", "USED_FAIR"])
      .optional(),
    conditionNote: z.string().trim().max(500).nullable().optional(),
    handlingTimeDays: z.number().int().min(0).max(30).optional(),
    warranty: z.string().trim().max(255).nullable().optional(),
    status: z
      .enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "SUSPENDED"])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.mrpPrice && data.sellingPrice) {
        return data.sellingPrice <= data.mrpPrice
      }
      return true
    },
    {
      message: "Selling price cannot exceed MRP",
      path: ["sellingPrice"],
    }
  )

export const listSellerListingsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  variantId: z.string().trim().optional(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "SUSPENDED"])
    .optional(),
  sellerId: z.string().trim().optional(),
})
