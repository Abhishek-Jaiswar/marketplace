import { Router } from "express"

import { requireAuth } from "../../middlewares/auth.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"
import { requireRole } from "../../middlewares/role.middleware.js"
import { inventoryController } from "./inventory.controller.js"

const router = Router()

const sellerOrAdmin = [requireAuth, requireRole(["SELLER", "ADMIN"])]
// Checkout will call inventoryService in-process; these stay admin-only until then.
const adminOnly = [requireAuth, requireRole(["ADMIN"])]

const mutationLimiter = rateLimiter({
  limit: 60,
  windowSeconds: 60,
  keyPrefix: "inventory-mutation",
})

router.get("/locations", sellerOrAdmin, inventoryController.getLocations)
router.post(
  "/locations",
  sellerOrAdmin,
  mutationLimiter,
  inventoryController.createLocation
)
router.put(
  "/locations/:id",
  sellerOrAdmin,
  mutationLimiter,
  inventoryController.updateLocation
)

router.post(
  "/adjust",
  sellerOrAdmin,
  mutationLimiter,
  inventoryController.adjustStock
)

router.post(
  "/reserve",
  adminOnly,
  mutationLimiter,
  inventoryController.reserveStock
)
router.post(
  "/commit",
  adminOnly,
  mutationLimiter,
  inventoryController.commitReservation
)
router.post(
  "/release",
  adminOnly,
  mutationLimiter,
  inventoryController.releaseReservation
)

router.get("/items", sellerOrAdmin, inventoryController.getInventory)
router.get("/ledger", sellerOrAdmin, inventoryController.getLedger)

export { router as inventoryRouter }
