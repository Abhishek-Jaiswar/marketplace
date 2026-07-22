"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Star, ShoppingCart, Heart, ArrowUpDown, ChevronRight, SlidersHorizontal, RotateCcw } from "lucide-react";
import { mockProducts, mockCategories, mockVendors, Product } from "../../../utils/mockData";

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [, setCart] = useState<string[]>([]);

  // Sync state with URL search params (e.g. when coming from Navbar search)
  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    const catParam = searchParams.get("category") || "All";
    const vendorParam = searchParams.get("vendor") || "All";

    setSearchQuery(qParam);
    setSelectedCategory(catParam);
    setSelectedVendor(vendorParam);
  }, [searchParams]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id]);
  };

  // Filter logic
  let filtered = mockProducts.filter((p: Product) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesVendor =
      selectedVendor === "All" ||
      p.vendorName?.toLowerCase() === selectedVendor.toLowerCase();

    return matchesSearch && matchesCategory && matchesVendor;
  });

  // Sort logic
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-mono">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold">Search Catalog</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Marketplace Products"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Showing {filtered.length} products matching your query
            </p>
          </div>

          {/* Search bar inside page */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Refine search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6 bg-card border border-border p-6 rounded-2xl h-fit">
            <div className="flex items-center justify-between font-bold text-sm border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Refine Search</span>
              </div>
              {(searchQuery || selectedCategory !== "All" || selectedVendor !== "All") && (
                <button
                  onClick={() => { setSelectedCategory("All"); setSelectedVendor("All"); setSearchQuery(""); }}
                  className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedCategory === "All"
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  All Categories
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span>{cat.image} {cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Filter */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 font-mono">
                Store / Vendor
              </h3>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:border-primary"
              >
                <option value="All">All Vendors</option>
                {mockVendors.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Sorting bar */}
            <div className="flex items-center justify-between bg-card border border-border px-4 py-3 rounded-2xl text-xs">
              <span className="text-muted-foreground font-medium">
                Results: <strong className="text-foreground">{filtered.length}</strong> items found
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-background border border-border px-3 py-1.5 rounded-xl text-xs focus:outline-none font-medium"
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
              <div className="text-center py-16 bg-card border border-border rounded-2xl space-y-3">
                <p className="text-lg font-extrabold text-foreground">No matching products found.</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  We couldn&apos;t find any items matching &ldquo;{searchQuery}&rdquo;. Try checking for typos or searching for generic terms like &ldquo;headphones&rdquo; or &ldquo;keyboard&rdquo;.
                </p>
                <button
                  onClick={() => { setSelectedCategory("All"); setSelectedVendor("All"); setSearchQuery(""); }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md"
                >
                  Clear Search Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product: Product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-primary/40 hover:shadow-xl transition-all group"
                    >
                      <div>
                        <div className="relative w-full h-44 rounded-xl bg-muted/40 flex items-center justify-center text-6xl mb-3 overflow-hidden">
                          <span className="group-hover:scale-110 transition-transform">
                            {product.image}
                          </span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
                              isWishlisted ? "bg-accent text-white" : "bg-background/80 text-muted-foreground"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                          </button>
                        </div>

                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {product.vendorName || "Verified Store"}
                        </span>
                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm font-bold text-foreground block line-clamp-1 hover:text-primary transition-colors"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground font-normal">({product.reviewCount})</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-base font-extrabold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="p-2 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold transition-all shadow-md active:scale-95"
                          aria-label="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold">Loading marketplace catalog...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
