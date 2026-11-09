"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getApiErrorMessage, useGetOrdersQuery } from "@workspace/store"
import { Button } from "@workspace/ui/components/button"
import { Pagination } from "@workspace/ui/components/pagination"
import { EmptyState, ErrorState } from "@workspace/ui/components/states"
import { StatusPill } from "@workspace/ui/components/status-pill"
import { formatInr } from "@workspace/ui/lib/money"

import { ProductImage } from "../../../components/product-image"
import { useSession } from "../../../lib/use-cart"
import { formatOrderDate } from "./format"

const THUMBNAILS_SHOWN = 4

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, isChecking } = useSession()
  const [page, setPage] = useState(1)
  const { data, isLoading, error, refetch } = useGetOrdersQuery(
    { page },
    { skip: !isAuthenticated }
  )

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.replace("/login?next=%2Forders")
    }
  }, [isChecking, isAuthenticated, router])

  if (!isAuthenticated || isLoading) {
    return <p className="p-6 text-muted-foreground">Loading your orders.</p>
  }

  if (error) {
    return (
      <div className="bg-card sm:rounded-lg">
        <ErrorState
          message={getApiErrorMessage(
            error,
            "Your orders could not be loaded."
          )}
          onRetry={refetch}
        />
      </div>
    )
  }

  const orders = data?.data ?? []
  if (orders.length === 0) {
    return (
      <div className="bg-card sm:rounded-lg">
        <EmptyState
          title="No orders yet"
          description="Orders you place will appear here."
          action={
            <Button render={<Link href="/products" />}>Browse products</Button>
          }
        />
      </div>
    )
  }

  return (
    <section className="bg-card p-3 sm:rounded-lg sm:p-4">
      <h1 className="text-xl font-semibold">Your orders</h1>
      <ul className="mt-2 divide-y divide-border">
        {orders.map((order) => (
          <li key={order.orderNumber}>
            <Link
              href={`/orders/${order.orderNumber}`}
              className="group flex flex-wrap items-center gap-x-4 gap-y-2 py-3"
            >
              <span className="flex gap-1">
                {order.thumbnails
                  .slice(0, THUMBNAILS_SHOWN)
                  .map((image, index) => (
                    <span
                      key={index}
                      className="relative size-14 overflow-hidden rounded-md bg-muted"
                    >
                      <ProductImage src={image} alt="" sizes="56px" eager />
                    </span>
                  ))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium group-hover:underline">
                  {order.orderNumber}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {order.placedAt ? formatOrderDate(order.placedAt) : ""},{" "}
                  {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                </span>
              </span>
              <StatusPill status={order.status} />
              <span className="font-bold tabular-nums">
                {formatInr(order.grandTotal)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {data ? (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.total}
          onPageChange={setPage}
        />
      ) : null}
    </section>
  )
}
