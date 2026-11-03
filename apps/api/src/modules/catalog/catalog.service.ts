import { db } from "@workspace/db"
import { catalogRepository } from "./catalog.repository.js"
import { catalogCache } from "./catalog.cache.js"
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors/index.js"
import type {
  CreateBrandInput,
  UpdateBrandInput,
  ListBrandsQuery,
  CreateProductInput,
  UpdateProductInput,
  ListProductsQuery,
  ReviewProductInput,
  CreateProductVariantInput,
  UpdateProductVariantInput,
  AddProductMediaInput,
  CreateSellerListingInput,
  UpdateSellerListingInput,
  ListSellerListingsQuery,
} from "./catalog.types.js"
import type { ProductStatus } from "@workspace/db"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

class CatalogService {
  // ---------------- Brands ----------------
  async getBrands(query: ListBrandsQuery) {
    return catalogCache.getOrSetBrandList(
      query.page ?? 1,
      query.limit ?? 20,
      query.search,
      query.isVerified,
      () => catalogRepository.findBrands(query)
    )
  }

  async getBrandById(id: string) {
    const brand = await catalogRepository.findBrandById(id)
    if (!brand) throw new NotFoundError("Brand not found")
    return brand
  }

  async getBrandBySlug(slug: string) {
    const brand = await catalogRepository.findBrandBySlug(slug)
    if (!brand) throw new NotFoundError("Brand not found")
    return brand
  }

  async createBrand(data: CreateBrandInput) {
    const existing = await catalogRepository.findBrandByName(data.name)
    if (existing) throw new ConflictError("Brand with this name already exists")

    const slug = data.slug || slugify(data.name)
    const existingSlug = await catalogRepository.findBrandBySlug(slug)
    if (existingSlug) throw new ConflictError("Brand with this slug already exists")

    const brand = await catalogRepository.createBrand({ ...data, slug })
    await catalogCache.invalidateCatalog()
    return brand
  }

  async updateBrand(id: string, data: UpdateBrandInput) {
    const existing = await catalogRepository.findBrandById(id)
    if (!existing) throw new NotFoundError("Brand not found")

    if (data.name && data.name !== existing.name) {
      const nameConflict = await catalogRepository.findBrandByName(data.name)
      if (nameConflict) throw new ConflictError("Brand with this name already exists")
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await catalogRepository.findBrandBySlug(data.slug)
      if (slugConflict) throw new ConflictError("Brand with this slug already exists")
    }

    const brand = await catalogRepository.updateBrand(id, data)
    await catalogCache.invalidateCatalog()
    return brand
  }

  // ---------------- Master Products (SPU) ----------------
  async getProducts(query: ListProductsQuery) {
    return catalogCache.getOrSetProductList(
      query.page ?? 1,
      query.limit ?? 20,
      query.search,
      query.categoryId,
      query.brandId,
      query.status,
      () => catalogRepository.findProducts(query)
    )
  }

  async getProductById(id: string) {
    const product = await catalogRepository.findProductById(id)
    if (!product) throw new NotFoundError("Product not found")
    return product
  }

  async getProductBySlug(slug: string) {
    const product = await catalogRepository.findProductBySlug(slug)
    if (!product) throw new NotFoundError("Product not found")
    return product
  }

