"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetPublicStoreBySlugQuery } from "@workspace/store";
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
  Loader2,
  Building2,
} from "lucide-react";
import { mockProducts, Product } from "../../../../utils/mockData";

type StoreTab = "products" | "about" | "reviews" | "policies";

export default function StorefrontPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "cartoon-retailers-maharashtra-division";
  const slug = decodeURIComponent(rawSlug);

  const { data: apiData, isLoading: apiLoading } = useGetPublicStoreBySlugQuery(slug, {
    skip: !slug,
  });

  const store = apiData?.store;
  const seller = store?.seller;
  const address = store?.address;

  const [activeTab, setActiveTab] = useState<StoreTab>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [, setCart] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fallback store display data if store is still loading or mocked
  const displayName = store?.displayName || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const businessName = seller?.businessName || `${displayName} Pvt. Ltd.`;
  const locationText = address ? `${address.city}, ${address.state}` : "Maharashtra, India";
  const descriptionText = store?.description || `Welcome to ${displayName}! We are an official verified merchant providing high quality products with fast shipping and 100% customer satisfaction guaranteed.`;

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id]);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Filter products by search and category
  const filteredProducts = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...Array.from(new Set(mockProducts.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-background text-foreground py-6 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-muted-foreground">Stores</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-bold truncate">{displayName}</span>
        </nav>

        {/* HERO STORE HEADER CARD */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Cover Banner */}
          <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 relative p-6 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black/40 backdrop-blur-md border border-white/20 uppercase tracking-wider font-mono">
                Official Merchant Store
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white font-mono shadow-lg">
                <ShieldCheck className="w-4 h-4" /> GST VERIFIED
              </span>
            </div>

            {/* Subtitle preview */}
            <div className="hidden sm:block text-right text-xs text-indigo-200/80 font-mono">
              cbsmarketplace.com/store/{slug}
            </div>
          </div>

          {/* Store Info Container */}
          <div className="p-6 sm:p-8 pt-0 relative">
            {/* Logo Avatar */}
            <div className="-mt-16 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 border-4 border-card shadow-2xl flex items-center justify-center text-4xl font-extrabold text-white mb-4">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {displayName}
                  </h1>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    @{slug}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {descriptionText}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    4.8 (1,420 Ratings)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {locationText}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Member Since 2026
                  </span>
                </div>
              </div>

              {/* Action Buttons & Quick Stats */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFollowing
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isFollowing ? "Following Store" : "Follow Store"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Key Value Props Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border">
                <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Status</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">99.2% Positive</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border">
                <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Logistics</span>
                  <span className="text-xs font-extrabold text-foreground">Fast Dispatch</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border">
                <RotateCcw className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Returns</span>
                  <span className="text-xs font-extrabold text-foreground">7 Days Policy</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border">
                <Store className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block font-mono">Products</span>
                  <span className="text-xs font-extrabold text-foreground">{mockProducts.length}+ Listed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STORE NAVIGATION TABS */}
        <div className="flex border-b border-border space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "products"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Products ({mockProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "about"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>About Merchant & Verification</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "reviews"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Ratings & Reviews (1,420)</span>
          </button>

          <button
            onClick={() => setActiveTab("policies")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === "policies"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Policies & Returns</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={`Search inside ${displayName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-card border border-border rounded-2xl">
                <Store className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                <h3 className="text-sm font-bold text-foreground">No products match your search.</h3>
                <p className="text-xs text-muted-foreground mt-1">Try clearing filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product: Product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all group hover:border-indigo-500/30"
                    >
                      <div>
                        <div className="relative w-full h-44 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-6xl mb-3 overflow-hidden">
                          <span className="group-hover:scale-110 transition-transform">
                            {product.image}
                          </span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                              isWishlisted ? "bg-rose-500 text-white" : "bg-background/80 text-muted-foreground"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
                          </button>
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm font-bold text-foreground block line-clamp-1 hover:text-indigo-600 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-base font-black text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
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
        )}

        {/* TAB 2: ABOUT MERCHANT & VERIFICATION */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Registered Legal Business Information
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Legal Business Name</span>
                  <span className="font-bold text-foreground">{businessName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Entity Type</span>
                  <span className="font-bold text-foreground">{seller?.businessType || "Private Limited Company"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">GST Verification Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground font-medium">Operating Region</span>
                  <span className="font-bold text-foreground">{locationText}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Dispatch & Warehouse Address
              </h3>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border text-xs space-y-1">
                <p className="font-bold text-foreground">{displayName}</p>
                <p className="text-muted-foreground">{address?.street1 || "Central Industrial Logistics Zone"}</p>
                <p className="text-muted-foreground">{address?.city || "Mumbai"}, {address?.state || "Maharashtra"} - {address?.postalCode || "400001"}</p>
                <p className="text-muted-foreground">{address?.country || "India"}</p>
              </div>

              <div className="pt-2 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>Support Email: {seller?.contactEmail || "support@cbsmarketplace.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <span>Support Line: {seller?.contactPhone || "+91 9876543210"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RATINGS & REVIEWS */}
        {activeTab === "reviews" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-border">
              <div className="text-center sm:border-r border-border sm:pr-8">
                <span className="text-4xl font-black text-foreground block">4.8</span>
                <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">1,420 Buyer Ratings</span>
              </div>

              <div className="flex-1 space-y-2 w-full text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold">5 Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[88%]" />
                  </div>
                  <span className="w-8 text-right font-mono">88%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold">4 Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[8%]" />
                  </div>
                  <span className="w-8 text-right font-mono">8%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-12 font-bold">3 Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[3%]" />
                  </div>
                  <span className="w-8 text-right font-mono">3%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: POLICIES */}
        {activeTab === "policies" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <RotateCcw className="w-6 h-6 text-indigo-600" />
              <h3 className="font-extrabold text-sm">7-Day Hassle-Free Returns</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Products purchased from this store are eligible for 7-day easy returns if damaged or defective upon delivery.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <Truck className="w-6 h-6 text-indigo-600" />
              <h3 className="font-extrabold text-sm">Tracked Logistics Delivery</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Orders are dispatched via CBS Marketplace logistics partners with real-time tracking updates.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h3 className="font-extrabold text-sm">Buyer Protection Guarantee</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your payment is held securely in escrow until successful delivery confirmation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
