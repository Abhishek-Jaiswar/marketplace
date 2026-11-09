"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Flame, ShoppingCart } from "lucide-react"
import { mockFlashDeals, FlashDeal } from "../../utils/mockData"

interface FlashDealsSectionProps {
  onAddToCart?: (productId: string) => void
}

export function FlashDealsSection({ onAddToCart }: FlashDealsSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 15,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 24, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => String(num).padStart(2, "0")

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/40 via-red-950/20 to-zinc-950 p-6 shadow-2xl sm:p-10">
        {/* Background glow decorative effect */}
        <div className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />

        {/* Section Header with Countdown */}
        <div className="relative z-10 mb-8 flex flex-col justify-between gap-6 border-b border-rose-500/20 pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="animate-pulse rounded-2xl border border-rose-500/30 bg-rose-500/20 p-3 text-rose-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black tracking-wider text-rose-400 uppercase">
                  Limited Time Offers
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Flash Deals Of The Day
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs font-semibold tracking-wide text-rose-300 uppercase">
              Ends In:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-white">
              <div className="rounded-xl border border-rose-500/30 bg-rose-900/60 px-3 py-1.5 shadow-inner">
                {formatNumber(timeLeft.hours)}h
              </div>
              <span className="text-rose-400">:</span>
              <div className="rounded-xl border border-rose-500/30 bg-rose-900/60 px-3 py-1.5 shadow-inner">
                {formatNumber(timeLeft.minutes)}m
              </div>
              <span className="text-rose-400">:</span>
              <div className="rounded-xl border border-rose-500/30 bg-rose-900/60 px-3 py-1.5 shadow-inner">
                {formatNumber(timeLeft.seconds)}s
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Cards */}
        <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockFlashDeals.map((deal: FlashDeal) => {
            const product = deal.product
            const percentSold = Math.round(
              (deal.soldCount / deal.totalStock) * 100
            )

            return (
              <div
                key={deal.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/90 p-4 transition-all duration-300 hover:border-rose-500/50 hover:shadow-xl"
              >
                <div>
                  <div className="relative mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-100 text-6xl dark:bg-zinc-900">
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      {product.image}
                    </span>
                    <span className="absolute top-3 left-3 rounded-full bg-rose-600 px-2.5 py-1 font-mono text-[11px] font-black text-white shadow-md">
                      -{deal.discountPercentage}%
                    </span>
                  </div>

                  <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    {product.vendorName || "Verified Vendor"}
                  </span>
                  <h3 className="mt-0.5 line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-rose-500">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-black text-rose-500">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-mono text-xs text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                      <span>Sold: {deal.soldCount}</span>
                      <span>Stock: {deal.totalStock}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 rounded-xl bg-secondary py-2.5 text-center text-xs font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => onAddToCart && onAddToCart(product.id)}
                    className="rounded-xl bg-rose-600 p-2.5 text-white transition-colors hover:bg-rose-700"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FlashDealsSection
