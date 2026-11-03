import { logger } from "@workspace/logger"
import { cacheService } from "../../services/cache.service.js"

const CATALOG_CACHE_TTL_SECONDS = 60 * 60 * 12 // 12 hours
const CATALOG_VERSION_FALLBACK = 1
const CATALOG_VERSION_KEY = "catalog:version"

const buildBrandListKey = (version: number, page: number, limit: number, search?: string, isVerified?: boolean) =>
  `catalog:brands:v${version}:p:${page}:l:${limit}:s:${search ?? ""}:v:${isVerified ?? ""}`

const buildProductListKey = (
  version: number,
  page: number,
  limit: number,
  search?: string,
  categoryId?: string,
  brandId?: string,
  status?: string
) =>
  `catalog:products:v${version}:p:${page}:l:${limit}:s:${search ?? ""}:c:${categoryId ?? ""}:b:${brandId ?? ""}:st:${status ?? ""}`

const buildProductSlugKey = (version: number, slug: string) =>
  `catalog:product:slug:v${version}:${slug}`

const buildProductIdKey = (version: number, id: string) =>
  `catalog:product:id:v${version}:${id}`

class CatalogCache {
  private async getVersion(): Promise<number> {
    return cacheService.getNumber(CATALOG_VERSION_KEY, CATALOG_VERSION_FALLBACK)
  }

  async getOrSetBrandList<T>(
    page: number,
    limit: number,
    search: string | undefined,
    isVerified: boolean | undefined,
    producer: () => Promise<T>
  ): Promise<T> {
    const version = await this.getVersion()
    return cacheService.remember(
      buildBrandListKey(version, page, limit, search, isVerified),
      CATALOG_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetProductList<T>(
    page: number,
    limit: number,
    search: string | undefined,
    categoryId: string | undefined,
    brandId: string | undefined,
    status: string | undefined,
    producer: () => Promise<T>
  ): Promise<T> {
    const version = await this.getVersion()
    return cacheService.remember(
      buildProductListKey(version, page, limit, search, categoryId, brandId, status),
      CATALOG_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetProductBySlug<T>(slug: string, producer: () => Promise<T>): Promise<T> {
    const version = await this.getVersion()
    return cacheService.remember(
      buildProductSlugKey(version, slug),
      CATALOG_CACHE_TTL_SECONDS,
      producer
    )
  }

  async getOrSetProductById<T>(id: string, producer: () => Promise<T>): Promise<T> {
    const version = await this.getVersion()
    return cacheService.remember(
      buildProductIdKey(version, id),
      CATALOG_CACHE_TTL_SECONDS,
      producer
    )
  }

  async invalidateCatalog(): Promise<void> {
    const nextVersion = await cacheService.increment(CATALOG_VERSION_KEY)
    logger.info("Catalog cache invalidated", {
      versionKey: CATALOG_VERSION_KEY,
      nextVersion,
    })
  }
}

export const catalogCache = new CatalogCache()
