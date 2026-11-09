import { logger } from "@workspace/logger"
import { cacheService } from "../../services/cache.service.js"

const USER_CACHE_TTL_SECONDS = 60 * 5
const USER_LIST_VERSION_FALLBACK = 1
const USER_LIST_VERSION_KEY = "user:list:version"

const buildUserDetailsKey = (userId: string) => `user:details:${userId}`

const buildUserListKey = (version: number, page: number, limit: number) =>
  `user:list:v${version}:page:${page}:limit:${limit}`

class UserCache {
  private async getListVersion() {
    return cacheService.getNumber(
      USER_LIST_VERSION_KEY,
      USER_LIST_VERSION_FALLBACK
    )
  }

  async getOrSetUserDetails<T>(userId: string, producer: () => Promise<T>) {
    return cacheService.remember(
      buildUserDetailsKey(userId),
      USER_CACHE_TTL_SECONDS,
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
      buildUserListKey(version, page, limit),
      USER_CACHE_TTL_SECONDS,
      producer
    )
  }

  async invalidateUserLists() {
    const nextVersion = await cacheService.increment(USER_LIST_VERSION_KEY)

    if (nextVersion === null) {
      return
    }

    logger.info("User list cache invalidated", {
      versionKey: USER_LIST_VERSION_KEY,
      nextVersion,
    })
  }

  async invalidateUser(userId: string) {
    const deletedKeys = await cacheService.delete(buildUserDetailsKey(userId))

    logger.info("User cache invalidated", {
      userId,
      deletedKeys,
    })

    await this.invalidateUserLists()
  }
}

export const userCache = new UserCache()
