"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Heart,
  Store,
  ChevronRight,
  Check,
} from "lucide-react"
import { ProductImage } from "../../../../components/product-image"
import {
  formatRupees,
  useStorefrontProduct,
} from "../../../../lib/storefront-products"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = (params?.id as string) ?? ""
  const { product, vendor, isLoading } = useStorefrontProduct(slug)

  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  if (!product || !vendor) {
    return (
      <p className="mx-auto w-full max-w-7xl px-4 py-16 text-muted-foreground sm:px-6 lg:px-8">
        {isLoading ? "Loading this product." : "This product is not available."}
      </p>
    )
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
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-bold text-foreground">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 gap-12 rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-10 lg:grid-cols-2">
          {/* Left Column: Visual Showcase */}
          <div className="space-y-4">
            <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-zinc-100 text-9xl shadow-inner">
              <ProductImage src={product.image} alt={product.name} />
              {product.tag && (
                <span className="absolute top-4 left-4 rounded-full bg-rose-600 px-3 py-1 font-mono text-xs font-black text-white shadow-md">
                  {product.tag}
                </span>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 rounded-full border p-3 backdrop-blur-md transition-all ${
                  isWishlisted
                    ? "border-rose-500 bg-rose-500 text-white"
                    : "border-border bg-background/80 text-muted-foreground"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`}
                />
              </button>
            </div>

            {/* Micro badges */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl border border-border bg-zinc-100 p-3">
                <Truck className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                <span className="block font-semibold">Free Delivery</span>
              </div>
              <div className="rounded-xl border border-border bg-zinc-100 p-3">
                <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                <span className="block font-semibold">1 Yr Warranty</span>
              </div>
              <div className="rounded-xl border border-border bg-zinc-100 p-3">
                <RotateCcw className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                <span className="block font-semibold">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-blue-600 uppercase">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span>{product.ratingLabel}</span>
                  <span className="font-normal text-muted-foreground">
                    ({product.reviewCount} verified reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl leading-tight font-black tracking-tight text-foreground sm:text-4xl">
                {product.name}
              </h1>

              {/* Vendor Info Box */}
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-zinc-100 p-2 px-3 text-xs">
                <Store className="h-4 w-4 text-emerald-500" />
                <span className="text-muted-foreground">Sold by:</span>
                <Link
                  href={`/store/${vendor.slug}`}
                  className="font-bold text-foreground hover:underline"
                >
                  {product.vendorName || vendor.name}
                </Link>
                {vendor.verified && (
                  <span className="ml-1 rounded bg-emerald-500 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    VERIFIED
                  </span>
                )}
              </div>

              {/* Price Tag */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-black text-foreground">
                  {formatRupees(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-base text-muted-foreground line-through">
                    {formatRupees(product.originalPrice)}
                  </span>
                )}
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-600">
                  In Stock & Ready to Ship
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Product Features checklist */}
              {product.features && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-mono text-xs font-bold tracking-wider text-foreground uppercase">
                    Key Highlights:
                  </h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {product.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-medium text-foreground"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-4">
                <label className="font-mono text-xs font-bold text-muted-foreground uppercase">
                  Quantity:
                </label>
                <div className="flex items-center overflow-hidden rounded-xl border border-border bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold hover:bg-zinc-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-mono text-xs font-extrabold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-sm font-bold hover:bg-zinc-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold shadow-xl transition-all sm:flex-1 ${
                    addedToCart
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 text-white hover:scale-[1.01] hover:bg-blue-700"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-4 w-4" /> Added To Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add To Shopping Cart
                    </>
                  )}
                </button>
                <Link
                  href="/checkout"
                  className="w-full rounded-2xl bg-foreground px-8 py-4 text-center text-sm font-black text-background transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
