import type { Product } from "@workspace/store"

export interface ProductCard {
  slug: string
  title: string
  brand: string | null
  categorySlug: string
  price: number
  mrp: number
  image: string | null
}

export function primaryImage(media: Product["media"]): string | null {
  const sorted = [...(media ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary)
  )
  return sorted[0]?.media?.url ?? null
}

/** A card for the lowest live offer, or null when nobody is selling it. */
export function toProductCard(product: Product): ProductCard | null {
  const offers = (product.variants ?? [])
    .flatMap((variant) => variant.listings ?? [])
    .filter((listing) => listing.status === "ACTIVE")
    .sort((a, b) => a.sellingPrice - b.sellingPrice)

  const best = offers[0]
  if (!best) return null

  return {
    slug: product.slug,
    title: product.title,
    brand: product.brand?.name ?? null,
    categorySlug: product.category?.slug ?? "",
    price: best.sellingPrice,
    mrp: best.mrpPrice,
    image: primaryImage(product.media),
  }
}
