import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EmptyState } from "@workspace/ui/components/states"

import { ResultGrid } from "../../../../components/storefront/catalog"
import { getProductCards, getStore } from "../../../../lib/server-api"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = await getStore((await params).slug)
  return { title: store?.displayName ?? "Store not found" }
}

export default async function StorePage({ params }: Props) {
  const store = await getStore((await params).slug)
  if (!store) notFound()

  const products = await getProductCards({ sellerId: store.sellerId })

  return (
    <div className="space-y-2 sm:space-y-3">
      <header className="bg-tint-sky p-5 sm:rounded-lg sm:p-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {store.displayName}
        </h1>
        {store.address ? (
          <p className="mt-0.5">
            {store.address.city}, {store.address.state}
          </p>
        ) : null}
        {store.description ? (
          <p className="mt-2 max-w-prose">{store.description}</p>
        ) : null}
      </header>

      {products.length > 0 ? (
        <ResultGrid products={products} />
      ) : (
        <div className="bg-card sm:rounded-lg">
          <EmptyState
            title="No products yet"
            description="This store has not listed anything for sale."
          />
        </div>
      )}
    </div>
  )
}
