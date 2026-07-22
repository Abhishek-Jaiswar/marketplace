"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { mockFlashDeals, FlashDeal } from "../../utils/mockData";

interface FlashDealsSectionProps {
  onAddToCart?: (productId: string) => void;
}

export function FlashDealsSection({ onAddToCart }: FlashDealsSectionProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 15 });

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
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-rose-950/40 via-red-950/20 to-zinc-950 border border-rose-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow decorative effect */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-rose-500/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 font-mono">
                  Limited Time Offers
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Flash Deals Of The Day
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-300 mr-2 uppercase tracking-wide">
              Ends In:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-white">
              <div className="bg-rose-900/60 border border-rose-500/30 px-3 py-1.5 rounded-xl shadow-inner">
                {formatNumber(timeLeft.hours)}h
              </div>
              <span className="text-rose-400">:</span>
              <div className="bg-rose-900/60 border border-rose-500/30 px-3 py-1.5 rounded-xl shadow-inner">
                {formatNumber(timeLeft.minutes)}m
              </div>
              <span className="text-rose-400">:</span>
              <div className="bg-rose-900/60 border border-rose-500/30 px-3 py-1.5 rounded-xl shadow-inner">
                {formatNumber(timeLeft.seconds)}s
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {mockFlashDeals.map((deal: FlashDeal) => {
            const product = deal.product;
            const percentSold = Math.round((deal.soldCount / deal.totalStock) * 100);

            return (
              <div
                key={deal.id}
                className="bg-card/90 border border-border/80 rounded-2xl p-4 flex flex-col justify-between hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="relative w-full h-44 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-6xl mb-4 overflow-hidden">
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {product.image}
                    </span>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-md font-mono">
                      -{deal.discountPercentage}%
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                    {product.vendorName || "Verified Vendor"}
                  </span>
                  <h3 className="text-sm font-bold text-foreground line-clamp-1 mt-0.5 group-hover:text-rose-500 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-black text-rose-500">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through font-mono">
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
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-bold text-center hover:bg-secondary/80 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => onAddToCart && onAddToCart(product.id)}
                    className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FlashDealsSection;
