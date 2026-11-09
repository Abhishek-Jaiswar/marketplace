import { Router } from "express"
import { catalogController } from "./catalog.controller.js"
import { optionalAuth, requireAuth } from "../../middlewares/auth.middleware.js"
import { requireRole } from "../../middlewares/role.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"

const router = Router()

const catalogMutationLimiter = rateLimiter({
  limit: 60,
  windowSeconds: 60,
  keyPrefix: "catalog-mutation",
})

// ---------------- Brands ----------------
router.get("/brands", catalogController.getBrands)
router.get("/brands/slug/:slug", catalogController.getBrandBySlug)
router.get("/brands/:id", catalogController.getBrandById)
router.post(
  "/brands",
  requireAuth,
  requireRole(["ADMIN"]),
  catalogMutationLimiter,
  catalogController.createBrand
)
router.put(
  "/brands/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  catalogMutationLimiter,
  catalogController.updateBrand
)

// ---------------- Storefront PDP ----------------
router.get("/pdp/:slug", catalogController.getStorefrontPDP)

// ---------------- Master Products (SPU) ----------------
router.get("/products", optionalAuth, catalogController.getProducts)
router.get(
  "/products/slug/:slug",
  optionalAuth,
  catalogController.getProductBySlug
)
router.get("/products/:id", optionalAuth, catalogController.getProductById)

router.post(
  "/products",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.createProduct
)

router.put(
  "/products/:id",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.updateProduct
)

router.patch(
  "/products/:id/review",
  requireAuth,
  requireRole(["ADMIN"]),
  catalogMutationLimiter,
  catalogController.reviewProduct
)

// ---------------- Product Variants (SKU) ----------------
router.post(
  "/products/:productId/variants",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.addVariant
)

router.put(
  "/variants/:id",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.updateVariant
)

// ---------------- Product Media ----------------
router.post(
  "/products/:productId/media",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.addProductMedia
)

router.delete(
  "/media/:id",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.removeProductMedia
)

// ---------------- Seller Listings (Offers) ----------------
router.get("/listings", catalogController.getListings)

router.post(
  "/listings",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.createListing
)

router.put(
  "/listings/:id",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  catalogMutationLimiter,
  catalogController.updateListing
)

export { router as catalogRouter }
