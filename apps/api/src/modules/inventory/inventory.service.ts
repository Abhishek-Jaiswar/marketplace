import type {
  AdjustStockInput,
  CommitReservationInput,
  CreateLocationInput,
  ListInventoryQuery,
  ListLedgerQuery,
  ReleaseReservationInput,
  ReserveStockInput,
  UpdateLocationInput,
} from "@workspace/contracts/inventory"

import { ForbiddenError, NotFoundError } from "../../utils/errors/index.js"
import { type AuthUser, isAdmin } from "../../utils/http/request.js"
import { catalogRepository } from "../catalog/index.js"
import { sellerRepository } from "../seller/index.js"
import { inventoryCache } from "./inventory.cache.js"
import { inventoryRepository } from "./inventory.repository.js"

class InventoryService {
  async createLocation(user: AuthUser, data: CreateLocationInput) {
    let sellerId: string | null = null

    if (!isAdmin(user)) {
      const seller = await sellerRepository.findSellerIdentityByOwnerId(
        user.userId
      )
      if (seller?.status !== "APPROVED") {
        throw new ForbiddenError(
          "Only approved sellers can register inventory locations"
        )
      }
      sellerId = seller.id
    }

    await inventoryRepository.assertLocationCodeAvailable(data.code)
    return await inventoryRepository.createLocation(sellerId, data)
  }

  async updateLocation(id: string, user: AuthUser, data: UpdateLocationInput) {
    const location = await inventoryRepository.findLocationById(id)
    if (!location) throw new NotFoundError("Location not found")

    if (!isAdmin(user)) {
      const seller = await sellerRepository.findSellerIdentityByOwnerId(
        user.userId
      )
      if (!seller || location.sellerId !== seller.id) {
        throw new ForbiddenError(
          "You do not have permission to modify this location"
        )
      }
    }

    return await inventoryRepository.updateLocation(id, data)
  }

  async getLocations(user: AuthUser) {
    if (isAdmin(user)) {
      return await inventoryRepository.findLocations()
    }

    const seller = await sellerRepository.findSellerIdentityByOwnerId(
      user.userId
    )
    return seller ? await inventoryRepository.findLocations(seller.id) : []
  }

  async adjustStock(user: AuthUser, data: AdjustStockInput) {
    const listing = await catalogRepository.findListingById(
      data.sellerListingId
    )
    if (!listing) throw new NotFoundError("Seller listing not found")

    if (!isAdmin(user)) {
      const seller = await sellerRepository.findSellerIdentityByOwnerId(
        user.userId
      )
      if (!seller || listing.sellerId !== seller.id) {
        throw new ForbiddenError(
          "You do not have permission to adjust inventory for this listing"
        )
      }
    }

    const location = await inventoryRepository.findLocationById(data.locationId)
    if (!location?.isActive) {
      throw new NotFoundError("Active inventory location not found")
    }

    const result = await inventoryRepository.executeStockAdjustment({
      ...data,
      performedById: user.userId,
    })

    await inventoryCache.invalidateListingStock(data.sellerListingId)
    return result
  }

  async reserveStock(data: ReserveStockInput) {
    const expiresAt = new Date(Date.now() + data.ttlMinutes * 60 * 1000)

    const reservations = await inventoryRepository.createReservations(
      data.items,
      { expiresAt, cartId: data.cartId, orderId: data.orderId }
    )

    const listingIds = new Set(data.items.map((item) => item.sellerListingId))
    await Promise.all(
      [...listingIds].map((id) => inventoryCache.invalidateListingStock(id))
    )

    return {
      reservations,
      expiresAt: expiresAt.toISOString(),
      ttlMinutes: data.ttlMinutes,
    }
  }

  async commitReservation(data: CommitReservationInput, userId: string) {
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
      data.reservationId
    )
    if (result.item) {
      await inventoryCache.invalidateListingStock(result.item.sellerListingId)
    }
    return result
  }

  async getInventory(query: ListInventoryQuery, user: AuthUser) {
    return await inventoryRepository.findInventory({
      ...query,
      sellerId: await this.resolveSellerScope(user, query.sellerId),
    })
  }

  async getLedger(query: ListLedgerQuery, user: AuthUser) {
    return await inventoryRepository.findLedgerEntries({
      ...query,
      sellerId: await this.resolveSellerScope(user),
    })
  }

  /** Admins may see any seller; everyone else is pinned to their own. */
  private async resolveSellerScope(user: AuthUser, requestedSellerId?: string) {
    if (isAdmin(user)) {
      return requestedSellerId
    }

    const seller = await sellerRepository.findSellerIdentityByOwnerId(
      user.userId
    )
    if (!seller) throw new ForbiddenError("Seller profile required")
    return seller.id
  }
}

export const inventoryService = new InventoryService()
