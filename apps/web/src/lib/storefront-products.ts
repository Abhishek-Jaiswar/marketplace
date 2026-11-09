import {
  useGetProductsQuery,
  useGetStorefrontPdpQuery,
  type ListProductsParams,
  type Product as ApiProduct,
} from "@workspace/store"
import { formatInr } from "@workspace/ui/lib/money"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  ratingLabel: string
  reviewCount: number
  image: string | null
  category: string
  categorySlug: string
  description: string
  vendorName?: string
  inStock?: boolean
  features?: string[]
  tag?: string
}

/** Listing prices are whole rupees until the catalog moves to paise (ADR 0006). */
export const formatRupees = (rupees: number) => formatInr(rupees * 100)

function primaryImage(product: ApiProduct): string | null {
  const media = [...(product.media ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary)
  )
  return media[0]?.media?.url ?? null
}

/** Maps a catalog product to a card, or null when nobody is selling it. */
function toCard(product: ApiProduct): Product | null {
  const offers = (product.variants ?? [])
    .flatMap((variant) => variant.listings ?? [])
    .filter((listing) => listing.status === "ACTIVE")
    .sort((a, b) => a.sellingPrice - b.sellingPrice)

  const best = offers[0]
  if (!best) return null

  return {
    id: product.slug,
    name: product.title,
    price: best.sellingPrice,
    originalPrice:
      best.mrpPrice > best.sellingPrice ? best.mrpPrice : undefined,
    rating: 0,
    ratingLabel: "New",
    reviewCount: 0,
    image: primaryImage(product),
    category: product.category?.name ?? "",
    categorySlug: product.category?.slug ?? "",
    description: product.description,
    features: product.highlights,
  }
}

export function useStorefrontProducts(
  params: Omit<ListProductsParams, "status"> = {},
  options: { skip?: boolean } = {}
) {
  const { data, isLoading, isError, refetch } = useGetProductsQuery(
    { status: "APPROVED", limit: 100, ...params },
    { skip: options.skip ?? false }
  )

  const products = (data?.items ?? [])
    .map(toCard)
    .filter((product): product is Product => product !== null)

  return { products, isLoading, isError, refetch }
}

export function useStorefrontProduct(slug: string) {
  const { data, isLoading, isError } = useGetStorefrontPdpQuery(slug, {
    skip: !slug,
  })
  const page = data?.data
  if (!page) return { product: null, vendor: null, isLoading, isError }

  const winners = page.variants.flatMap((variant) =>
    variant.buyBoxWinner ? [variant.buyBoxWinner] : []
  )
  const best = winners.find((offer) => offer.isInStock) ?? winners[0] ?? null

  const media = [...(page.product.media ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary)
  )

  const product: Product = {
    id: page.product.slug,
    name: page.product.title,
    price: best?.sellingPrice ?? 0,
    originalPrice:
      best && best.mrpPrice > best.sellingPrice ? best.mrpPrice : undefined,
    rating: 0,
    ratingLabel: "New",
    reviewCount: 0,
    image: media[0]?.media?.url ?? null,
    category: page.product.category?.name ?? "",
    categorySlug: page.product.category?.slug ?? "",
    description: page.product.description,
    vendorName: best?.seller?.businessName,
    inStock: best?.isInStock ?? false,
    features: page.product.highlights,
  }

  const vendor = {
    name: best?.seller?.store?.displayName ?? best?.seller?.businessName ?? "",
    slug: best?.seller?.store?.slug ?? "",
    verified: best?.seller?.status === "APPROVED",
  }

  return { product, vendor, isLoading, isError }
}
