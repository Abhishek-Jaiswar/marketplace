import { logger } from "@workspace/logger"
import { cacheService } from "../../services/cache.service.js"

const CUSTOMER_CACHE_TTL_SECONDS = 60 * 5 // 5 minutes

const buildCustomerDetailsKey = (userId: string) => `customer:details:${userId}`

class CustomerCache {
  async getOrSetCustomerDetails<T>(userId: string, producer: () => Promise<T>) {
    return cacheService.remember(
      buildCustomerDetailsKey(userId),
      CUSTOMER_CACHE_TTL_SECONDS,
      producer
    )
  }

  async invalidateCustomer(userId: string) {
    const deletedKeys = await cacheService.delete(buildCustomerDetailsKey(userId))

    logger.info("Customer cache invalidated", {
      userId,
      deletedKeys,
    })
  }
}

export const customerCache = new CustomerCache()
