"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Star,
  ShieldCheck,
  ChevronRight,
  Search,
  ShoppingCart,
  Heart,
  Calendar,
} from "lucide-react"
import {
  mockVendors,
  mockProducts,
  Vendor,
  Product,
} from "../../../../utils/mockData"

export default function VendorStorePage() {
  const params = useParams()
  const storeSlug = (params?.id as string) || "apex-electronics"

  const vendor: Vendor =
    mockVendors.find((v) => v.slug === storeSlug) || mockVendors[0]!

  const vendorProducts: Product[] = mockProducts.filter(
    (p) => p.vendorName === vendor.name || p.vendorId === vendor.id
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [, setCart] = useState<string[]>([])

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id])
  }

  const filteredProducts = vendorProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background py-8 text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-muted-foreground">Stores</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-bold text-foreground">{vendor.name}</span>
        </nav>

        {/* Store Banner & Header Card */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <div
            className={`h-48 w-full bg-gradient-to-r ${vendor.bannerGradient} relative flex items-start justify-between p-6 text-white`}
          >
            <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              {vendor.category}
            </span>
            {vendor.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 font-mono text-xs font-bold text-white shadow-md">
                <ShieldCheck className="h-4 w-4" /> VERIFIED MERCHANT
              </span>
            )}
          </div>

          <div className="relative p-6 pt-0 sm:p-8">
            {/* Logo Avatar */}
            <div className="-mt-14 mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-border bg-card text-5xl shadow-2xl">
              {vendor.logo}
            </div>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                  {vendor.name}
                </h1>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                  {vendor.description}
                </p>
                <div className="mt-3 flex items-center gap-4 font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    {vendor.rating} ({vendor.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {vendor.joinDate}
                  </span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-zinc-100 p-4 dark:bg-zinc-900/60">
                <div className="px-3 text-center">
                  <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Products
                  </span>
                  <span className="text-lg font-black text-foreground">
                    {vendor.productCount}
                  </span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="px-3 text-center">
                  <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Seller Score
                  </span>
                  <span className="text-lg font-black text-emerald-500">
                    99.4%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              Products from {vendor.name}
            </h2>

            <div className="relative w-full max-w-sm">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search inside ${vendor.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card py-2 pr-4 pl-10 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-12 text-center">
              <p className="text-sm font-bold text-foreground">
                No items match your search inside this store.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product: Product) => {
                const isWishlisted = wishlist.includes(product.id)
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-xl"
                  >
                    <div>
                      <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-100 text-6xl dark:bg-zinc-900">
                        <span className="transition-transform group-hover:scale-110">
                          {product.image}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-2.5 right-2.5 rounded-full p-2 backdrop-blur-md transition-colors ${
                            isWishlisted
                              ? "bg-rose-500 text-white"
                              : "bg-background/80 text-muted-foreground"
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${isWishlisted ? "fill-white" : ""}`}
                          />
                        </button>
                      </div>

                      <Link
                        href={`/products/${product.id}`}
                        className="line-clamp-1 block text-sm font-bold text-foreground transition-colors hover:text-blue-500"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-base font-extrabold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="rounded-xl bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
