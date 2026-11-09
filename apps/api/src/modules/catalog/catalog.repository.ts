import { MAX_UNPAGED_ROWS } from "../../utils/query-limits.js"
import { and, db, or, type Condition } from "@workspace/db"
type JSONValue = any
import type {
  CreateBrandInput,
  UpdateBrandInput,
  ListBrandsQuery,
  CreateProductInput,
  UpdateProductInput,
  ListProductsQuery,
  CreateProductVariantInput,
  UpdateProductVariantInput,
  AddProductMediaInput,
  CreateSellerListingInput,
  UpdateSellerListingInput,
  ListSellerListingsQuery,
} from "./catalog.types.js"
import type { ProductStatus } from "@workspace/db"

class CatalogRepository {
  // ---------------- Brands ----------------
  async findBrandById(id: string) {
    return await db.orm.public.Brand.include("logo", (media) =>
      media.select("id", "url", "fileName")
    ).first({ id })
  }

  async findBrandBySlug(slug: string) {
    return await db.orm.public.Brand.include("logo", (media) =>
      media.select("id", "url", "fileName")
    )
      .where({ slug })
      .first()
  }

  async findBrandByName(name: string) {
    return await db.orm.public.Brand.where({ name }).first()
  }

  async findBrands(params: ListBrandsQuery) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit
    const { search, isVerified } = params

    const where = (brand: any) => {
      const conditions: Condition[] = []
      if (isVerified !== undefined) {
        conditions.push(brand.isVerified.eq(isVerified))
      }
      if (search) {
        const term = `%${search}%`
        conditions.push(or(brand.name.ilike(term), brand.slug.ilike(term)))
      }
      return conditions.length > 0 ? and(...conditions) : and()
    }

    const query = db.orm.public.Brand.where(where)
      .orderBy((b) => b.name.asc())
      .offset(skip)
      .limit(limit)
      .include("logo", (media) => media.select("id", "url", "fileName"))

    const [items, totals] = await Promise.all([
      query.all(),
      db.orm.public.Brand.where(where).aggregate((aggregate) => ({
        total: aggregate.count(),
      })),
    ])

