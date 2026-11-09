import type {
  ProductStatus,
  VariantStatus,
  ListingStatus,
  ItemCondition,
} from "@workspace/db"

export interface ListBrandsQuery {
  page?: number | undefined
  limit?: number | undefined
  search?: string | undefined
  isVerified?: boolean | undefined
}

export interface CreateBrandInput {
  name: string
  slug?: string | undefined
  description?: string | null | undefined
  website?: string | null | undefined
  logoMediaId?: string | null | undefined
  isVerified?: boolean | undefined
}

export interface UpdateBrandInput {
  name?: string | undefined
  slug?: string | undefined
  description?: string | null | undefined
  website?: string | null | undefined
  logoMediaId?: string | null | undefined
  isVerified?: boolean | undefined
}

export interface ListProductsQuery {
  page?: number | undefined
  limit?: number | undefined
  search?: string | undefined
  categoryId?: string | undefined
  category?: string | undefined
  brandId?: string | undefined
  sellerId?: string | undefined
  status?: ProductStatus | undefined
}

export interface CreateProductInput {
  title: string
  slug?: string | undefined
  description: string
  highlights?: string[] | undefined
  specifications?: Record<string, unknown> | undefined
  categoryId: string
  brandId?: string | null | undefined
}

export interface UpdateProductInput {
  title?: string | undefined
  slug?: string | undefined
  description?: string | undefined
  highlights?: string[] | undefined
  specifications?: Record<string, unknown> | undefined
  categoryId?: string | undefined
  brandId?: string | null | undefined
}

export interface ReviewProductInput {
  status: "APPROVED" | "REJECTED"
  reviewFeedback?: string | undefined
}

export interface CreateProductVariantInput {
  sku: string
  barcode?: string | null | undefined
  attributes: Record<string, unknown>
  weightGrams?: number | null | undefined
  dimensions?: Record<string, unknown> | null | undefined
}

export interface UpdateProductVariantInput {
  sku?: string | undefined
  barcode?: string | null | undefined
  attributes?: Record<string, unknown> | undefined
  status?: VariantStatus | undefined
  weightGrams?: number | null | undefined
  dimensions?: Record<string, unknown> | null | undefined
}

export interface AddProductMediaInput {
  mediaId: string
  variantId?: string | null | undefined
  isPrimary?: boolean | undefined
  sortOrder?: number | undefined
}

export interface CreateSellerListingInput {
  variantId: string
  sellerSku: string
  mrpPrice: number
  sellingPrice: number
  currency?: string | undefined
  condition?: ItemCondition | undefined
  conditionNote?: string | null | undefined
  handlingTimeDays?: number | undefined
  warranty?: string | null | undefined
}

export interface UpdateSellerListingInput {
  mrpPrice?: number | undefined
  sellingPrice?: number | undefined
  condition?: ItemCondition | undefined
  conditionNote?: string | null | undefined
  handlingTimeDays?: number | undefined
  warranty?: string | null | undefined
  status?: ListingStatus | undefined
}

export interface ListSellerListingsQuery {
  page?: number | undefined
  limit?: number | undefined
  variantId?: string | undefined
  status?: ListingStatus | undefined
  sellerId?: string | undefined
}
