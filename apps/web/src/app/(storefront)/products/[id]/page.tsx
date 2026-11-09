import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Price } from "@workspace/ui/components/price"
import { formatInr } from "@workspace/ui/lib/money"
import { cn } from "@workspace/ui/lib/utils"

import { ProductImage } from "../../../../components/product-image"
import { Shelf } from "../../../../components/storefront/catalog"
import {
  BuyButtons,
  DeliveryCheck,
  MobileBuyBar,
} from "../../../../components/storefront/commerce"
import { RatingLine } from "../../../../components/storefront/rating"
import { ReviewsPanel } from "../../../../components/storefront/reviews"
import { mockDeliveryDate, mockOffers } from "../../../../lib/mock-data"
import { getProductCards, getProductPage } from "../../../../lib/server-api"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getProductPage((await params).id)
  return page
    ? { title: page.product.title, description: page.product.description }
    : { title: "Product not found" }
}

const dispatchText = (days: number) =>
  days <= 1 ? "Ships within 1 day" : `Ships within ${days} days`

const variantLabel = (attributes: Record<string, unknown>) =>
  Object.values(attributes).map(String).join(", ")

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params
  const { variant: requested } = await searchParams
  const page = await getProductPage(id)
  if (!page) notFound()

  const { product, variants } = page
  const categorySlug = product.category?.slug
  const related = categorySlug
    ? (await getProductCards({ category: categorySlug, limit: 13 })).filter(
        (card) => card.slug !== product.slug
      )
    : []

  const variant =
    variants.find((candidate) => candidate.sku === requested) ?? variants[0]
  const offer = variant?.buyBoxWinner ?? null
  const otherOffers = (variant?.allOffers ?? []).filter(
    (candidate) => candidate.id !== offer?.id
  )
  const hasOptions = variants.some(
    (candidate) => Object.keys(candidate.attributes).length > 0
  )
  const media = [...(product.media ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary)
  )
  const specifications = Object.entries(product.specifications ?? {})
  const store = offer?.seller?.store
  const inStock = offer?.isInStock ?? false
  const optionLabel = variant ? variantLabel(variant.attributes) : ""
  const cartItem = offer
    ? {
        key: offer.id,
        slug: product.slug,
        title: product.title,
        option: optionLabel || null,
        image: media[0]?.media?.url ?? null,
        seller: store?.displayName ?? offer.seller?.businessName ?? null,
        price: offer.sellingPrice,
        mrp: offer.mrpPrice,
      }
    : null

  return (
    <div className="space-y-2 pb-20 sm:space-y-3 md:pb-0">
      {product.category ? (
        <nav
          aria-label="Breadcrumb"
          className="px-3 pt-2 text-sm text-muted-foreground sm:px-0 sm:pt-0"
        >
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <span aria-hidden="true"> / </span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:underline"
          >
            {product.category.name}
          </Link>
        </nav>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_19rem]">
        <section className="self-start bg-card p-3 sm:rounded-lg md:sticky md:top-28">
          <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
            <ProductImage
              src={media[0]?.media?.url ?? null}
              alt={product.title}
              sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
              eager
            />
          </div>
          {media.length > 1 ? (
            <ul className="mt-2 grid grid-cols-5 gap-2">
              {media.slice(1).map((item) => (
                <li
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-sm bg-muted"
                >
                  <ProductImage
                    src={item.media?.url ?? null}
                    alt=""
                    sizes="96px"
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="bg-card p-4 sm:rounded-lg">
          {product.brand ? (
            <p className="text-sm text-muted-foreground">
              {product.brand.name}
            </p>
          ) : null}
          <h1 className="text-xl leading-snug font-semibold sm:text-2xl">
            {product.title}
          </h1>
          <RatingLine slug={product.slug} />

          {offer ? (
            <Price
              className="mt-3 border-t border-border pt-3"
              amount={offer.sellingPrice}
              mrp={offer.mrpPrice}
              size="lg"
              showTaxNote
            />
          ) : null}

          {offer ? (
            <div className="mt-4">
              <h2 className="text-sm font-medium">Offers</h2>
              <ul className="mt-1.5 space-y-1">
                {mockOffers(offer.sellingPrice).map((text) => (
                  <li key={text} className="text-sm">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {hasOptions ? (
            <div className="mt-4">
              <h2 className="text-sm font-medium">Options</h2>
              <ul className="mt-1.5 flex flex-wrap gap-2">
                {variants.map((candidate) => (
                  <li key={candidate.id}>
                    <Link
                      href={`/products/${product.slug}?variant=${candidate.sku}`}
                      aria-current={
                        candidate.id === variant?.id ? "true" : undefined
                      }
                      className={cn(
                        "block rounded-md border px-3 py-1.5",
                        candidate.id === variant?.id
                          ? "border-primary bg-tint-sky font-semibold"
                          : "border-input hover:border-primary"
                      )}
                    >
                      {variantLabel(candidate.attributes)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.highlights?.length ? (
            <div className="mt-4">
              <h2 className="text-sm font-medium">Highlights</h2>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {product.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4 border-t border-border pt-3">
            <h2 className="font-semibold">About this product</h2>
            <p className="mt-1 max-w-prose">{product.description}</p>
          </div>

          {specifications.length > 0 ? (
            <div className="mt-4 border-t border-border pt-3">
              <h2 className="font-semibold">Specifications</h2>
              <dl className="mt-1 divide-y divide-border">
                {specifications.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-2 gap-4 py-1.5">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </section>

        <aside className="self-start bg-card p-4 sm:rounded-lg md:col-span-2 xl:sticky xl:top-28 xl:col-span-1">
          {offer ? (
            <Price amount={offer.sellingPrice} mrp={offer.mrpPrice} size="md" />
          ) : null}
          <p
            className={cn(
              "mt-3 font-semibold",
              inStock ? "text-success" : "text-destructive"
            )}
          >
            {inStock ? "In stock" : "Out of stock"}
          </p>
          {offer ? (
            <ul className="mt-1 space-y-0.5 text-sm">
              {inStock ? (
                <li className="font-medium">
                  Delivery by {mockDeliveryDate(offer.handlingTimeDays)}
                </li>
              ) : null}
              <li>{dispatchText(offer.handlingTimeDays)}</li>
              {offer.codEnabled ? <li>Cash on delivery available</li> : null}
            </ul>
          ) : null}
          {offer?.seller ? (
            <p className="mt-3 text-sm">
              Sold by{" "}
              {store ? (
                <Link href={`/store/${store.slug}`} className="underline">
                  {store.displayName}
                </Link>
              ) : (
                offer.seller.businessName
              )}
            </p>
          ) : null}

          {offer ? (
            <DeliveryCheck handlingDays={offer.handlingTimeDays} />
          ) : null}

          {cartItem ? (
            <div className="mt-4 max-md:hidden">
              <BuyButtons item={cartItem} disabled={!inStock} />
            </div>
          ) : null}

          {otherOffers.length > 0 ? (
            <div className="mt-4 border-t border-border pt-3">
              <h2 className="font-semibold">Other sellers</h2>
              <ul className="mt-1 divide-y divide-border">
                {otherOffers.map((other) => (
                  <li
                    key={other.id}
                    className="flex items-center justify-between gap-3 py-1.5 text-sm"
                  >
                    {other.seller?.store ? (
                      <Link
                        href={`/store/${other.seller.store.slug}`}
                        className="underline"
                      >
                        {other.seller.store.displayName}
                      </Link>
                    ) : (
                      <span>{other.seller?.businessName}</span>
                    )}
                    <span className="font-semibold tabular-nums">
                      {formatInr(other.sellingPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <ReviewsPanel slug={product.slug} />

      {categorySlug ? (
        <Shelf
          title={`More in ${product.category?.name}`}
          href={`/products?category=${categorySlug}`}
          products={related}
        />
      ) : null}

      {cartItem && offer ? (
        <MobileBuyBar
          item={cartItem}
          disabled={!inStock}
          priceLabel={formatInr(offer.sellingPrice)}
        />
      ) : null}
    </div>
  )
}
