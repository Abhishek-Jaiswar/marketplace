import { Router } from "express"
import { inventoryController } from "./inventory.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"
import { requireRole } from "../../middlewares/role.middleware.js"
import { rateLimiter } from "../../middlewares/rate-limiter.middleware.js"

const router = Router()

const inventoryMutationLimiter = rateLimiter({
  limit: 60,
  windowSeconds: 60,
  keyPrefix: "inventory-mutation",
})

// ---------------- Locations ----------------
router.get(
  "/locations",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  inventoryController.getLocations
)

router.post(
  "/locations",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  inventoryMutationLimiter,
  inventoryController.createLocation
)

router.put(
  "/locations/:id",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  inventoryMutationLimiter,
  inventoryController.updateLocation
)

// ---------------- Stock Adjustments ----------------
router.post(
  "/adjust",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  inventoryMutationLimiter,
  inventoryController.adjustStock
)

// ---------------- Reservation Engine ----------------
router.post("/reserve", inventoryMutationLimiter, inventoryController.reserveStock)
router.post("/commit", inventoryMutationLimiter, inventoryController.commitReservation)
router.post("/release", inventoryMutationLimiter, inventoryController.releaseReservation)

// ---------------- Inventory & Ledger Queries ----------------
router.get(
  "/items",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  inventoryController.getInventory
)

router.get(
  "/ledger",
  requireAuth,
  requireRole(["SELLER", "ADMIN"]),
  inventoryController.getLedger
)

export { router as inventoryRouter }
