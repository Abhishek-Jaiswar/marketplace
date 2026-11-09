"use client"

import React from "react"
import Link from "next/link"
import { Store, Star, ShieldCheck, ArrowRight } from "lucide-react"
import { mockVendors, Vendor } from "../../utils/mockData"

export function TopVendorsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
            <Store className="h-3.5 w-3.5" />
            Verified Multi-Vendor Ecosystem
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Featured Marketplace Vendors
          </h2>
        </div>
        <Link
          href="/stores"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline sm:text-sm dark:text-emerald-400"
        >
          Explore All Vendors
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockVendors.map((vendor: Vendor) => (
          <div
            key={vendor.id}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl"
          >
            <div>
              {/* Vendor Banner Header */}
              <div
                className={`h-20 w-full rounded-xl bg-gradient-to-r ${vendor.bannerGradient} relative mb-8 flex items-start justify-between p-3 text-white`}
              >
                <span className="rounded-full border border-white/20 bg-black/30 px-2 py-0.5 font-mono text-[10px] font-bold uppercase backdrop-blur-md">
                  {vendor.category}
                </span>

                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm">
                    <ShieldCheck className="h-3 w-3" />
                    VERIFIED
                  </span>
                )}

                {/* Avatar Badge overlapping banner */}
                <div className="absolute -bottom-6 left-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-card text-3xl shadow-lg transition-transform group-hover:scale-105">
                  {vendor.logo}
                </div>
              </div>

              {/* Info */}
              <div className="pt-1">
                <h3 className="text-base font-extrabold text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {vendor.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {vendor.description}
                </p>

                {/* Metrics */}
                <div className="my-4 grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 px-3 py-3 text-xs dark:bg-zinc-900/60">
                  <div>
                    <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
                      Rating
                    </span>
                    <span className="flex items-center gap-1 font-extrabold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      {vendor.rating} ({vendor.reviewCount})
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-bold text-muted-foreground uppercase">
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-center text-xs font-bold text-secondary-foreground transition-colors hover:bg-emerald-600 hover:text-white"
            >
              Visit Store Front
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TopVendorsSection