    return {
      items,
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
    }
  }

  async createBrand(data: CreateBrandInput & { slug: string }) {
    return await db.orm.public.Brand.include("logo", (media) =>
      media.select("id", "url", "fileName")
    ).create({
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      website: data.website ?? null,
      logoMediaId: data.logoMediaId ?? null,
      isVerified: data.isVerified ?? false,
    })
  }

  async updateBrand(id: string, data: UpdateBrandInput) {
    return await db.orm.public.Brand.include("logo", (media) =>
      media.select("id", "url", "fileName")
    )
      .where({ id })
      .update({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description ?? null,
        }),
        ...(data.website !== undefined && { website: data.website ?? null }),
        ...(data.logoMediaId !== undefined && {
          logoMediaId: data.logoMediaId ?? null,
        }),
        ...(data.isVerified !== undefined && { isVerified: data.isVerified }),
      })
  }

  // ---------------- Master Products (SPU) ----------------
  async findProductById(id: string) {
    return await db.orm.public.Product.include("category", (c) =>
      c.select("id", "name", "slug")
    )
      .include("brand", (b) => b.select("id", "name", "slug", "isVerified"))
      .include("variants")
      .include("media", (m) =>
        m.include("media", (media) =>
          media.select("id", "url", "fileName", "mimeType")
        )
      )
      .first({ id })
  }

  async findProductBySlug(slug: string) {
    return await db.orm.public.Product.include("category", (c) =>
      c.select("id", "name", "slug")
    )
      .include("brand", (b) => b.select("id", "name", "slug", "isVerified"))
      .include("variants")
      .include("media", (m) =>
        m.include("media", (media) =>
          media.select("id", "url", "fileName", "mimeType")
        )
      )
      .where({ slug })
      .first()
  }

  /** The category with this slug plus everything beneath it. */
  async findCategoryTreeIds(slug: string): Promise<string[]> {
    const categories = await db.orm.public.Category.select(
      "id",
      "slug",
      "parentId"
    )
      .limit(MAX_UNPAGED_ROWS)
      .all()

    const root = categories.find((category) => category.slug === slug)
    if (!root) return []

    const ids = [root.id]
    for (let index = 0; index < ids.length; index += 1) {
      for (const category of categories) {
        if (category.parentId === ids[index]) ids.push(category.id)
      }
    }
    return ids
  }

  async findProducts(
    params: ListProductsQuery & { categoryIds?: string[] | undefined }
  ) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit
    const { search, categoryId, categoryIds, brandId, status, sellerId } =
      params

    const where = (product: any) => {
      const conditions: Condition[] = []
      if (status !== undefined) {
        conditions.push(product.status.eq(status))
      }
      if (categoryId !== undefined) {
        conditions.push(product.categoryId.eq(categoryId))
      }
      if (categoryIds !== undefined) {
        // An unknown slug must match nothing, not everything.
        conditions.push(
          product.categoryId.in(categoryIds.length ? categoryIds : [""])
        )
      }
      if (brandId !== undefined) {
        conditions.push(product.brandId.eq(brandId))
      }
      if (sellerId !== undefined) {
        conditions.push(
          product.variants.some((variant: any) =>
            variant.listings.some((listing: any) =>
              listing.sellerId.eq(sellerId)
            )
          )
        )
      }
      if (search) {
        const term = `%${search}%`
        conditions.push(or(product.title.ilike(term), product.slug.ilike(term)))
      }
      return conditions.length > 0 ? and(...conditions) : and()
    }

    const query = db.orm.public.Product.where(where)
      .orderBy((p) => p.createdAt.desc())
      .offset(skip)
      .limit(limit)
      .include("category", (c) => c.select("id", "name", "slug"))
      .include("brand", (b) => b.select("id", "name", "slug", "isVerified"))
      .include("variants", (v) =>
        v
          .select("id", "sku", "status")
          .include("listings", (l) =>
            l.select("id", "sellerId", "mrpPrice", "sellingPrice", "status")
          )
      )
      .include("media", (m) =>
        m
          .select("id", "isPrimary", "sortOrder")
          .include("media", (media) => media.select("id", "url"))
      )

    const [items, totals] = await Promise.all([
      query.all(),
      db.orm.public.Product.where(where).aggregate((aggregate) => ({
        total: aggregate.count(),
      })),
    ])

    return {
      items,
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
    }
  }

  async createProduct(
    data: CreateProductInput & {
      slug: string
      status: ProductStatus
      createdById?: string | null
    }
  ) {
    return await db.orm.public.Product.include("category", (c) =>
      c.select("id", "name", "slug")
    )
      .include("brand", (b) => b.select("id", "name", "slug", "isVerified"))
      .create({
        title: data.title,
        slug: data.slug,
        description: data.description,
        highlights: data.highlights ?? [],
        specifications: (data.specifications as JSONValue) ?? null,
        categoryId: data.categoryId,
        brandId: data.brandId ?? null,
        status: data.status,
        createdById: data.createdById ?? null,
      })
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    return await db.orm.public.Product.include("category", (c) =>
      c.select("id", "name", "slug")
    )
      .include("brand", (b) => b.select("id", "name", "slug", "isVerified"))
      .where({ id })
      .update({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.highlights !== undefined && { highlights: data.highlights }),
        ...(data.specifications !== undefined && {
          specifications: (data.specifications as JSONValue) ?? null,
        }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.brandId !== undefined && { brandId: data.brandId ?? null }),
      })
  }

  async updateProductStatus(
    id: string,
    status: ProductStatus,
    reviewFeedback?: string,
    reviewedById?: string
  ) {
    return await db.orm.public.Product.where({ id }).update({
      status,
      ...(reviewFeedback !== undefined && { reviewFeedback }),
      ...(reviewedById !== undefined && { reviewedById }),
      ...(status === "APPROVED" && { approvedAt: new Date().toISOString() }),
    })
  }

  // ---------------- Product Variants (SKU) ----------------
  async findVariantById(id: string) {
    return await db.orm.public.ProductVariant.include("product", (p) =>
      p.select("id", "title", "slug", "status")
    ).first({ id })
  }

  async findVariantBySku(sku: string) {
    return await db.orm.public.ProductVariant.where({ sku }).first()
  }

  async findVariantsByProductId(productId: string) {
    return await db.orm.public.ProductVariant.where({ productId })
      .orderBy((v) => v.createdAt.asc())
      .limit(MAX_UNPAGED_ROWS)
      .all()
  }

  async createVariant(productId: string, data: CreateProductVariantInput) {
    return await db.orm.public.ProductVariant.create({
      productId,
      sku: data.sku,
      barcode: data.barcode ?? null,
      attributes: data.attributes as JSONValue,
      weightGrams: data.weightGrams ?? null,
      dimensions: (data.dimensions as JSONValue) ?? null,
      status: "ACTIVE",
    })
  }

  async updateVariant(id: string, data: UpdateProductVariantInput) {
    return await db.orm.public.ProductVariant.where({ id }).update({
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.barcode !== undefined && { barcode: data.barcode ?? null }),
      ...(data.attributes !== undefined && {
        attributes: data.attributes as JSONValue,
      }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.weightGrams !== undefined && {
        weightGrams: data.weightGrams ?? null,
      }),
      ...(data.dimensions !== undefined && {
        dimensions: (data.dimensions as JSONValue) ?? null,
      }),
    })
  }

  // ---------------- Product Media ----------------
  async addProductMedia(productId: string, data: AddProductMediaInput) {
    return await db.orm.public.ProductMedia.create({
      productId,
      mediaId: data.mediaId,
      variantId: data.variantId ?? null,
      isPrimary: data.isPrimary ?? false,
      sortOrder: data.sortOrder ?? 0,
    })
  }

  async removeProductMedia(id: string) {
    return await db.orm.public.ProductMedia.where({ id }).delete()
  }

  // ---------------- Seller Listings (Offers) ----------------
  async findListingById(id: string) {
    return await db.orm.public.SellerListing.include("seller", (s) =>
      s.select("id", "businessName", "status")
    )
      .include("variant", (v) =>
        v.select("id", "sku", "attributes", "productId")
      )
      .include("inventoryItems")
      .first({ id })
  }

  async findListingBySellerAndVariant(sellerId: string, variantId: string) {
    return await db.orm.public.SellerListing.where({
      sellerId,
      variantId,
    }).first()
  }

  async findListingBySellerAndSku(sellerId: string, sellerSku: string) {
    return await db.orm.public.SellerListing.where({
      sellerId,
      sellerSku,
    }).first()
  }

  async findListingsByVariant(variantId: string) {
    return await db.orm.public.SellerListing.where({
      variantId,
      status: "ACTIVE",
    })
      .orderBy((l) => l.sellingPrice.asc())
      .include("seller", (s) =>
        s
          .select("id", "businessName", "status")
          .include("store", (store) => store.select("slug", "displayName"))
      )
      .include("inventoryItems", (inv) =>
        inv.select("id", "onHand", "reserved", "safetyStock", "locationId")
      )
      .limit(MAX_UNPAGED_ROWS)
      .all()
  }

  async findListings(params: ListSellerListingsQuery) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit
    const { variantId, status, sellerId } = params

    const where = (listing: any) => {
      const conditions: Condition[] = []
      if (sellerId !== undefined) {
        conditions.push(listing.sellerId.eq(sellerId))
      }
      if (variantId !== undefined) {
        conditions.push(listing.variantId.eq(variantId))
      }
      if (status !== undefined) {
        conditions.push(listing.status.eq(status))
      }
      return conditions.length > 0 ? and(...conditions) : and()
    }

    const query = db.orm.public.SellerListing.where(where)
      .orderBy((l) => l.createdAt.desc())
      .offset(skip)
      .limit(limit)
      .include("variant", (v) =>
        v.select("id", "sku", "attributes", "productId")
      )
      .include("inventoryItems")

    const [items, totals] = await Promise.all([
      query.all(),
      db.orm.public.SellerListing.where(where).aggregate((aggregate) => ({
        total: aggregate.count(),
      })),
    ])

    return {
      items,
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
    }
  }

  async createListing(sellerId: string, data: CreateSellerListingInput) {
    return await db.orm.public.SellerListing.include("variant", (v) =>
      v.select("id", "sku", "attributes", "productId")
    ).create({
      sellerId,
      variantId: data.variantId,
      sellerSku: data.sellerSku,
      mrpPrice: data.mrpPrice,
      sellingPrice: data.sellingPrice,
      currency: data.currency ?? "INR",
      condition: data.condition ?? "NEW",
      conditionNote: data.conditionNote ?? null,
      handlingTimeDays: data.handlingTimeDays ?? 1,
      warranty: data.warranty ?? null,
      status: "ACTIVE",
    })
  }

  async updateListing(id: string, data: UpdateSellerListingInput) {
    return await db.orm.public.SellerListing.include("variant", (v) =>
      v.select("id", "sku", "attributes", "productId")
    )
      .where({ id })
      .update({
        ...(data.mrpPrice !== undefined && { mrpPrice: data.mrpPrice }),
        ...(data.sellingPrice !== undefined && {
          sellingPrice: data.sellingPrice,
        }),
        ...(data.condition !== undefined && { condition: data.condition }),
        ...(data.conditionNote !== undefined && {
          conditionNote: data.conditionNote ?? null,
        }),
        ...(data.handlingTimeDays !== undefined && {
          handlingTimeDays: data.handlingTimeDays,
        }),
        ...(data.warranty !== undefined && { warranty: data.warranty ?? null }),
        ...(data.status !== undefined && { status: data.status }),
      })
  }
}

export const catalogRepository = new CatalogRepository()
