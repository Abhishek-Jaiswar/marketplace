import type { Request, Response, NextFunction } from "express"
import { inventoryService } from "./inventory.service.js"
import {
  createLocationSchema,
  updateLocationSchema,
  adjustStockSchema,
  reserveStockSchema,
  commitReservationSchema,
  releaseReservationSchema,
  listInventoryQuerySchema,
  listLedgerQuerySchema,
} from "./inventory.schema.js"
import { BadRequestError, UnauthorizedError } from "../../utils/errors/index.js"

function getSingleParam(param: string | string[] | undefined): string {
  if (typeof param === "string") return param
  if (Array.isArray(param) && param[0]) return param[0]
  return ""
}

class InventoryController {
  // ---------------- Locations ----------------
  getLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const isAdmin = req.user.roles.includes("ADMIN")
      const locations = await inventoryService.getLocations(req.user.userId, isAdmin)
      res.status(200).json({ data: locations })
    } catch (error) {
      next(error)
    }
  }

  createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const parsed = createLocationSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid location input")
      }
      const location = await inventoryService.createLocation(req.user, parsed.data)
      res.status(201).json({ data: location, message: "Inventory location created successfully" })
    } catch (error) {
      next(error)
    }
  }

  updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const id = getSingleParam(req.params.id)
      const parsed = updateLocationSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid location input")
      }
      const location = await inventoryService.updateLocation(id, req.user, parsed.data)
      res.status(200).json({ data: location, message: "Inventory location updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Stock Adjustments ----------------
  adjustStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const parsed = adjustStockSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid stock adjustment")
      }
      const result = await inventoryService.adjustStock(req.user, parsed.data)
      res.status(200).json({ data: result, message: "Stock adjusted and ledger recorded successfully" })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Reservation Engine ----------------
  reserveStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = reserveStockSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid reservation request")
      }
      const result = await inventoryService.reserveStock(parsed.data)
      res.status(200).json({ data: result, message: "Stock reserved successfully" })
    } catch (error) {
      next(error)
    }
  }

  commitReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = commitReservationSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid commit payload")
      }
      const result = await inventoryService.commitReservation(parsed.data, req.user?.userId)
      res.status(200).json({ data: result, message: "Reservation committed and order fulfilled" })
    } catch (error) {
      next(error)
    }
  }

  releaseReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = releaseReservationSchema.safeParse(req.body)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid release payload")
      }
      const result = await inventoryService.releaseReservation(parsed.data)
      res.status(200).json({ data: result, message: "Reservation released successfully" })
    } catch (error) {
      next(error)
    }
  }

  // ---------------- Queries ----------------
  getInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const parsed = listInventoryQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid query parameters")
      }
      const result = await inventoryService.getInventory(parsed.data, req.user)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getLedger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required")
      const parsed = listLedgerQuerySchema.safeParse(req.query)
      if (!parsed.success) {
        throw new BadRequestError(parsed.error.issues[0]?.message || "Invalid query parameters")
      }
      const result = await inventoryService.getLedger(parsed.data, req.user)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const inventoryController = new InventoryController()
