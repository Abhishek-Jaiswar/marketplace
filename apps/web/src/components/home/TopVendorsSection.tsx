"use client";

import React from "react";
import Link from "next/link";
import { Store, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { mockVendors, Vendor } from "../../utils/mockData";

export function TopVendorsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Store className="w-3.5 h-3.5" />
            Verified Multi-Vendor Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Featured Marketplace Vendors
          </h2>
        </div>
        <Link
          href="/stores"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline group"
        >
          Explore All Vendors
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockVendors.map((vendor: Vendor) => (
          <div
            key={vendor.id}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 group"
          >
            <div>
              {/* Vendor Banner Header */}
              <div
                className={`w-full h-20 rounded-xl bg-gradient-to-r ${vendor.bannerGradient} relative p-3 flex items-start justify-between text-white mb-8`}
              >
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/30 backdrop-blur-md border border-white/20 uppercase font-mono">
                  {vendor.category}
                </span>

                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm font-mono">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED
                  </span>
                )}

                {/* Avatar Badge overlapping banner */}
                <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-2xl bg-card border-2 border-border shadow-lg flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                  {vendor.logo}
                </div>
              </div>

              {/* Info */}
              <div className="pt-1">
                <h3 className="text-base font-extrabold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {vendor.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                  {vendor.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 my-4 py-3 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono block">
                      Rating
                    </span>
                    <span className="font-extrabold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {vendor.rating} ({vendor.reviewCount})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground font-mono block">
                      Products
                    </span>
                    <span className="font-extrabold text-foreground">
                      {vendor.productCount} Items
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/stores/${vendor.slug}`}
              className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-bold text-center hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              Visit Store Front
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopVendorsSection;
