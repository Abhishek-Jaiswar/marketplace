import type { Metadata } from "next"
import Link from "next/link"
import { XIcon } from "lucide-react"
import type { CategoryTreeNode } from "@workspace/store"
import { discountPercent } from "@workspace/ui/lib/money"
import { EmptyState } from "@workspace/ui/components/states"
import { cn } from "@workspace/ui/lib/utils"

import { ResultGrid } from "../../../components/storefront/catalog"
import {
  FilterSheet,
  type FilterGroup,
} from "../../../components/storefront/filter-sheet"
import { mockRating } from "../../../lib/mock-data"
import { getCategoryTree, getProductCards } from "../../../lib/server-api"

export const metadata: Metadata = { title: "Products" }

const PAGE_SIZE = 24

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
  { value: "rating", label: "Top rated" },
]

// Paise bounds; the upper bound is exclusive.
const prices = [
  { value: "under-1000", label: "Under ₹1,000", min: 0, max: 100000 },
  { value: "1000-5000", label: "₹1,000 to ₹5,000", min: 100000, max: 500000 },
  { value: "over-5000", label: "Over ₹5,000", min: 500000, max: Infinity },
]

const discounts = [10, 25, 40]
const ratings = [4, 3]

type SearchParams = Record<string, string | string[] | undefined>
const single = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined

function findPath(
  nodes: CategoryTreeNode[],
  slug: string
): CategoryTreeNode[] | null {
  for (const node of nodes) {
    if (node.slug === slug) return [node]
    const below = findPath(node.children ?? [], slug)
    if (below) return [node, ...below]
  }
  return null
}

