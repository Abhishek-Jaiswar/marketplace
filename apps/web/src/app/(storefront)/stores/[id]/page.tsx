"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, ShieldCheck, Store, ChevronRight, Search, ShoppingCart, Heart, Calendar } from "lucide-react";
import { mockVendors, mockProducts, Vendor, Product } from "../../../../utils/mockData";

export default function VendorStorePage() {
  const params = useParams();
  const storeSlug = (params?.id as string) || "apex-electronics";

  const vendor: Vendor =
    mockVendors.find((v) => v.slug === storeSlug) || mockVendors[0]!;

  const vendorProducts: Product[] = mockProducts.filter(
    (p) => p.vendorName === vendor.name || p.vendorId === vendor.id
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [, setCart] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id]);
  };

  const filteredProducts = vendorProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-mono">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-muted-foreground">Stores</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold">{vendor.name}</span>
        </nav>

        {/* Store Banner & Header Card */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl mb-10">
          <div
            className={`w-full h-48 bg-gradient-to-r ${vendor.bannerGradient} relative p-6 flex items-start justify-between text-white`}
          >
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md uppercase tracking-wider font-mono border border-white/20">
              {vendor.category}
            </span>
            {vendor.verified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white font-mono shadow-md">
                <ShieldCheck className="w-4 h-4" /> VERIFIED MERCHANT
              </span>
            )}
          </div>

          <div className="p-6 sm:p-8 pt-0 relative">
            {/* Logo Avatar */}
            <div className="-mt-14 w-24 h-24 rounded-2xl bg-card border-4 border-border shadow-2xl flex items-center justify-center text-5xl mb-4">
              {vendor.logo}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">
                  {vendor.name}
                </h1>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                  {vendor.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    {vendor.rating} ({vendor.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {vendor.joinDate}
                  </span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-900/60 p-4 rounded-2xl border border-border">
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono block">
                    Products
                  </span>
                  <span className="text-lg font-black text-foreground">{vendor.productCount}</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center px-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono block">
                    Seller Score
                  </span>
                  <span className="text-lg font-black text-emerald-500">99.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Catalog Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Products from {vendor.name}
            </h2>

            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search inside ${vendor.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-2xl">
              <p className="text-sm font-bold text-foreground">No items match your search inside this store.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: Product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all group"
                  >
                    <div>
                      <div className="relative w-full h-44 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-6xl mb-3 overflow-hidden">
                        <span className="group-hover:scale-110 transition-transform">
                          {product.image}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                            isWishlisted ? "bg-rose-500 text-white" : "bg-background/80 text-muted-foreground"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                        </button>
                      </div>

                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-bold text-foreground block line-clamp-1 hover:text-blue-500 transition-colors"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-base font-extrabold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
