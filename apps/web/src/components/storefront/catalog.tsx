import type { ReactNode } from "react"
import Link from "next/link"
import { Price } from "@workspace/ui/components/price"
import { discountPercent } from "@workspace/ui/lib/money"
import { cn } from "@workspace/ui/lib/utils"

import type { ProductCard } from "../../lib/product-card"
import { ProductImage } from "../product-image"
import { RatingLine } from "./rating"

/** A discount flag cut to the shape of the logo's price tag. */
export function OffTag({
  product,
  className,
}: {
  product: ProductCard
  className?: string
}) {
  const percentOff = discountPercent(product.mrp, product.price)
  if (percentOff <= 0) return null

  return (
    <span
      className={cn(
        "absolute top-2 left-0 bg-tint-wheat py-0.5 pr-2 pl-4 text-xs font-semibold text-discount",
        className
      )}
      style={{
        clipPath: "polygon(0.5rem 0, 100% 0, 100% 100%, 0.5rem 100%, 0 50%)",
      }}
    >
      {percentOff}% off
    </span>
  )
}

export function Panel({
  title,
  action,
  className,
  children,
}: {
  title?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn("bg-card p-3 sm:rounded-lg sm:p-4", className)}>
      {title ? (
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

/** A vertical product, used in shelves and result grids. */
export function ProductCell({
  product,
  eager = false,
}: {
  product: ProductCard
  eager?: boolean
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full bg-card p-2"
    >
      <span className="relative block aspect-square overflow-hidden rounded-md bg-muted">
        <ProductImage src={product.image} alt="" eager={eager} />
        <OffTag product={product} />
      </span>
      {product.brand ? (
        <span className="mt-2 block text-xs text-muted-foreground">
          {product.brand}
        </span>
      ) : null}
      <span className="line-clamp-2 text-sm group-hover:underline">
        {product.title}
      </span>
      <RatingLine slug={product.slug} />
      <Price
        className="mt-1"
        amount={product.price}
        mrp={product.mrp}
        size="sm"
      />
    </Link>
  )
}

/** A full-width row on phones and a grid cell from the small breakpoint up. */
export function ProductResult({
  product,
  eager = false,
}: {
  product: ProductCard
  eager?: boolean
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full gap-3 bg-card p-2 sm:block sm:p-3"
    >
      <span className="relative block aspect-square w-32 shrink-0 overflow-hidden rounded-md bg-muted sm:w-full">
        <ProductImage src={product.image} alt="" eager={eager} />
        <OffTag product={product} />
      </span>
      <span className="block min-w-0 flex-1">
        {product.brand ? (
          <span className="block text-xs text-muted-foreground sm:mt-2">
            {product.brand}
          </span>
        ) : null}
        <span className="line-clamp-2 group-hover:underline">
          {product.title}
        </span>
        <RatingLine slug={product.slug} />
        <Price className="mt-1" amount={product.price} mrp={product.mrp} />
      </span>
    </Link>
  )
}

export function ResultGrid({ products }: { products: ProductCard[] }) {
  return (
    <ul className="grid gap-px bg-border sm:grid-cols-3 sm:overflow-hidden sm:rounded-lg xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductResult product={product} eager={index < 4} />
        </li>
      ))}
    </ul>
  )
}

export function Shelf({
  title,
  href,
  products,
  extra,
}: {
  title: string
  href: string
  products: ProductCard[]
  extra?: ReactNode
}) {
  if (products.length === 0) return null

  return (
    <Panel
      title={title}
      action={
        <span className="flex items-baseline gap-4">
          {extra}
          <Link href={href} className="text-sm whitespace-nowrap underline">
            See all
          </Link>
        </span>
      }
    >
      <ul className="flex snap-x scrollbar-thin gap-1 overflow-x-auto pb-1">
        {products.map((product) => (
          <li
            key={product.slug}
            className="w-40 shrink-0 snap-start sm:w-48 lg:w-52"
          >
            <ProductCell product={product} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/** Four products under one heading, for a quick look into a department. */
export function QuadCard({
  title,
  href,
  products,
}: {
  title: string
  href: string
  products: ProductCard[]
}) {
  return (
    <Panel className="flex flex-col">
      <h2 className="mb-2 font-semibold sm:text-lg">{title}</h2>
      <ul className="grid flex-1 grid-cols-2 gap-2">
        {products.slice(0, 4).map((product) => (
          <li key={product.slug}>
            <Link href={`/products/${product.slug}`} className="group block">
              <span className="relative block aspect-square overflow-hidden rounded-md bg-muted">
                <ProductImage src={product.image} alt="" sizes="180px" />
              </span>
              <span className="mt-1 line-clamp-1 text-xs group-hover:underline">
                {product.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-3 text-sm underline">
        See all
      </Link>
    </Panel>
  )
}
