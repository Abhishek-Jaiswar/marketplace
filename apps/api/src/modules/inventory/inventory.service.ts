import { db } from "@workspace/db"
import { inventoryRepository } from "./inventory.repository.js"
import { inventoryCache } from "./inventory.cache.js"
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors/index.js"
import type {
  CreateLocationInput,
  UpdateLocationInput,
  AdjustStockInput,
  ReserveStockInput,
  CommitReservationInput,
  ReleaseReservationInput,
  ListInventoryQuery,
  ListLedgerQuery,
} from "./inventory.types.js"

class InventoryService {
  // ---------------- Locations ----------------
  async createLocation(
    user: { userId: string; roles: readonly string[] | string[] },
    data: CreateLocationInput
  ) {
    const isAdmin = user.roles.includes("ADMIN")
    let sellerId: string | null = null

    if (!isAdmin) {
      const seller = await db.orm.public.Seller.first({ ownerUserId: user.userId })
      if (!seller || seller.status !== "APPROVED") {
        throw new ForbiddenError("Only approved sellers can register inventory locations")
      }
      sellerId = seller.id
    }

    const existingCode = await inventoryRepository.findLocationByCode(data.code)
    if (existingCode) {
      throw new ConflictError(`Location code '${data.code}' is already registered`)
    }

    return await inventoryRepository.createLocation(sellerId, data)
  }

  async updateLocation(
    id: string,
    user: { userId: string; roles: readonly string[] | string[] },
    data: UpdateLocationInput
  ) {
    const location = await inventoryRepository.findLocationById(id)
    if (!location) throw new NotFoundError("Location not found")

    const isAdmin = user.roles.includes("ADMIN")
    if (!isAdmin) {
      const seller = await db.orm.public.Seller.first({ ownerUserId: user.userId })
      if (!seller || location.sellerId !== seller.id) {
        throw new ForbiddenError("You do not have permission to modify this location")
      }
    }

    return await inventoryRepository.updateLocation(id, data)
  }

  async getLocations(sellerUserId?: string, isAdmin = false) {
    if (isAdmin) {
      return await inventoryRepository.findLocations()
    }
    if (!sellerUserId) return []
    const seller = await db.orm.public.Seller.first({ ownerUserId: sellerUserId })
    if (!seller) return []
    return await inventoryRepository.findLocations(seller.id)
  }

  // ---------------- Stock Adjustments ----------------
  async adjustStock(
    user: { userId: string; roles: readonly string[] | string[] },
    data: AdjustStockInput
  ) {
    const listing = await db.orm.public.SellerListing.first({ id: data.sellerListingId })
    if (!listing) throw new NotFoundError("Seller listing not found")

    const isAdmin = user.roles.includes("ADMIN")
    if (!isAdmin) {
      const seller = await db.orm.public.Seller.first({ ownerUserId: user.userId })
      if (!seller || listing.sellerId !== seller.id) {
        throw new ForbiddenError("You do not have permission to adjust inventory for this listing")
      }
    }

    const location = await inventoryRepository.findLocationById(data.locationId)
    if (!location || !location.isActive) {
      throw new NotFoundError("Active inventory location not found")
    }

    const result = await inventoryRepository.executeStockAdjustment({
      ...data,
      performedById: user.userId,
    })

    await inventoryCache.invalidateListingStock(data.sellerListingId)
    return result
  }

  // ---------------- Reservation Engine ----------------
  async reserveStock(data: ReserveStockInput) {
    const ttlMinutes = data.ttlMinutes ?? 15
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

    const reservations = []

    for (const itemRequest of data.items) {
      const itemsAtLocations = await inventoryRepository.findInventoryItemsByListing(
        itemRequest.sellerListingId
      )

      if (itemsAtLocations.length === 0) {
        throw new BadRequestError(`No stocked inventory location found for listing '${itemRequest.sellerListingId}'`)
      }

      // If preferred location given, pick that; otherwise choose location with largest available stock
      let targetItem = itemsAtLocations.find(
        (i) => i.locationId === itemRequest.preferredLocationId
      )

      if (!targetItem) {
        const sorted = itemsAtLocations
          .map((i) => ({
            ...i,
            available: i.onHand - i.reserved - i.safetyStock,
          }))
          .sort((a, b) => b.available - a.available)

        targetItem = sorted[0]
      }

      if (!targetItem) {
        throw new BadRequestError(`Insufficient stock for listing '${itemRequest.sellerListingId}'`)
      }

      const reservationResult = await inventoryRepository.createReservation(
        targetItem.id,
        itemRequest.quantity,
        expiresAt,
        data.cartId,
        data.orderId
      )

      await inventoryCache.invalidateListingStock(itemRequest.sellerListingId)
      reservations.push(reservationResult.reservation)
    }

    return {
      reservations,
      expiresAt: expiresAt.toISOString(),
      ttlMinutes,
    }
  }

  async commitReservation(data: CommitReservationInput, userId?: string) {
    const result = await inventoryRepository.commitReservation(
      data.reservationId,
      data.orderId,
      userId
    )
    if (result.item) {
      await inventoryCache.invalidateListingStock(result.item.sellerListingId)
    }
    return result
  }

  async releaseReservation(data: ReleaseReservationInput) {
    const result = await inventoryRepository.releaseReservation(
      data.reservationId,
      data.reason
    )
    return result
  }

  // ---------------- Inventory & Ledger Queries ----------------
  async getInventory(
    query: ListInventoryQuery,
    user: { userId: string; roles: readonly string[] | string[] }
  ) {
    const isAdmin = user.roles.includes("ADMIN")
    let sellerId = query.sellerId

    if (!isAdmin) {
      const seller = await db.orm.public.Seller.first({ ownerUserId: user.userId })
      if (!seller) throw new ForbiddenError("Seller profile required")
      sellerId = seller.id
    }

    return await inventoryRepository.findInventory({
      ...query,
      sellerId,
    })
  }

  async getLedger(
    query: ListLedgerQuery,
    user: { userId: string; roles: readonly string[] | string[] }
  ) {
    const isAdmin = user.roles.includes("ADMIN")
    if (!isAdmin) {
      if (query.inventoryItemId) {
        const item = await inventoryRepository.findInventoryItemById(query.inventoryItemId)
        if (!item) throw new NotFoundError("Inventory item not found")
        const seller = await db.orm.public.Seller.first({ ownerUserId: user.userId })
        if (!seller || !item.sellerListing || item.sellerListing.sellerId !== seller.id) {
          throw new ForbiddenError("Access denied")
        }
      }
    }

    return await inventoryRepository.findLedgerEntries(query)
  }
}

export const inventoryService = new InventoryService()
