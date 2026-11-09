"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"
import { useGetProductsQuery, type CategoryTreeNode } from "@workspace/store"
import { formatInr } from "@workspace/ui/lib/money"

import { toProductCard } from "../../lib/product-card"
import { ProductImage } from "../product-image"

const SEARCH_DELAY_MS = 250
const MIN_SEARCH_LENGTH = 2

export function SearchBox({
  departments,
}: {
  departments: CategoryTreeNode[]
}) {
  const router = useRouter()
  const [term, setTerm] = useState("")
  const [query, setQuery] = useState("")
  const [department, setDepartment] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setQuery(term.trim()), SEARCH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [term])

  const canSearch = query.length >= MIN_SEARCH_LENGTH
  const { data, isFetching } = useGetProductsQuery(
    {
      search: query,
      status: "APPROVED",
      limit: 6,
      ...(department ? { category: department } : {}),
    },
    { skip: !canSearch }
  )
  const results = canSearch
    ? (data?.items ?? []).flatMap((item) => toProductCard(item) ?? [])
    : []

  const close = () => setIsOpen(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (term.trim()) params.set("q", term.trim())
    if (department) params.set("category", department)
    close()
    router.push(`/products?${params}`)
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="relative flex h-10 rounded-md bg-card focus-within:outline-2 focus-within:outline-ring"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close()
      }}
    >
      <select
        aria-label="Department to search"
        value={department}
        onChange={(event) => setDepartment(event.target.value)}
        className="hidden max-w-36 rounded-l-md border-r border-border bg-muted px-2 text-sm outline-none sm:block"
      >
        <option value="">All</option>
        {departments.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <input
        type="search"
        value={term}
        onChange={(event) => {
          setTerm(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search for products and brands"
        aria-label="Search for products and brands"
        className="min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex w-12 items-center justify-center rounded-r-md bg-primary text-primary-foreground"
      >
        <SearchIcon className="size-5" aria-hidden="true" />
      </button>

      {isOpen && canSearch ? (
        <div className="absolute inset-x-0 top-full z-50 mt-1 rounded-lg bg-popover p-1 shadow-lg">
          {results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={close}
                    className="flex items-center gap-3 rounded-md p-1.5 hover:bg-accent"
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-sm bg-muted">
                      <ProductImage
                        src={product.image}
                        alt=""
                        sizes="44px"
                        eager
                      />
                    </span>
                    <span className="line-clamp-1 flex-1 text-sm">
                      {product.title}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatInr(product.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : !isFetching ? (
            <p className="p-3 text-muted-foreground">
              Nothing matches “{query}”.
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}
