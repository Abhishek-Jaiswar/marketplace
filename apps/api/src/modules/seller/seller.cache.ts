import { logger } from "@workspace/logger"
import { cacheService } from "../../services/cache.service.js"

const SELLER_CACHE_TTL_SECONDS = 60 * 5
const SELLER_LIST_VERSION_FALLBACK = 1
const SELLER_LIST_VERSION_KEY = "seller:list:version"

const buildSellerDetailsKey = (userId: string) => `seller:details:${userId}`

const buildSellerListKey = (version: number, page: number, limit: number) =>
  `seller:list:v${version}:page:${page}:limit:${limit}`

class SellerCache {
  private async getListVersion() {
    return cacheService.getNumber(
      SELLER_LIST_VERSION_KEY,
      SELLER_LIST_VERSION_FALLBACK
    )
  }

  async getOrSetSellerDetails<T>(userId: string, producer: () => Promise<T>) {
    return cacheService.remember(
      buildSellerDetailsKey(userId),
      SELLER_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetUserList<T>(
    page: number,
    limit: number,
    producer: () => Promise<T>
  ) {
    const version = await this.getListVersion()

    return cacheService.remember(
      buildSellerListKey(version, page, limit),
      SELLER_CACHE_TTL_SECONDS,
      producer
    )
  }

  async invalidateUserLists() {
    const nextVersion = await cacheService.increment(SELLER_LIST_VERSION_KEY)

    if (nextVersion === null) {
      return
    }

    logger.info("Seller list cache invalidated", {
      versionKey: SELLER_LIST_VERSION_KEY,
      nextVersion,
    })
  }

  async invalidateUser(userId: string) {
    const deletedKeys = await cacheService.delete(buildSellerDetailsKey(userId))

    logger.info("Seller cache invalidated", {
      userId,
      deletedKeys,
    })

    await this.invalidateUserLists()
  }
}

export const sellerCache = new SellerCache()
