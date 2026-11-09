"use client"

import Link from "next/link"
import { useGetProductsQuery, useGetSellersAdminQuery } from "@workspace/store"
import { Button } from "@workspace/ui/components/button"

export default function AdminDashboard() {
  const sellers = useGetSellersAdminQuery({ limit: 100 })
  const pendingProducts = useGetProductsQuery({
    status: "PENDING_REVIEW",
    limit: 1,
  })

  const allSellers = sellers.data?.data ?? []
  const queue = allSellers.filter((seller) => seller.status === "UNDER_REVIEW")

  const metrics = [
    { label: "Sellers", value: sellers.data?.total },
    { label: "Sellers waiting for review", value: queue.length },
    {
      label: "Products waiting for review",
      value: pendingProducts.data?.total,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold type-display">Overview</h1>

      <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-card p-4">
            <dt className="text-muted-foreground">{metric.label}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums">
              {metric.value ?? "–"}
            </dd>
          </div>
        ))}
      </dl>

      <section className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Seller review queue</h2>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/dashboard/sellers" />}
          >
            Open all sellers
          </Button>
        </div>

        {sellers.isError ? (
          <div className="flex items-center gap-4 p-4 text-muted-foreground">
            <p>The queue could not be loaded.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sellers.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : queue.length === 0 ? (
          <p className="p-4 text-muted-foreground">
            {sellers.isLoading
              ? "Loading the queue."
              : "No sellers are waiting for review."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {queue.map((seller) => (
              <li
                key={seller.id}
                className="flex row-density items-center justify-between px-4"
              >
                <span className="font-medium">{seller.businessName}</span>
                <span className="text-muted-foreground">
                  {seller.contactEmail}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