function FilterList({ groups }: { groups: FilterGroup[] }) {
  return (
    <div className="divide-y divide-border">
      {groups.map((group) => (
        <section key={group.title} className="py-3 first:pt-0">
          <h3 className="mb-1.5 font-semibold">{group.title}</h3>
          <ul className="space-y-1">
            {group.options.map((option) => (
              <li key={option.label}>
                <Link
                  href={option.href}
                  aria-current={option.active ? "true" : undefined}
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0 rounded-sm border",
                      option.active
                        ? "border-primary bg-primary"
                        : "border-input"
                    )}
                  />
                  {option.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const search = single(params.q)?.trim() || undefined
  const category = single(params.category) || undefined
  const sort = single(params.sort) ?? "newest"
  const price = single(params.price)
  const off = Number(single(params.off)) || 0
  const minRating = Number(single(params.rating)) || 0
  const page = Math.max(1, Number(single(params.page)) || 1)

  const [tree, fetched] = await Promise.all([
    getCategoryTree(),
    getProductCards({ search, category }),
  ])

  const path = category ? findPath(tree, category) : null
  const current = path?.at(-1)
  const department = path?.[0]
  const band = prices.find((option) => option.value === price)
  const saving = (product: { mrp: number; price: number }) =>
    discountPercent(product.mrp, product.price)

  const products = fetched.filter(
    (product) =>
      (!band || (product.price >= band.min && product.price < band.max)) &&
      saving(product) >= off &&
      mockRating(product.slug).rating >= minRating
  )
  if (sort === "price-low") products.sort((a, b) => a.price - b.price)
  if (sort === "price-high") products.sort((a, b) => b.price - a.price)
  if (sort === "discount") products.sort((a, b) => saving(b) - saving(a))
  if (sort === "rating") {
    products.sort(
      (a, b) => mockRating(b.slug).rating - mockRating(a.slug).rating
    )
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const href = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams()
    const merged = {
      q: search,
      category,
      sort,
      price,
      off: off ? String(off) : undefined,
      rating: minRating ? String(minRating) : undefined,
      page: undefined,
      ...changes,
    }
    for (const [key, value] of Object.entries(merged)) {
      if (value && !(key === "sort" && value === "newest")) {
        next.set(key, value)
      }
    }
    const query = next.toString()
    return query ? `/products?${query}` : "/products"
  }

  const title = search
    ? `Results for “${search}”`
    : (current?.name ?? "All products")

  const departmentOptions = (
    department?.children?.length ? department.children : tree
  ).map((node) => ({
    label: node.name,
    href: href({
      category: current?.id === node.id ? department?.slug : node.slug,
    }),
    active: current?.id === node.id,
  }))

  const filterGroups: FilterGroup[] = [
    {
      title: department ? department.name : "Department",
      options: departmentOptions,
    },
    {
      title: "Price",
      options: prices.map((option) => ({
        label: option.label,
        href: href({
          price: price === option.value ? undefined : option.value,
        }),
        active: price === option.value,
      })),
    },
    {
      title: "Customer rating",
      options: ratings.map((value) => ({
        label: `${value} stars and up`,
        href: href({ rating: minRating === value ? undefined : String(value) }),
        active: minRating === value,
      })),
    },
    {
      title: "Discount",
      options: discounts.map((value) => ({
        label: `${value}% off or more`,
        href: href({ off: off === value ? undefined : String(value) }),
        active: off === value,
      })),
    },
  ]

  const sheetGroups: FilterGroup[] = [
    {
      title: "Sort by",
      options: sorts.map((option) => ({
        label: option.label,
        href: href({ sort: option.value }),
        active: sort === option.value,
      })),
    },
    ...filterGroups,
  ]

  const applied = [
    search ? { label: `“${search}”`, href: href({ q: undefined }) } : null,
    band ? { label: band.label, href: href({ price: undefined }) } : null,
    off
      ? { label: `${off}% off or more`, href: href({ off: undefined }) }
      : null,
    minRating
      ? {
          label: `${minRating} stars and up`,
          href: href({ rating: undefined }),
        }
      : null,
  ].filter((chip) => chip !== null)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside
        aria-label="Filters"
        className="hidden self-start rounded-lg bg-card p-4 lg:block"
      >
        <FilterList groups={filterGroups} />
      </aside>

      <div className="min-w-0 space-y-2 sm:space-y-3">
        <div className="bg-card p-3 sm:rounded-lg sm:px-4">
          {path && path.length > 1 ? (
            <nav aria-label="Breadcrumb" className="mb-1 text-sm">
              {path.slice(0, -1).map((node) => (
                <span key={node.id}>
                  <Link
                    href={href({ category: node.slug })}
                    className="text-muted-foreground hover:underline"
                  >
                    {node.name}
                  </Link>
                  <span aria-hidden="true" className="text-muted-foreground">
                    {" / "}
                  </span>
                </span>
              ))}
            </nav>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground tabular-nums">
                {products.length} {products.length === 1 ? "result" : "results"}
              </p>
            </div>
            <div className="lg:hidden">
              <FilterSheet groups={sheetGroups} />
            </div>
          </div>

          <nav
            aria-label="Sort products"
            className="mt-2 hidden flex-wrap items-center gap-x-5 border-t border-border pt-2 text-sm lg:flex"
          >
            <span className="font-medium">Sort by</span>
            {sorts.map((option) => (
              <Link
                key={option.value}
                href={href({ sort: option.value })}
                aria-current={sort === option.value ? "true" : undefined}
                className={cn(
                  "py-0.5 hover:underline",
                  sort === option.value &&
                    "border-b-2 border-primary font-semibold"
                )}
              >
                {option.label}
              </Link>
            ))}
          </nav>

          {applied.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {applied.map((chip) => (
                <li key={chip.label}>
                  <Link
                    href={chip.href}
                    aria-label={`Remove filter ${chip.label}`}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
                  >
                    {chip.label}
                    <XIcon className="size-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {visible.length > 0 ? (
          <ResultGrid products={visible} />
        ) : (
          <div className="bg-card sm:rounded-lg">
            <EmptyState
              title="No products match"
              description="Remove a filter or try a different department."
            />
          </div>
        )}

        {totalPages > 1 ? (
          <nav
            aria-label="Pagination"
            className="flex items-center justify-between bg-card p-3 sm:rounded-lg"
          >
            {page > 1 ? (
              <Link
                href={href({ page: String(page - 1) })}
                className="underline"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-muted-foreground tabular-nums">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={href({ page: String(page + 1) })}
                className="underline"
              >
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </div>
  )
}
