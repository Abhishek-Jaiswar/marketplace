"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { getApiErrorMessage, useGetOrderQuery } from "@workspace/store"
import { Button } from "@workspace/ui/components/button"
import { ErrorState } from "@workspace/ui/components/states"
import { StatusPill } from "@workspace/ui/components/status-pill"
import { formatInr } from "@workspace/ui/lib/money"

import { ProductImage } from "../../../../components/product-image"
import { useSession } from "../../../../lib/use-cart"
import { formatOrderDate } from "../format"

const paymentLabels: Record<string, string> = {
  COD: "Cash on delivery",
  UPI: "Paid online (test mode)",
}

export default function OrderPage() {
  const router = useRouter()
  const params = useParams<{ orderNumber: string }>()
  const justPlaced = useSearchParams().get("placed") === "1"
  const { isAuthenticated, isChecking } = useSession()
  const { data, isLoading, error, refetch } = useGetOrderQuery(
    params.orderNumber,
    { skip: !isAuthenticated }
  )

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.replace(
        `/login?next=${encodeURIComponent(`/orders/${params.orderNumber}`)}`
      )
    }
  }, [isChecking, isAuthenticated, params.orderNumber, router])

  if (!isAuthenticated || isLoading) {
    return <p className="p-6 text-muted-foreground">Loading your order.</p>
  }

  const order = data?.data
  if (error || !order) {
    return (
      <div className="bg-card sm:rounded-lg">
        <ErrorState
          message={getApiErrorMessage(error, "This order could not be loaded.")}
          onRetry={refetch}
        />
      </div>
    )
  }

  const address = order.shippingAddress

  return (
    <div className="space-y-2 sm:space-y-3">
      {justPlaced ? (
        <section className="bg-tint-pista p-4 sm:rounded-lg">
          <h1 className="text-xl font-semibold">Your order is placed</h1>
          <p>
            Order {order.orderNumber}. The sellers will pack and ship your items
            next.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            render={<Link href="/products" />}
          >
            Continue shopping
          </Button>
        </section>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-2 sm:space-y-3">
          {order.sellerOrders.map((group) => (
            <section key={group.id} className="bg-card p-4 sm:rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold">Sold by {group.seller}</h2>
                <StatusPill status={group.status} />
              </div>
              <ul className="mt-2 divide-y divide-border">
                {group.items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-3">
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <ProductImage
                        src={item.imageUrl}
                        alt=""
                        sizes="80px"
                        eager
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      {item.slug ? (
                        <Link
                          href={`/products/${item.slug}`}
                          className="line-clamp-2 hover:underline"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="line-clamp-2">{item.title}</span>
                      )}
                      <span className="block text-sm text-muted-foreground">
                        {item.option ? `${item.option}, ` : ""}Qty{" "}
                        {item.quantity}
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatInr(item.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="space-y-2 self-start sm:space-y-3">
          <section className="bg-card p-4 sm:rounded-lg">
            {justPlaced ? (
              <h2 className="font-semibold">{order.orderNumber}</h2>
            ) : (
              <h1 className="font-semibold">{order.orderNumber}</h1>
            )}
            {order.placedAt ? (
              <p className="text-sm text-muted-foreground">
                Placed on {formatOrderDate(order.placedAt)}
              </p>
            ) : null}
            <dl className="mt-3 space-y-1.5">
              <div className="flex justify-between">
                <dt>Items</dt>
                <dd className="tabular-nums">{formatInr(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd className="tabular-nums">
                  {order.shippingTotal === 0
                    ? "Free"
                    : formatInr(order.shippingTotal)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatInr(order.grandTotal)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-sm text-muted-foreground">
              Includes {formatInr(order.taxTotal)} GST
            </p>
            {order.paymentMethod ? (
              <p className="mt-3">
                {paymentLabels[order.paymentMethod] ?? order.paymentMethod}
              </p>
            ) : null}
          </section>

          <section className="bg-card p-4 sm:rounded-lg">
            <h2 className="font-semibold">Delivering to</h2>
            <p className="mt-1">{address.recipientName}</p>
            <p>
              {address.street1}
              {address.street2 ? `, ${address.street2}` : ""}
            </p>
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            {address.phoneNumber ? (
              <p className="text-sm text-muted-foreground">
                {address.phoneNumber}
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  )
}
