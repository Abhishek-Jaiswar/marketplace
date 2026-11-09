import type { Request, Response } from "express"
import { idParamSchema } from "@workspace/contracts/common"
import {
  adjustStockSchema,
  commitReservationSchema,
  createLocationSchema,
  listInventoryQuerySchema,
  listLedgerQuerySchema,
  releaseReservationSchema,
  reserveStockSchema,
  updateLocationSchema,
} from "@workspace/contracts/inventory"

import { getAuthUser, parse } from "../../utils/http/request.js"
import {
  sendCreated,
  sendOk,
  sendPaginated,
} from "../../utils/http/response.js"
import { inventoryService } from "./inventory.service.js"

class InventoryController {
  getLocations = async (req: Request, res: Response): Promise<void> => {
    const locations = await inventoryService.getLocations(getAuthUser(req))
    sendOk(res, locations)
  }

  createLocation = async (req: Request, res: Response): Promise<void> => {
    const location = await inventoryService.createLocation(
      getAuthUser(req),
      parse(createLocationSchema, req.body)
    )
    sendCreated(res, location, "Inventory location created successfully")
  }

  updateLocation = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamSchema, req.params)
    const location = await inventoryService.updateLocation(
      id,
      getAuthUser(req),
      parse(updateLocationSchema, req.body)
    )
    sendOk(res, location, "Inventory location updated successfully")
  }

  adjustStock = async (req: Request, res: Response): Promise<void> => {
    const result = await inventoryService.adjustStock(
      getAuthUser(req),
      parse(adjustStockSchema, req.body)
    )
    sendOk(res, result, "Stock adjusted and ledger recorded successfully")
  }

  reserveStock = async (req: Request, res: Response): Promise<void> => {
    const result = await inventoryService.reserveStock(
      parse(reserveStockSchema, req.body)
    )
    sendOk(res, result, "Stock reserved successfully")
  }

  commitReservation = async (req: Request, res: Response): Promise<void> => {
    const result = await inventoryService.commitReservation(
      parse(commitReservationSchema, req.body),
      getAuthUser(req).userId
    )
    sendOk(res, result, "Reservation committed and order fulfilled")
  }

  releaseReservation = async (req: Request, res: Response): Promise<void> => {
    const result = await inventoryService.releaseReservation(
      parse(releaseReservationSchema, req.body)
    )
    sendOk(res, result, "Reservation released successfully")
  }

  getInventory = async (req: Request, res: Response): Promise<void> => {
    const result = await inventoryService.getInventory(
      parse(listInventoryQuerySchema, req.query),
      getAuthUser(req)
    )
    sendPaginated(res, result)
  }

  getLedger = async (req: Request, res: Response): Promise<void> => {
    const result = await inventoryService.getLedger(
      parse(listLedgerQuerySchema, req.query),
      getAuthUser(req)
    )
    sendPaginated(res, result)
  }
}

export const inventoryController = new InventoryController()
