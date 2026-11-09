import Image from "next/image"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Price } from "@workspace/ui/components/price"
import { brand } from "@workspace/ui/lib/brand"
import { discountPercent, formatInr } from "@workspace/ui/lib/money"

import { ProductImage } from "../../components/product-image"
import {
  OffTag,
  Panel,
  QuadCard,
  Shelf,
} from "../../components/storefront/catalog"
import { DealCountdown } from "../../components/storefront/commerce"
import { departmentLookup, sellerCentralUrl } from "../../lib/departments"
import { mockPromotions } from "../../lib/mock-data"
import { getCategoryTree, getProductCards } from "../../lib/server-api"

const QUAD_SIZE = 4
const MAX_QUADS = 4
const BUDGET_PAISE = 200000

export default async function HomePage() {
  const [departments, products] = await Promise.all([
    getCategoryTree(),
    getProductCards(),
  ])

  const departmentOf = departmentLookup(departments)
  const bySaving = [...products]
    .filter((product) => product.image)
    .sort(
      (a, b) =>
        discountPercent(b.mrp, b.price) - discountPercent(a.mrp, a.price)
    )
  const [featured, ...savings] = bySaving
  const budget = products.filter((product) => product.price < BUDGET_PAISE)

  const quads = departments
    .map((department) => ({
      department,
      items: products.filter(
        (product) => departmentOf(product.categorySlug) === department.slug
      ),
    }))
    .filter(({ items }) => items.length >= QUAD_SIZE)
    .slice(0, MAX_QUADS)

  const departmentShelves = departments
    .map((department) => ({
      department,
      items: products.filter(
        (product) => departmentOf(product.categorySlug) === department.slug
      ),
    }))
    .filter(({ items }) => items.length >= QUAD_SIZE)

  return (
    <div className="space-y-2 sm:space-y-3">
      <h1 className="sr-only">{brand.marketplaceName}</h1>

      <Panel>
        <ul className="scrollbar-none flex gap-3 overflow-x-auto lg:grid lg:grid-cols-8">
          {departments.map((department) => (
            <li key={department.id} className="w-20 shrink-0 lg:w-auto">
              <Link
                href={`/products?category=${department.slug}`}
                className="group block text-center"
              >
                <span className="relative mx-auto block size-16 overflow-hidden rounded-full bg-muted lg:size-20">
                  <Image
                    src={department.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </span>
                <span className="mt-1.5 line-clamp-2 block text-xs font-medium group-hover:underline sm:text-sm">
                  {department.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      {featured ? (
        <div className="grid gap-2 sm:gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section className="grid overflow-hidden bg-tint-wheat sm:grid-cols-2 sm:rounded-lg">
            <div className="flex flex-col justify-center p-5 sm:p-8">
              <p className="font-medium">
                Biggest saving today:{" "}
                {discountPercent(featured.mrp, featured.price)}% off
              </p>
              <Link
                href={`/products/${featured.slug}`}
                className="mt-2 text-2xl leading-tight font-semibold hover:underline lg:text-3xl"
              >
                {featured.title}
              </Link>
              <Price
                className="mt-4"
                amount={featured.price}
                mrp={featured.mrp}
                size="lg"
              />
              <Button
                variant="action"
                size="lg"
                className="mt-5 self-start"
                render={<Link href={`/products/${featured.slug}`} />}
              >
                View product
              </Button>
            </div>
            <Link
              href={`/products/${featured.slug}`}
              className="relative order-first aspect-[4/3] sm:order-none sm:aspect-auto sm:min-h-80"
            >
              <ProductImage
                src={featured.image}
                alt={featured.title}
                sizes="(min-width: 1024px) 34vw, 100vw"
                eager
              />
            </Link>
          </section>

          <Panel title="More big savings">
            <ul className="divide-y divide-border">
              {savings.slice(0, 3).map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex items-center gap-3 py-2"
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <ProductImage src={product.image} alt="" sizes="80px" />
                      <OffTag product={product} className="top-1" />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm group-hover:underline">
                        {product.title}
                      </span>
                      <span className="mt-0.5 block font-bold tabular-nums">
                        {formatInr(product.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}

      <ul className="grid gap-2 sm:grid-cols-3 sm:gap-3">
        {mockPromotions.map((promotion) => (
          <li
            key={promotion.title}
            className={`p-3 sm:rounded-lg ${promotion.tint}`}
          >
            <p className="font-semibold">{promotion.title}</p>
            <p className="text-sm">{promotion.detail}</p>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {quads.map(({ department, items }) => (
          <QuadCard
            key={department.id}
            title={department.name}
            href={`/products?category=${department.slug}`}
            products={items}
          />
        ))}
        {budget.length >= QUAD_SIZE ? (
          <QuadCard
            title={`Under ${formatInr(BUDGET_PAISE)}`}
            href="/products?price=under-1000"
            products={budget}
          />
        ) : null}
      </div>

      <Shelf
        title="Deals of the day"
        href="/products?off=25"
        extra={<DealCountdown />}
        products={savings.slice(3, 15)}
      />
      <Shelf
        title="New arrivals"
        href="/products"
        products={products.slice(0, 12)}
      />
      {departmentShelves.map(({ department, items }) => (
        <Shelf
          key={department.id}
          title={department.name}
          href={`/products?category=${department.slug}`}
          products={items}
        />
      ))}

      <section className="flex flex-col items-start gap-3 bg-tint-sky p-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-lg">
        <div>
          <h2 className="text-lg font-semibold">Sell on {brand.name}</h2>
          <p>Register with your GSTIN and list your first product.</p>
        </div>
        <Button
          variant="outline"
          size="lg"
          render={<a href={sellerCentralUrl} />}
        >
          Start selling
        </Button>
      </section>
    </div>
  )
}
