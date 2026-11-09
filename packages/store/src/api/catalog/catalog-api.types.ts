export interface Brand {
  id: string
  name: string
  slug: string
  description?: string | null
  website?: string | null
  logoMediaId?: string | null
  logo?: { id: string; url: string; fileName: string } | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  barcode?: string | null
  attributes: Record<string, unknown>
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED"
  weightGrams?: number | null
  dimensions?: Record<string, unknown> | null
  listings?: Array<{
    id: string
    sellerId: string
    mrpPrice: number
    sellingPrice: number
    status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "SUSPENDED"
  }>
  createdAt: string
  updatedAt: string
}

export interface ProductMedia {
  id: string
  isPrimary: boolean
  sortOrder: number
  media?: { id: string; url: string }
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  highlights?: string[]
  specifications?: Record<string, unknown> | null
  categoryId: string
  category?: { id: string; name: string; slug: string }
  brandId?: string | null
  brand?: { id: string; name: string; slug: string; isVerified: boolean } | null
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED"
  reviewFeedback?: string | null
  approvedAt?: string | null
  createdById?: string | null
  variants?: ProductVariant[]
  media?: ProductMedia[]
  createdAt: string
  updatedAt: string
}

export interface SellerListing {
  id: string
  sellerId: string
  seller?: { id: string; businessName: string; status: string }
  variantId: string
  variant?: {
    id: string
    sku: string
    attributes: Record<string, unknown>
    productId: string
  }
  sellerSku: string
  mrpPrice: number
  sellingPrice: number
  currency: string
  condition: "NEW" | "REFURBISHED" | "USED_LIKE_NEW" | "USED_GOOD" | "USED_FAIR"
  conditionNote?: string | null
  handlingTimeDays: number
  warranty?: string | null
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "SUSPENDED"
  inventoryItems?: Array<{
    id: string
    onHand: number
    reserved: number
    safetyStock: number
    locationId: string
  }>
  createdAt: string
  updatedAt: string
}

export interface ListBrandsParams {
  page?: number
  limit?: number
  search?: string
  isVerified?: boolean
}

export interface ListBrandsResponse {
  items: Brand[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateBrandRequest {
  name: string
  slug?: string
  description?: string | null
  website?: string | null
  logoMediaId?: string | null
  isVerified?: boolean
}

export interface ListProductsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  category?: string
  brandId?: string
  sellerId?: string
  status?: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED"
}

export interface ListProductsResponse {
  items: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateProductRequest {
  title: string
  slug?: string
  description: string
  highlights?: string[]
  specifications?: Record<string, unknown>
  categoryId: string
  brandId?: string | null
}

export interface ReviewProductRequest {
  id: string
  status: "APPROVED" | "REJECTED"
  reviewFeedback?: string
}

export interface CreateVariantRequest {
  productId: string
  sku: string
  barcode?: string | null
  attributes: Record<string, unknown>
  weightGrams?: number | null
  dimensions?: Record<string, unknown> | null
}

export interface ListListingsParams {
  page?: number
  limit?: number
  variantId?: string
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "SUSPENDED"
  sellerId?: string
}

export interface ListListingsResponse {
  items: SellerListing[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateListingRequest {
  variantId: string
  sellerSku: string
  mrpPrice: number
  sellingPrice: number
  currency?: string
  condition?:
    "NEW" | "REFURBISHED" | "USED_LIKE_NEW" | "USED_GOOD" | "USED_FAIR"
  conditionNote?: string | null
  handlingTimeDays?: number
  warranty?: string | null
}

export interface UpdateListingRequest {
  id: string
  mrpPrice?: number
  sellingPrice?: number
  condition?:
    "NEW" | "REFURBISHED" | "USED_LIKE_NEW" | "USED_GOOD" | "USED_FAIR"
  conditionNote?: string | null
  handlingTimeDays?: number
  warranty?: string | null
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "SUSPENDED"
}

export interface StorefrontOffer {
  id: string
  mrpPrice: number
  sellingPrice: number
  availableStock: number
  handlingTimeDays: number
  codEnabled: boolean
  condition: string
  isInStock: boolean
  seller?: {
    id: string
    businessName: string
    status: string
    store?: { slug: string; displayName: string } | null
  }
}

export interface StorefrontPdp {
  product: Pick<
    Product,
    | "id"
    | "title"
    | "slug"
    | "description"
    | "highlights"
    | "specifications"
    | "category"
    | "brand"
  > & { media?: ProductMedia[] }
  variants: Array<
    ProductVariant & {
      buyBoxWinner: StorefrontOffer | null
      allOffers: StorefrontOffer[]
    }
  >
}
