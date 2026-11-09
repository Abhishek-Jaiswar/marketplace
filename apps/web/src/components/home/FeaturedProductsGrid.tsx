"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Star, ShoppingCart, Heart, ArrowRight, Sparkles } from "lucide-react"
import { mockProducts, Product } from "../../utils/mockData"

interface FeaturedProductsGridProps {
  onAddToCart?: (id: string) => void
  onToggleWishlist?: (id: string) => void
  wishlist?: string[]
}

export function FeaturedProductsGrid({
  onAddToCart,
  onToggleWishlist,
  wishlist = [],
}: FeaturedProductsGridProps) {
  const [activeTab, setActiveTab] = useState("All")

  const categories = [
    "All",
    "Electronics",
    "Fashion & Apparel",
    "Home & Kitchen",
    "Sports & Outdoors",
    "Beauty & Wellness",
  ]

  const filteredProducts =
    activeTab === "All"
      ? mockProducts
      : mockProducts.filter((p: Product) => p.category === activeTab)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header & Category Tabs */}
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Handpicked Selection
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Featured Products
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === cat
                  ? "bg-foreground text-background shadow-md"
                  : "border border-border bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product: Product) => {
          const isWishlisted = wishlist.includes(product.id)

          return (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-zinc-400/50 hover:shadow-xl dark:hover:border-zinc-700"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-100 text-7xl dark:bg-zinc-900">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {product.image}
                  </span>

                  {product.tag && (
                    <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-zinc-900/90 px-2.5 py-1 font-mono text-[10px] font-black text-white shadow-sm">
                      {product.tag}
                    </span>
                  )}

                  <button
                    onClick={() =>
                      onToggleWishlist && onToggleWishlist(product.id)
                    }
                    className={`absolute top-3 right-3 rounded-full p-2 backdrop-blur-md transition-all ${
                      isWishlisted
                        ? "bg-rose-500 text-white"
                        : "bg-background/80 text-muted-foreground hover:bg-background hover:text-rose-500"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 ${isWishlisted ? "fill-white" : ""}`}
                    />
                  </button>
                </div>

                {/* Vendor & Title */}
                <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                  <span className="truncate">
                    {product.vendorName || "Verified Vendor"}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" />
                    {product.rating}
                  </span>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="line-clamp-2 text-sm font-bold text-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {product.name}
                </Link>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Price & Cart Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div>
                  <span className="text-lg font-extrabold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 font-mono text-xs text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => onAddToCart && onAddToCart(product.id)}
                    className="rounded-xl bg-blue-600 p-2 text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-8 py-3.5 text-sm font-bold text-foreground shadow-md transition-all hover:border-zinc-400 hover:shadow-xl dark:hover:border-zinc-700"
        >
          Browse All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

export default FeaturedProductsGrid