  async createProduct(
    user: { userId: string; roles: readonly string[] | string[] },
    data: CreateProductInput
  ) {
    const category = await db.orm.public.Category.first({ id: data.categoryId })
    if (!category || !category.isActive) {
      throw new NotFoundError("Category not found or inactive")
    }

    if (data.brandId) {
      const brand = await catalogRepository.findBrandById(data.brandId)
      if (!brand) throw new NotFoundError("Brand not found")
    }

    const slug = data.slug || slugify(data.title)
    const existingSlug = await catalogRepository.findProductBySlug(slug)
    if (existingSlug) throw new ConflictError("Product with this slug already exists")

    const isAdmin = user.roles.includes("ADMIN")
    // Amazon/Flipkart workflow: Sellers proposing new products submit to PENDING_REVIEW; Admins can auto-approve
    const status: ProductStatus = isAdmin ? "APPROVED" : "PENDING_REVIEW"

    const product = await catalogRepository.createProduct({
      ...data,
      slug,
      status,
      createdById: user.userId,
    })

    await catalogCache.invalidateCatalog()
    return product
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const existing = await catalogRepository.findProductById(id)
    if (!existing) throw new NotFoundError("Product not found")

    if (data.categoryId) {
      const category = await db.orm.public.Category.first({ id: data.categoryId })
      if (!category || !category.isActive) {
        throw new NotFoundError("Category not found or inactive")
      }
    }

    if (data.brandId) {
      const brand = await catalogRepository.findBrandById(data.brandId)
      if (!brand) throw new NotFoundError("Brand not found")
    }

    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await catalogRepository.findProductBySlug(data.slug)
      if (slugConflict) throw new ConflictError("Product with this slug already exists")
    }

