import { logger } from "@workspace/logger"
import { cacheService } from "../../services/cache.service.js"

const CATEGORY_CACHE_TTL_SECONDS = 60 * 60 * 24 // 24 hours (invalidated on write)
const CATEGORY_VERSION_FALLBACK = 1
const CATEGORY_VERSION_KEY = "category:version"

const buildCategoryTreeKey = (version: number, includeInactive: boolean) =>
  `category:tree:v${version}:includeInactive:${includeInactive}`

const buildCategoryListKey = (
  version: number,
  page: number,
  limit: number,
  search?: string,
  parentId?: string | null,
  isActive?: boolean
) =>
  `category:list:v${version}:page:${page}:limit:${limit}:search:${search ?? ""}:parentId:${parentId ?? ""}:active:${isActive ?? ""}`

const buildCategoryIdKey = (version: number, id: string) =>
  `category:id:v${version}:${id}`

const buildCategorySlugKey = (version: number, slug: string) =>
  `category:slug:v${version}:${slug}`

class CategoryCache {
  private async getVersion(): Promise<number> {
    return cacheService.getNumber(
      CATEGORY_VERSION_KEY,
      CATEGORY_VERSION_FALLBACK
    )
  }

  async getOrSetCategoryTree<T>(
    includeInactive: boolean,
    producer: () => Promise<T>
  ): Promise<T> {
    const version = await this.getVersion()

    return cacheService.remember(
      buildCategoryTreeKey(version, includeInactive),
      CATEGORY_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetCategoryList<T>(
    page: number,
    limit: number,
    search: string | undefined,
    parentId: string | null | undefined,
    isActive: boolean | undefined,
    producer: () => Promise<T>
  ): Promise<T> {
    const version = await this.getVersion()

    return cacheService.remember(
      buildCategoryListKey(version, page, limit, search, parentId, isActive),
      CATEGORY_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetCategoryById<T>(
    id: string,
    producer: () => Promise<T>
  ): Promise<T> {
    const version = await this.getVersion()

    return cacheService.remember(
      buildCategoryIdKey(version, id),
      CATEGORY_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetCategoryBySlug<T>(
    slug: string,
    producer: () => Promise<T>
  ): Promise<T> {
    const version = await this.getVersion()

    return cacheService.remember(
      buildCategorySlugKey(version, slug),
      CATEGORY_CACHE_TTL_SECONDS,
      producer
    )
  }

  async invalidateCategories(): Promise<void> {
    const nextVersion = await cacheService.increment(CATEGORY_VERSION_KEY)

    logger.info("Category cache invalidated", {
      versionKey: CATEGORY_VERSION_KEY,
      nextVersion,
    })
  }
}

export const categoryCache = new CategoryCache()
