"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingCart, Heart, Store, ChevronRight, Check } from "lucide-react";
import { mockProducts, mockVendors, Product, Vendor } from "../../../../utils/mockData";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "prod-1";

  const product: Product =
    mockProducts.find((p) => p.id === productId) || mockProducts[0]!;

  const vendor: Vendor =
    mockVendors.find((v) => v.name === product.vendorName) || mockVendors[0]!;

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-mono">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold truncate">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-card border border-border p-6 sm:p-10 rounded-3xl shadow-xl">
          {/* Left Column: Visual Showcase */}
          <div className="space-y-4">
            <div className="relative w-full h-[400px] rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center text-9xl shadow-inner overflow-hidden">
              <span className="animate-pulse">{product.image}</span>
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white font-mono shadow-md">
                  {product.tag}
                </span>
              )}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all ${
                  isWishlisted ? "bg-rose-500 text-white border-rose-500" : "bg-background/80 border-border text-muted-foreground"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Micro badges */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-border">
                <Truck className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <span className="font-semibold block">Free Delivery</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-border">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                <span className="font-semibold block">1 Yr Warranty</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-border">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                <span className="font-semibold block">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-xs">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-muted-foreground font-normal">({product.reviewCount} verified reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Vendor Info Box */}
              <div className="mt-3 inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border text-xs">
                <Store className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground">Sold by:</span>
                <Link href={`/stores/${vendor.slug}`} className="font-bold text-foreground hover:underline">
                  {product.vendorName || vendor.name}
                </Link>
                {vendor.verified && (
                  <span className="ml-1 text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono">
                    VERIFIED
                  </span>
                )}
              </div>

              {/* Price Tag */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-black text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-muted-foreground line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  In Stock & Ready to Ship
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Product Features checklist */}
              {product.features && (
                <div className="mt-6 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                    Key Highlights:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-muted-foreground uppercase font-mono">
                  Quantity:
                </label>
                <div className="flex items-center border border-border rounded-xl bg-background overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-extrabold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full sm:flex-1 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                    addedToCart
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01]"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4" /> Added To Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add To Shopping Cart
                    </>
                  )}
                </button>
                <Link
                  href="/checkout"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-foreground text-background font-black text-sm text-center hover:opacity-90 transition-opacity"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