    const product = await catalogRepository.updateProduct(id, data)
    await catalogCache.invalidateCatalog()
    return product
  }

  async reviewProduct(id: string, adminUserId: string, data: ReviewProductInput) {
    const existing = await catalogRepository.findProductById(id)
    if (!existing) throw new NotFoundError("Product not found")

    if (existing.status !== "PENDING_REVIEW" && existing.status !== "DRAFT") {
      throw new BadRequestError(`Cannot review product in ${existing.status} status`)
    }

    const updated = await catalogRepository.updateProductStatus(
      id,
      data.status,
      data.reviewFeedback,
      adminUserId
    )

    await catalogCache.invalidateCatalog()
    return updated
  }

  // ---------------- Variants ----------------
  async addVariant(productId: string, data: CreateProductVariantInput) {
    const product = await catalogRepository.findProductById(productId)
    if (!product) throw new NotFoundError("Product not found")

    const existingSku = await catalogRepository.findVariantBySku(data.sku)
    if (existingSku) throw new ConflictError(`Variant with SKU '${data.sku}' already exists`)

    if (data.barcode) {
      const existingBarcode = await db.orm.public.ProductVariant.where({ barcode: data.barcode }).first()
      if (existingBarcode) throw new ConflictError(`Variant with barcode '${data.barcode}' already exists`)
    }

    const variant = await catalogRepository.createVariant(productId, data)
    await catalogCache.invalidateCatalog()
    return variant
  }

  async updateVariant(id: string, data: UpdateProductVariantInput) {
    const existing = await catalogRepository.findVariantById(id)
    if (!existing) throw new NotFoundError("Variant not found")

    if (data.sku && data.sku !== existing.sku) {
      const skuConflict = await catalogRepository.findVariantBySku(data.sku)
      if (skuConflict) throw new ConflictError(`Variant with SKU '${data.sku}' already exists`)
    }

    if (data.barcode && data.barcode !== existing.barcode) {
      const barcodeConflict = await db.orm.public.ProductVariant.where({ barcode: data.barcode }).first()
      if (barcodeConflict) throw new ConflictError(`Variant with barcode '${data.barcode}' already exists`)
    }

    const variant = await catalogRepository.updateVariant(id, data)
    await catalogCache.invalidateCatalog()
    return variant
  }

  // ---------------- Media ----------------
  async addMedia(productId: string, data: AddProductMediaInput) {
    const product = await catalogRepository.findProductById(productId)
    if (!product) throw new NotFoundError("Product not found")

    const media = await db.orm.public.Media.first({ id: data.mediaId })
    if (!media) throw new NotFoundError("Media asset not found")

    if (data.variantId) {
      const variant = await catalogRepository.findVariantById(data.variantId)
      if (!variant) throw new NotFoundError("Variant not found")
    }

    const result = await catalogRepository.addProductMedia(productId, data)
    await catalogCache.invalidateCatalog()
    return result
  }

  async removeMedia(mediaId: string) {
    await catalogRepository.removeProductMedia(mediaId)
    await catalogCache.invalidateCatalog()
  }

  // ---------------- Seller Listings (Offers) ----------------
  async createListing(userId: string, data: CreateSellerListingInput) {
    const seller = await db.orm.public.Seller.first({ ownerUserId: userId })
    if (!seller || seller.status !== "APPROVED") {
      throw new ForbiddenError("Only approved sellers can list offers")
    }

    const variant = await catalogRepository.findVariantById(data.variantId)
    if (!variant || !variant.product) throw new NotFoundError("Product variant not found")
    if (variant.product.status !== "APPROVED") {
      throw new BadRequestError("Cannot list offer on unapproved product")
    }

    const existingListing = await catalogRepository.findListingBySellerAndVariant(
      seller.id,
      data.variantId
    )
    if (existingListing) {
      throw new ConflictError("You already have an active listing for this variant")
    }

    const skuConflict = await catalogRepository.findListingBySellerAndSku(
      seller.id,
      data.sellerSku
    )
    if (skuConflict) {
      throw new ConflictError(`Seller SKU '${data.sellerSku}' is already used in your catalog`)
    }

    const listing = await catalogRepository.createListing(seller.id, data)
    await catalogCache.invalidateCatalog()
    return listing
  }

  async updateListing(
    listingId: string,
    userId: string,
    isAdmin: boolean,
    data: UpdateSellerListingInput
  ) {
    const listing = await catalogRepository.findListingById(listingId)
    if (!listing) throw new NotFoundError("Listing not found")

    if (!isAdmin) {
      const seller = await db.orm.public.Seller.first({ ownerUserId: userId })
      if (!seller || seller.id !== listing.sellerId) {
        throw new ForbiddenError("You do not have permission to modify this listing")
      }
    }

    const updated = await catalogRepository.updateListing(listingId, data)
    await catalogCache.invalidateCatalog()
    return updated
  }

  async getListings(query: ListSellerListingsQuery) {
    return await catalogRepository.findListings(query)
  }

  // ---------------- Storefront PDP with Buy Box ----------------
  async getStorefrontPDP(slug: string) {
    const product = await catalogRepository.findProductBySlug(slug)
    if (!product || product.status !== "APPROVED") {
      throw new NotFoundError("Product not found")
    }

    // For each variant, fetch offers and resolve the Buy Box winner
    const variantsWithOffers = await Promise.all(
      product.variants.map(async (variant: any) => {
        const offers = await catalogRepository.findListingsByVariant(variant.id)

        // Compute available stock per offer across all locations
        const offersWithStock = offers.map((offer) => {
          const totalOnHand = offer.inventoryItems.reduce((acc, item) => acc + item.onHand, 0)
          const totalReserved = offer.inventoryItems.reduce((acc, item) => acc + item.reserved, 0)
          const totalSafety = offer.inventoryItems.reduce((acc, item) => acc + item.safetyStock, 0)
          const availableStock = Math.max(0, totalOnHand - totalReserved - totalSafety)

          return {
            ...offer,
            availableStock,
            isInStock: availableStock > 0,
          }
        })

        // Buy Box algorithm: in-stock offers first, sorted by lowest selling price
        const eligibleOffers = offersWithStock.filter((o) => o.isInStock)
        const buyBoxWinner = eligibleOffers.length > 0 ? eligibleOffers[0] : (offersWithStock[0] ?? null)

        return {
          ...variant,
          buyBoxWinner,
          allOffers: offersWithStock,
        }
      })
    )

    return {
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        highlights: product.highlights,
        specifications: product.specifications,
        category: product.category,
        brand: product.brand,
        media: product.media,
      },
      variants: variantsWithOffers,
    }
  }
}

export const catalogService = new CatalogService()
