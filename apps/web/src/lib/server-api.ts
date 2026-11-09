import { connection } from "next/server"
import type {
  CategoryTreeNode,
  ListProductsResponse,
  Store,
  StorefrontPdp,
} from "@workspace/store"

import { toProductCard, type ProductCard } from "./product-card"

export type { ProductCard }

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? "https://marketplace-2zmv.onrender.com/api"
    : "http://localhost:4000/api")
).replace(/\/+$/, "")

const RETRY_DELAYS_MS = [200, 600]
const TRANSIENT_STATUSES = new Set([502, 503, 504])

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Reads from the API, retrying transient failures. Returns null on a 404. */
async function get<T>(path: string): Promise<T | null> {
  // Pages render per request, so a build never depends on a running API.
  await connection()

  for (let attempt = 0; ; attempt += 1) {
    const delay = RETRY_DELAYS_MS[attempt]
    try {
      const response = await fetch(`${API_URL}${path}`, {
        next: { revalidate: 60 },
      })
      if (response.status === 404) return null
      if (response.ok) return (await response.json()) as T
      if (delay === undefined || !TRANSIENT_STATUSES.has(response.status)) {
        throw new Error(`API responded ${response.status} for ${path}`)
      }
    } catch (error) {
      if (delay === undefined) throw error
    }
    await wait(delay)
  }
}

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const result = await get<{ data: CategoryTreeNode[] }>("/categories/tree")
  return result?.data ?? []
}

export async function getProductCards(
  params: {
    search?: string | undefined
    category?: string | undefined
    sellerId?: string | undefined
    limit?: number
  } = {}
): Promise<ProductCard[]> {
  const query = new URLSearchParams({
    status: "APPROVED",
    limit: String(params.limit ?? 100),
  })
  if (params.search) query.set("search", params.search)
  if (params.category) query.set("category", params.category)
  if (params.sellerId) query.set("sellerId", params.sellerId)

  const result = await get<ListProductsResponse>(`/catalog/products?${query}`)
  return (result?.items ?? [])
    .map(toProductCard)
    .filter((card): card is ProductCard => card !== null)
}

export async function getProductPage(
  slug: string
): Promise<StorefrontPdp | null> {
  const result = await get<{ data: StorefrontPdp }>(
    `/catalog/pdp/${encodeURIComponent(slug)}`
  )
  return result?.data ?? null
}

export type PublicStore = Store & {
  seller?: { id: string; businessName: string; status: string }
}

export async function getStore(slug: string): Promise<PublicStore | null> {
  const result = await get<{ store: PublicStore }>(
    `/sellers/store-public/${encodeURIComponent(slug)}`
  )
  return result?.store ?? null
}
