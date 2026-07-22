"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { mockProducts, Product } from "../../utils/mockData";

interface FeaturedProductsGridProps {
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  wishlist?: string[];
}

export function FeaturedProductsGrid({
  onAddToCart,
  onToggleWishlist,
  wishlist = [],
}: FeaturedProductsGridProps) {
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Electronics", "Fashion & Apparel", "Home & Kitchen", "Sports & Outdoors", "Beauty & Wellness"];

  const filteredProducts =
    activeTab === "All"
      ? mockProducts
      : mockProducts.filter((p: Product) => p.category === activeTab);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Handpicked Selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Featured Products
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === cat
                  ? "bg-foreground text-background shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-card/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => {
          const isWishlisted = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-400/50 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative w-full h-48 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-7xl mb-4 overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform duration-300">
                    {product.image}
                  </span>

                  {product.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-zinc-900/90 text-white border border-white/10 font-mono shadow-sm">
                      {product.tag}
                    </span>
                  )}

                  <button
                    onClick={() => onToggleWishlist && onToggleWishlist(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                      isWishlisted
                        ? "bg-rose-500 text-white"
                        : "bg-background/80 hover:bg-background text-muted-foreground hover:text-rose-500"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
                  </button>
                </div>

                {/* Vendor & Title */}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                  <span className="truncate">{product.vendorName || "Verified Vendor"}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-500" />
                    {product.rating}
                  </span>
                </div>

                <Link
                  href={`/products/${product.id}`}
                  className="text-sm font-bold text-foreground line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {product.name}
                </Link>

                <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Cart Actions */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through ml-2 font-mono">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => onAddToCart && onAddToCart(product.id)}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md active:scale-95"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-card border border-border text-foreground font-bold text-sm hover:border-zinc-400 dark:hover:border-zinc-700 shadow-md hover:shadow-xl transition-all"
        >
          Browse All Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default FeaturedProductsGrid;
