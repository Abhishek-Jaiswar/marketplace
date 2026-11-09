"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { mockHeroBanners, HeroBanner } from "../../utils/mockData"

export function HeroSection() {
  const [activeBanner, setActiveBanner] = useState(0)

  // Auto-cycling banners every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % mockHeroBanners.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const nextBanner = () =>
    setActiveBanner((prev) => (prev + 1) % mockHeroBanners.length)
  const prevBanner = () =>
    setActiveBanner(
      (prev) => (prev - 1 + mockHeroBanners.length) % mockHeroBanners.length
    )

  const currentBanner: HeroBanner =
    mockHeroBanners[activeBanner] || mockHeroBanners[0]!

  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl overflow-hidden px-4 pt-6 sm:px-6 lg:px-8">
      <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${currentBanner.bgGradient} flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-16`}
          >
            {/* Left Column: Context & Typography */}
            <div className="max-w-xl flex-1 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-amber-400" />
                {currentBanner.tag}
              </span>
              <h1 className="text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md md:text-5xl">
                {currentBanner.title}
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-zinc-300 md:text-base">
                {currentBanner.subtitle}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={currentBanner.link}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-zinc-100 hover:shadow-2xl active:scale-95"
                >
                  {currentBanner.buttonText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Explore All
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Product Emoji / Showcase Badge */}
            <div className="relative flex flex-1 items-center justify-center">
              <div className="relative flex h-64 w-64 animate-pulse items-center justify-center rounded-full border border-white/20 bg-white/10 text-7xl shadow-2xl backdrop-blur-xl md:h-80 md:w-80 md:text-9xl">
                {currentBanner.image || "📦"}
              </div>
              <div className="absolute right-4 bottom-4 rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                Verified Vendor Deal
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button
          onClick={prevBanner}
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full border border-white/20 bg-zinc-950/40 p-3 text-white backdrop-blur-md transition-all hover:bg-zinc-950/70"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full border border-white/20 bg-zinc-950/40 p-3 text-white backdrop-blur-md transition-all hover:bg-zinc-950/70"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
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
  )
}

export default HeroSection
