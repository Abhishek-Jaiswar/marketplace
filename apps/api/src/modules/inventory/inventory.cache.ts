import { cacheService } from "../../services/cache.service.js"

const INVENTORY_STOCK_TTL_SECONDS = 60 * 5 // 5 minutes

const buildListingStockKey = (listingId: string) =>
  `inventory:stock:listing:${listingId}`

class InventoryCache {
  async getOrSetListingAvailableStock(
    listingId: string,
    producer: () => Promise<number>
  ): Promise<number> {
    const cached = await cacheService.getNumber(buildListingStockKey(listingId), -1)
    if (cached >= 0) {
      return cached
    }
    const fresh = await producer()
    await cacheService.set(buildListingStockKey(listingId), fresh.toString(), INVENTORY_STOCK_TTL_SECONDS)
    return fresh
  }

  async invalidateListingStock(listingId: string): Promise<void> {
    await cacheService.delete(buildListingStockKey(listingId))
  }
}

export const inventoryCache = new InventoryCache()
