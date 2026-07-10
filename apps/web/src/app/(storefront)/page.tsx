"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowRight, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mockCategories,
  mockHeroBanners,
  mockProducts,
  Category,
  Product,
} from "../../utils/mockData";

export default function StorefrontPage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [, setCart] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  // Carousel Banner Auto-cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % mockHeroBanners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id]);
  };

  const filteredProducts = selectedCategory === "All"
    ? mockProducts
    : mockProducts.filter((p: Product) => p.category === selectedCategory);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  const currentBanner = mockHeroBanners[activeBanner] || {
    id: "fallback",
    title: "Welcome to CBS Market",
    subtitle: "Find the best deals on everything you need.",
    buttonText: "Browse Shop",
    link: "/",
    bgGradient: "from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900",
    tag: "MARKETPLACE",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-200">
      {/* 1. HERO SECTION (Carousel) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 overflow-hidden">
        <div className="relative h-[480px] w-full rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 bg-gradient-to-br ${currentBanner.bgGradient} flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8`}
            >
              {/* Left Column: Context & Typography */}
              <div className="flex-1 space-y-6 text-left max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 uppercase tracking-widest font-mono">
                  {currentBanner.tag}
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                  {currentBanner.title}
                </h1>
                <p className="text-sm md:text-md text-muted-foreground leading-relaxed">
                  {currentBanner.subtitle}
                </p>
                <div className="pt-2">
                  <Link
                    href={currentBanner.link}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-semibold text-sm transition-all shadow-lg active:scale-95 group cursor-pointer"
                  >
                    <span>{currentBanner.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Product representation */}
              <div className="hidden md:flex flex-1 justify-center items-center relative">
                <div className="absolute w-72 h-72 rounded-full bg-zinc-500/5 blur-[60px]" />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-56 h-56 rounded-3xl bg-background/30 backdrop-blur-xl border border-border shadow-2xl flex items-center justify-center text-7xl select-none"
                >
                  {activeBanner === 0 ? "🎧" : activeBanner === 1 ? "⌨️" : "👕"}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-25">
            {mockHeroBanners.map((_, index: number) => (
              <button
                key={index}
                onClick={() => setActiveBanner(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeBanner === index ? "w-8 bg-zinc-900 dark:bg-zinc-100" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPS STRIP */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-card border border-border rounded-2xl shadow-xl transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">Free Delivery</p>
              <p className="text-[10px] text-muted-foreground">On all orders over $99</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">30-Day Returns</p>
              <p className="text-[10px] text-muted-foreground">Easy returns policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">Secure Payment</p>
              <p className="text-[10px] text-muted-foreground">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
              <Star className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">Top Rated Products</p>
              <p className="text-[10px] text-muted-foreground">Highly rated by users</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-black text-foreground">Shop by Category</h2>
            <p className="text-xs text-muted-foreground">Browse our wide selection of items</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockCategories.map((cat: Category) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-6 rounded-2xl border text-center transition-all duration-300 group cursor-pointer relative overflow-hidden ${
                selectedCategory === cat.name
                  ? "bg-zinc-500/10 border-zinc-500/40 shadow-lg scale-[1.02]"
                  : "bg-card border-border hover:border-border/80 hover:bg-muted/30"
              }`}
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {cat.image}
              </div>
              <p className="text-xs font-bold text-foreground truncate">{cat.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{cat.itemCount} items</p>
            </button>
          ))}
        </div>
      </section>

      {/* 4. TODAY'S DEALS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
          <div className="text-left flex items-center gap-2">
            <Flame className="w-5.5 h-5.5 text-zinc-500" />
            <div>
              <h2 className="text-xl md:text-2xl font-black text-foreground">Deals of the Day</h2>
              <p className="text-xs text-muted-foreground">Limited time offers. Grab them before they expire!</p>
            </div>
          </div>
          {/* Countdown timer */}
          <div className="flex items-center gap-1.5 bg-zinc-500/10 text-zinc-800 dark:text-zinc-200 px-3.5 py-1.5 rounded-xl border border-border font-mono text-xs font-bold shadow-sm">
            <span>Deals end in:</span>
            <span className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-1.5 py-0.5 rounded font-extrabold">{formatNumber(timeLeft.hours)}</span>
            <span>:</span>
            <span className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-1.5 py-0.5 rounded font-extrabold">{formatNumber(timeLeft.minutes)}</span>
            <span>:</span>
            <span className="bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-1.5 py-0.5 rounded font-extrabold animate-pulse">{formatNumber(timeLeft.seconds)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts
            .filter((p: Product) => p.originalPrice)
            .slice(0, 3)
            .map((prod: Product) => (
              <div
                key={prod.id}
                className="bg-card border border-border hover:border-border/80 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Wishlist & Badge Row */}
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[9px] font-black tracking-wider uppercase rounded-full">
                    {prod.tag}
                  </span>
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="w-8 h-8 rounded-full bg-muted/40 hover:bg-muted border border-border/50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4.5 h-4.5 ${
                        wishlist.includes(prod.id)
                          ? "fill-foreground text-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Emoji Photo Visual */}
                <div className="w-full h-40 bg-muted/30 rounded-2xl flex items-center justify-center text-6xl select-none mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                  {prod.image}
                </div>

                {/* Info Block */}
                <div className="text-left space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-mono">
                    {prod.category}
                  </p>
                  <h4 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-muted-foreground transition-colors">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Pricing & Cart Action Block */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-md font-extrabold text-foreground">${prod.price}</span>
                      <span className="text-xs text-muted-foreground line-through">${prod.originalPrice}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-foreground">{prod.rating}</span>
                      <span className="text-[9px] text-muted-foreground font-mono">({prod.reviewCount})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(prod.id)}
                    className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 5. EXPLORE ALL PRODUCTS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border">
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-black text-foreground">Explore Products</h2>
            <p className="text-xs text-muted-foreground">Select a category below to filter products</p>
          </div>
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "Electronics", "Fashion & Apparel", "Home & Kitchen", "Sports & Outdoors"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 border-transparent"
                    : "bg-card border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((prod: Product) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border hover:border-border/80 rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Wishlist Icon */}
                <div className="absolute top-3 right-3 z-20">
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="w-7 h-7 rounded-full bg-muted/40 hover:bg-muted border border-border/50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(prod.id)
                          ? "fill-foreground text-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>

                {/* Badge if present */}
                {prod.tag && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-border text-[9px] font-bold rounded-full font-mono">
                    {prod.tag}
                  </span>
                )}

                {/* Product Emoji Visual */}
                <div className="w-full h-36 bg-muted/30 rounded-2xl flex items-center justify-center text-5xl select-none mb-3 group-hover:scale-[1.02] transition-transform duration-300">
                  {prod.image}
                </div>

                {/* Info block */}
                <div className="text-left space-y-1">
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider font-mono">
                    {prod.category}
                  </p>
                  <h4 className="font-bold text-foreground text-xs line-clamp-1 group-hover:text-muted-foreground transition-colors">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="text-left">
                    <span className="text-sm font-extrabold text-foreground">${prod.price}</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[9px] font-bold text-foreground">{prod.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(prod.id)}
                    className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-850 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
export const dynamic = "force-dynamic";
