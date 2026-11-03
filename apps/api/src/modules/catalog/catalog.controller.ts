import type { Request, Response, NextFunction } from "express"
import { catalogService } from "./catalog.service.js"
import {
  createBrandSchema,
  updateBrandSchema,
  listBrandsQuerySchema,
  createProductSchema,
  updateProductSchema,
  reviewProductSchema,
  listProductsQuerySchema,
  createProductVariantSchema,
  updateProductVariantSchema,
  addProductMediaSchema,
  createSellerListingSchema,
  updateSellerListingSchema,
  listSellerListingsQuerySchema,
} from "./catalog.schema.js"
import { BadRequestError, UnauthorizedError } from "../../utils/errors/index.js"

function getSingleParam(param: string | string[] | undefined): string {
  if (typeof param === "string") return param
  if (Array.isArray(param) && param[0]) return param[0]
  return ""
}

class CatalogController {
  // ---------------- Brands ----------------
  getBrands = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = listBrandsQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid query parameters")
      }
      const result = await catalogService.getBrands(parsed.data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getBrandById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      const brand = await catalogService.getBrandById(id)
      res.status(200).json({ data: brand })
    } catch (error) {
      next(error)
    }
  }

  getBrandBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = getSingleParam(req.params.slug)
      const brand = await catalogService.getBrandBySlug(slug)
      res.status(200).json({ data: brand })
    } catch (error) {
      next(error)
    }
  }

  createBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createBrandSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid input")
      }
      const brand = await catalogService.createBrand(parsed.data)
      res.status(201).json({ data: brand, message: "Brand created successfully" })
    } catch (error) {
      next(error)
    }
  }

  updateBrand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      const parsed = updateBrandSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid input")
      }
      const brand = await catalogService.updateBrand(id, parsed.data)
      res.status(200).json({ data: brand, message: "Brand updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Master Products (SPU) ----------------
  getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = listProductsQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid query parameters")
      }
      const result = await catalogService.getProducts(parsed.data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      const product = await catalogService.getProductById(id)
      res.status(200).json({ data: product })
    } catch (error) {
      next(error)
    }
  }

  getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = getSingleParam(req.params.slug)
      const product = await catalogService.getProductBySlug(slug)
      res.status(200).json({ data: product })
    } catch (error) {
      next(error)
    }
  }

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const parsed = createProductSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid input")
      }
      const product = await catalogService.createProduct(req.user, parsed.data)
      res.status(201).json({
        data: product,
        message:
          product.status === "PENDING_REVIEW"
            ? "Product submitted for catalog review"
            : "Product created successfully",
      })
    } catch (error) {
      next(error)
    }
  }

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      const parsed = updateProductSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid input")
      }
      const product = await catalogService.updateProduct(id, parsed.data)
      res.status(200).json({ data: product, message: "Product updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  reviewProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const id = getSingleParam(req.params.id)
      const parsed = reviewProductSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid review payload")
      }
      const product = await catalogService.reviewProduct(id, req.user.userId, parsed.data)
      res.status(200).json({ data: product, message: `Product ${parsed.data.status.toLowerCase()} successfully` })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Variants ----------------
  addVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = getSingleParam(req.params.productId)
      const parsed = createProductVariantSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid variant data")
      }
      const variant = await catalogService.addVariant(productId, parsed.data)
      res.status(201).json({ data: variant, message: "Variant created successfully" })
    } catch (error) {
      next(error)
    }
  }

  updateVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      const parsed = updateProductVariantSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid variant data")
      }
      const variant = await catalogService.updateVariant(id, parsed.data)
      res.status(200).json({ data: variant, message: "Variant updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Media ----------------
  addProductMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = getSingleParam(req.params.productId)
      const parsed = addProductMediaSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid media association")
      }
      const media = await catalogService.addMedia(productId, parsed.data)
      res.status(201).json({ data: media, message: "Media added to product" })
    } catch (error) {
      next(error)
    }
  }

  removeProductMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getSingleParam(req.params.id)
      await catalogService.removeMedia(id)
      res.status(200).json({ message: "Media removed successfully" })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Seller Listings ----------------
  createListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const parsed = createSellerListingSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid listing input")
      }
      const listing = await catalogService.createListing(req.user.userId, parsed.data)
      res.status(201).json({ data: listing, message: "Offer listed successfully" })
    } catch (error) {
      next(error)
    }
  }

  updateListing = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const id = getSingleParam(req.params.id)
      const parsed = updateSellerListingSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid listing update")
      }
      const isAdmin = req.user.roles.includes("ADMIN")
      const listing = await catalogService.updateListing(id, req.user.userId, isAdmin, parsed.data)
      res.status(200).json({ data: listing, message: "Listing updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  getListings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = listSellerListingsQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid query parameters")
      }
      const result = await catalogService.getListings(parsed.data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Storefront PDP ----------------
  getStorefrontPDP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = getSingleParam(req.params.slug)
      const pdp = await catalogService.getStorefrontPDP(slug)
      res.status(200).json({ data: pdp })
    } catch (error) {
      next(error)
    }
  }
}

export const catalogController = new CatalogController()
