"use client"

import { useState } from "react"
import Link from "next/link"
import { getApiErrorMessage } from "@workspace/store"
import { Button } from "@workspace/ui/components/button"
import { EmptyState } from "@workspace/ui/components/states"
import { discountPercent, formatInr } from "@workspace/ui/lib/money"

import { ProductImage } from "../../../components/product-image"
import { PriceSummary } from "../../../components/storefront/price-summary"
import { useStorefrontCart, type DisplayLine } from "../../../lib/use-cart"

export default function CartPage() {
  const cart = useStorefrontCart()
  const [error, setError] = useState<string>()

  if (cart.isLoading) {
    return <p className="p-6 text-muted-foreground">Loading your cart.</p>
  }

  if (cart.lines.length === 0) {
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

  const change = async (line: DisplayLine, quantity: number) => {
    setError(undefined)
    try {
      await cart.setQuantity(line, quantity)
    } catch (failure) {
      setError(getApiErrorMessage(failure, "Could not update your cart."))
    }
  }

  const blocked = cart.lines.some((line) => !line.isPurchasable)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="bg-card p-3 sm:rounded-lg sm:p-4">
        <h1 className="text-xl font-semibold">
          Cart ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
        </h1>
        {error ? (
          <p role="alert" className="mt-2 text-destructive">
            {error}
          </p>
        ) : null}
        <ul className="mt-2 divide-y divide-border">
          {cart.lines.map((line) => (
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
                {line.priceChanged ? (
                  <p className="text-sm font-medium">
                    The price changed since you added this.
                  </p>
                ) : null}
                {!line.isPurchasable ? (
                  <p className="text-sm font-medium text-destructive">
                    {line.availableStock
                      ? `Only ${line.availableStock} left. Reduce the quantity to continue.`
                      : "Not available. Remove it to continue."}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-md border border-input">
                    <button
                      aria-label={`Decrease quantity of ${line.title}`}
                      className="size-8"
                      onClick={() => change(line, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      aria-label={`Increase quantity of ${line.title}`}
                      className="size-8"
                      onClick={() => change(line, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-sm underline"
                    onClick={() => change(line, 0)}
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
        <PriceSummary
          mrpTotal={cart.mrpTotal}
          subtotal={cart.subtotal}
          shippingTotal={cart.shippingTotal}
          total={cart.total}
        />
        {blocked ? (
          <Button
            variant="action"
            size="lg"
            className="mt-4 h-11 w-full"
            disabled
          >
            Proceed to checkout
          </Button>
        ) : (
          <Button
            variant="action"
            size="lg"
            className="mt-4 h-11 w-full"
            render={
              <Link
                href={
                  cart.isAuthenticated ? "/checkout" : "/login?next=%2Fcheckout"
                }
              />
            }
          >
            Proceed to checkout
          </Button>
        )}
      </aside>
    </div>
  )
}
