"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Star,
  ShoppingCart,
  Heart,
  ArrowUpDown,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react"
import {
  mockProducts,
  mockCategories,
  mockVendors,
  Product,
} from "../../../utils/mockData"

function ProductsPageContent() {
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedVendor, setSelectedVendor] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [, setCart] = useState<string[]>([])

  // Sync state with URL search params (e.g. when coming from Navbar search)
  useEffect(() => {
    const qParam = searchParams.get("q") || ""
    const catParam = searchParams.get("category") || "All"
    const vendorParam = searchParams.get("vendor") || "All"

    setSearchQuery(qParam)
    setSelectedCategory(catParam)
    setSelectedVendor(vendorParam)
  }, [searchParams])

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id])
  }

  // Filter logic
  let filtered = mockProducts.filter((p: Product) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase()

    const matchesVendor =
      selectedVendor === "All" ||
      p.vendorName?.toLowerCase() === selectedVendor.toLowerCase()

    return matchesSearch && matchesCategory && matchesVendor
  })

  // Sort logic
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating)
  }

  return (
    <div className="min-h-screen bg-background py-8 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-bold text-foreground">Search Catalog</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "All Marketplace Products"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Showing {filtered.length} products matching your query
            </p>
          </div>

          {/* Search bar inside page */}
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Refine search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-2.5 pr-4 pl-10 text-xs transition-colors focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between border-b border-border pb-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span>Refine Search</span>
              </div>
              {(searchQuery ||
                selectedCategory !== "All" ||
                selectedVendor !== "All") && (
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedVendor("All")
                    setSearchQuery("")
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="mb-3 font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                    selectedCategory === "All"
                      ? "bg-primary font-bold text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  All Categories
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-primary font-bold text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>
                      {cat.image} {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Filter */}
            <div className="border-t border-border pt-4">
              <h3 className="mb-3 font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Store / Vendor
              </h3>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
              >
                <option value="All">All Vendors</option>
                {mockVendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="space-y-6 lg:col-span-3">
            {/* Sorting bar */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-xs">
              <span className="font-medium text-muted-foreground">
                Results:{" "}
                <strong className="text-foreground">{filtered.length}</strong>{" "}
                items found
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none"
                >
                  <option value="featured">Relevance & Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filtered.length === 0 ? (
              <div className="space-y-3 rounded-2xl border border-border bg-card py-16 text-center">
                <p className="text-lg font-extrabold text-foreground">
                  No matching products found.
                </p>
                <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                  We couldn&apos;t find any items matching &ldquo;{searchQuery}
                  &rdquo;. Try checking for typos or searching for generic terms
                  like &ldquo;headphones&rdquo; or &ldquo;keyboard&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All")
                    setSelectedVendor("All")
                    setSearchQuery("")
                  }}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md"
                >
                  Clear Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((product: Product) => {
                  const isWishlisted = wishlist.includes(product.id)
                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-xl"
                    >
                      <div>
                        <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-muted/40 text-6xl">
                          <span className="transition-transform group-hover:scale-110">
                            {product.image}
                          </span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-2.5 right-2.5 rounded-full p-2 backdrop-blur-md transition-colors ${
                              isWishlisted
                                ? "bg-accent text-white"
                                : "bg-background/80 text-muted-foreground"
                            }`}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${isWishlisted ? "fill-white" : ""}`}
                            />
                          </button>
                        </div>

                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          {product.vendorName || "Verified Store"}
                        </span>
                        <Link
                          href={`/products/${product.id}`}
                          className="line-clamp-1 block text-sm font-bold text-foreground transition-colors hover:text-primary"
                        >
                          {product.name}
                        </Link>
                        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>{product.rating}</span>
                          <span className="font-normal text-muted-foreground">
                            ({product.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <span className="text-base font-extrabold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="rounded-xl bg-secondary p-2 font-bold text-secondary-foreground shadow-md transition-all hover:bg-secondary/90 active:scale-95"
                          aria-label="Add to Cart"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-bold">
          Loading marketplace catalog...
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  )
}
