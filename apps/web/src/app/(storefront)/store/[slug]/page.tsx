"use client"
import { brand } from "@workspace/ui/lib/brand"

import React, { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useGetPublicStoreBySlugQuery } from "@workspace/store"
import {
  Star,
  ShieldCheck,
  Store,
  ChevronRight,
  Search,
  ShoppingCart,
  Heart,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Share2,
  UserPlus,
  CheckCircle2,
  Award,
  Truck,
  RotateCcw,
  Building2,
} from "lucide-react"
import { ProductImage } from "../../../../components/product-image"
import {
  formatRupees,
  useStorefrontProducts,
  type Product,
} from "../../../../lib/storefront-products"

type StoreTab = "products" | "about" | "reviews" | "policies"

export default function StorefrontPage() {
  const params = useParams()
  const rawSlug = (params?.slug as string) ?? ""
  const slug = decodeURIComponent(rawSlug)

  const { data: apiData, isLoading: isStoreLoading } =
    useGetPublicStoreBySlugQuery(slug, {
      skip: !slug,
    })

  const store = apiData?.store
  const { products } = useStorefrontProducts(
    { sellerId: store?.sellerId ?? "" },
    { skip: !store }
  )
  const seller = store?.seller
  const address = store?.address

  const [activeTab, setActiveTab] = useState<StoreTab>("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [, setCart] = useState<string[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const displayName = store?.displayName ?? ""
  const businessName = seller?.businessName ?? displayName
  const locationText = address ? `${address.city}, ${address.state}` : ""
  const descriptionText = store?.description ?? ""

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id])
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ]

  if (!store) {
    return (
      <p className="mx-auto w-full max-w-7xl px-4 py-16 text-muted-foreground sm:px-6 lg:px-8">
        {isStoreLoading
          ? "Loading this store."
          : "This store could not be found."}
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 text-foreground selection:bg-indigo-500 selection:text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-muted-foreground">Stores</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-bold text-foreground">
            {displayName}
          </span>
        </nav>

        {/* HERO STORE HEADER CARD */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          {/* Cover Banner */}
          <div className="relative flex h-48 w-full flex-col justify-between bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 text-white sm:h-56">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-xs font-extrabold tracking-wider uppercase backdrop-blur-md">
                Official Merchant Store
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 font-mono text-xs font-bold text-white shadow-lg">
                <ShieldCheck className="h-4 w-4" /> GST VERIFIED
              </span>
            </div>

            {/* Subtitle preview */}
            <div className="hidden text-right font-mono text-xs text-indigo-200/80 sm:block">
              cbsmarketplace.com/store/{slug}
            </div>
          </div>

          {/* Store Info Container */}
          <div className="relative p-6 pt-0 sm:p-8">
            {/* Logo Avatar */}
            <div className="-mt-16 mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-tr from-indigo-600 to-purple-600 text-4xl font-extrabold text-white shadow-2xl sm:h-28 sm:w-28">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                    {displayName}
                  </h1>
                  <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-indigo-700">
                    @{slug}
                  </span>
                </div>

                <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {descriptionText}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    4.8 (1,420 Ratings)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    {locationText}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    Member Since 2026
                  </span>
                </div>
              </div>

              {/* Action Buttons & Quick Stats */}
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
                    isFollowing
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>
                    {isFollowing ? "Following Store" : "Follow Store"}
                  </span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Key Value Props Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-zinc-50 p-3">
                <Award className="h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Status
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    99.2% Positive
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-zinc-50 p-3">
                <Truck className="h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Logistics
                  </span>
                  <span className="text-xs font-extrabold text-foreground">
                    Fast Dispatch
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-zinc-50 p-3">
                <RotateCcw className="h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Returns
                  </span>
                  <span className="text-xs font-extrabold text-foreground">
                    7 Days Policy
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-zinc-50 p-3">
                <Store className="h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                    Products
                  </span>
                  <span className="text-xs font-extrabold text-foreground">
                    {products.length} listed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STORE NAVIGATION TABS */}
        <div className="flex space-x-2 overflow-x-auto border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 text-xs font-bold transition-all ${
              activeTab === "products"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store className="h-4 w-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 text-xs font-bold transition-all ${
              activeTab === "about"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>About Merchant & Verification</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 text-xs font-bold transition-all ${
              activeTab === "reviews"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Ratings & Reviews (1,420)</span>
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 pb-3 text-xs font-bold transition-all ${
              activeTab === "policies"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Policies & Returns</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
              {/* Category Pills */}
              <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* In-Store Search Box */}
              <div className="relative min-w-[240px] sm:min-w-[280px]">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search inside ${displayName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2 pr-4 pl-10 text-xs focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card py-16 text-center">
                <Store className="mx-auto mb-3 h-10 w-10 text-muted-foreground opacity-40" />
                <h3 className="text-sm font-bold text-foreground">
                  No products match your search.
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try clearing filters or search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product: Product) => {
                  const isWishlisted = wishlist.includes(product.id)
                  return (
                    <div
                      key={product.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-indigo-500/30 hover:shadow-xl"
                    >
                      <div>
                        <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-100 text-6xl">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                          />
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-2.5 right-2.5 cursor-pointer rounded-full p-2 backdrop-blur-md transition-colors ${
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
                          className="line-clamp-1 block text-sm font-bold text-foreground transition-colors hover:text-indigo-600"
                        >
                          {product.name}
                        </Link>
                        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-500" />
                          <span>{product.ratingLabel}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <span className="text-base font-black text-foreground">
                          {formatRupees(product.price)}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="cursor-pointer rounded-xl bg-indigo-600 p-2 text-white shadow-xs transition-colors hover:bg-indigo-700"
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
        )}

        {/* TAB 2: ABOUT MERCHANT & VERIFICATION */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Registered Legal Business Information
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-border py-2">
                  <span className="font-medium text-muted-foreground">
                    Legal Business Name
                  </span>
                  <span className="font-bold text-foreground">
                    {businessName}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="font-medium text-muted-foreground">
                    Entity Type
                  </span>
                  <span className="font-bold text-foreground">
                    {seller?.businessType || "Private Limited Company"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border py-2">
                  <span className="font-medium text-muted-foreground">
                    GST Verification Status
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> VERIFIED
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-muted-foreground">
                    Operating Region
                  </span>
                  <span className="font-bold text-foreground">
                    {locationText}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Dispatch & Warehouse Address
              </h3>
              <div className="space-y-1 rounded-xl border border-border bg-zinc-50 p-4 text-xs">
                <p className="font-bold text-foreground">{displayName}</p>
                <p className="text-muted-foreground">
                  {address?.street1 || "Central Industrial Logistics Zone"}
                </p>
                <p className="text-muted-foreground">
                  {address?.city || "Mumbai"}, {address?.state || "Maharashtra"}{" "}
                  - {address?.postalCode || "400001"}
                </p>
                <p className="text-muted-foreground">
                  {address?.country || "India"}
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span>
                    Support Email:{" "}
                    {seller?.contactEmail || "support@cbsmarketplace.com"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-indigo-500" />
                  <span>
                    Support Line: {seller?.contactPhone || "+91 9876543210"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RATINGS & REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-zinc-50 p-6 sm:flex-row">
              <div className="border-border text-center sm:border-r sm:pr-8">
                <span className="block text-4xl font-black text-foreground">
                  4.8
                </span>
                <div className="my-1 flex items-center justify-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                  <Star className="h-4 w-4 fill-amber-500" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  1,420 Buyer Ratings
                </span>
              </div>

              <div className="w-full flex-1 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold">5 Stars</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full w-[88%] bg-amber-500" />
                  </div>
                  <span className="w-8 text-right font-mono">88%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold">4 Stars</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full w-[8%] bg-amber-500" />
                  </div>
                  <span className="w-8 text-right font-mono">8%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold">3 Stars</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
                    <div className="h-full w-[3%] bg-amber-500" />
                  </div>
                  <span className="w-8 text-right font-mono">3%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: POLICIES */}
        {activeTab === "policies" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <RotateCcw className="h-6 w-6 text-indigo-600" />
              <h3 className="text-sm font-extrabold">
                7-Day Hassle-Free Returns
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Products purchased from this store are eligible for 7-day easy
                returns if damaged or defective upon delivery.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <Truck className="h-6 w-6 text-indigo-600" />
              <h3 className="text-sm font-extrabold">
                Tracked Logistics Delivery
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Orders are dispatched via {brand.marketplaceName} logistics
                partners with real-time tracking updates.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              <h3 className="text-sm font-extrabold">
                Buyer Protection Guarantee
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your payment is held securely in escrow until successful
                delivery confirmation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
