"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { EmptyState } from "@workspace/ui/components/states"
import { discountPercent, formatInr } from "@workspace/ui/lib/money"

import { ProductImage } from "../../../components/product-image"
import { setQuantity, useCart } from "../../../lib/mock-cart"

const FREE_DELIVERY_PAISE = 49900
const DELIVERY_FEE_PAISE = 4900

export default function CartPage() {
  const lines = useCart()

  if (lines.length === 0) {
    return (
      <div className="bg-card sm:rounded-lg">
        <EmptyState
          title="Your cart is empty"
          description="Add products to see them here."
          action={
            <Button render={<Link href="/products" />}>Browse products</Button>
          }
        />
      </div>
    )
  }

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0)
  const mrpTotal = lines.reduce(
    (total, line) => total + line.mrp * line.quantity,
    0
  )
  const subtotal = lines.reduce(
    (total, line) => total + line.price * line.quantity,
    0
  )
  const delivery = subtotal >= FREE_DELIVERY_PAISE ? 0 : DELIVERY_FEE_PAISE

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="bg-card p-3 sm:rounded-lg sm:p-4">
        <h1 className="text-xl font-semibold">
          Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h1>
        <ul className="mt-2 divide-y divide-border">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-3 py-3">
              <Link
                href={`/products/${line.slug}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-md bg-muted sm:size-28"
              >
                <ProductImage src={line.image} alt="" sizes="112px" eager />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${line.slug}`}
                  className="line-clamp-2 hover:underline"
                >
                  {line.title}
                </Link>
                {line.option ? (
                  <p className="text-sm text-muted-foreground">{line.option}</p>
                ) : null}
                {line.seller ? (
                  <p className="text-sm text-muted-foreground">
                    Sold by {line.seller}
                  </p>
                ) : null}
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-bold tabular-nums">
                    {formatInr(line.price)}
                  </span>
                  {line.mrp > line.price ? (
                    <>
                      <s className="text-sm text-muted-foreground tabular-nums">
                        {formatInr(line.mrp)}
                      </s>
                      <span className="text-sm font-semibold text-discount">
                        {discountPercent(line.mrp, line.price)}% off
                      </span>
                    </>
                  ) : null}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-input">
                    <button
                      aria-label={`Decrease quantity of ${line.title}`}
                      className="size-8"
                      onClick={() => setQuantity(line.key, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      aria-label={`Increase quantity of ${line.title}`}
                      className="size-8"
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-sm underline"
                    onClick={() => setQuantity(line.key, 0)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="self-start bg-card p-4 sm:rounded-lg lg:sticky lg:top-28">
        <h2 className="font-semibold">Price details</h2>
        <dl className="mt-2 space-y-1.5">
          <div className="flex justify-between">
            <dt>Price, MRP</dt>
            <dd className="tabular-nums">{formatInr(mrpTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Discount</dt>
            <dd className="text-discount tabular-nums">
              −{formatInr(mrpTotal - subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd className="tabular-nums">
              {delivery === 0 ? "Free" : formatInr(delivery)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatInr(subtotal + delivery)}</dd>
          </div>
        </dl>
        <Button
          variant="action"
          size="lg"
          className="mt-4 h-11 w-full"
          disabled
        >
          Proceed to checkout
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Checkout opens once payments are connected.
        </p>
      </aside>
    </div>
  )
}
