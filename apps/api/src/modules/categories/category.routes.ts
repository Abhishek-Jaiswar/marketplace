import { Router } from "express"
import { categoryController } from "./category.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { requireRole } from "../../middlewares/role.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"

const router = Router()

const categoryMutationLimiter = rateLimiter({
  limit: 30,
  windowSeconds: 60, // 30 mutations per minute
  keyPrefix: "category-mutation",
})

// Public Read Routes (Cached)
router.get("/tree", categoryController.getCategoryTree)
router.get("/slug/:slug", categoryController.getCategoryBySlug)
router.get("/:id", categoryController.getCategoryById)
router.get("/", categoryController.getCategories)

// Admin-Only Mutation Routes
router.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  categoryMutationLimiter,
  categoryController.createCategory
)

router.put(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  categoryMutationLimiter,
  categoryController.updateCategory
)

router.patch(
  "/:id/status",
  requireAuth,
  requireRole(["ADMIN"]),
  categoryMutationLimiter,
  categoryController.toggleCategoryStatus
)

router.delete(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  categoryMutationLimiter,
  categoryController.deleteCategory
)

export { router as categoryRouter }
