"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockHeroBanners, HeroBanner } from "../../utils/mockData";

export function HeroSection() {
  const [activeBanner, setActiveBanner] = useState(0);

  // Auto-cycling banners every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % mockHeroBanners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setActiveBanner((prev) => (prev + 1) % mockHeroBanners.length);
  const prevBanner = () =>
    setActiveBanner((prev) => (prev - 1 + mockHeroBanners.length) % mockHeroBanners.length);

  const currentBanner: HeroBanner = mockHeroBanners[activeBanner] || mockHeroBanners[0]!;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 overflow-hidden">
      <div className="relative h-[480px] w-full rounded-3xl overflow-hidden border border-border shadow-2xl bg-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${currentBanner.bgGradient} flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8`}
          >
            {/* Left Column: Context & Typography */}
            <div className="flex-1 space-y-6 text-left max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md text-white border border-white/20 uppercase tracking-widest font-mono">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentBanner.tag}
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {currentBanner.title}
              </h1>
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-lg">
                {currentBanner.subtitle}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={currentBanner.link}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 group"
                >
                  {currentBanner.buttonText}
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
                >
                  Explore All
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Product Emoji / Showcase Badge */}
            <div className="relative flex-1 flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center text-7xl md:text-9xl animate-pulse">
                {currentBanner.image || "📦"}
              </div>
              <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-medium">
                Verified Vendor Deal
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-950/40 hover:bg-zinc-950/70 border border-white/20 text-white transition-all backdrop-blur-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-950/40 hover:bg-zinc-950/70 border border-white/20 text-white transition-all backdrop-blur-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {mockHeroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBanner(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeBanner === idx
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
