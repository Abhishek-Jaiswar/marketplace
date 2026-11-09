"use client"
import { brand } from "@workspace/ui/lib/brand"

import React from "react"
import Link from "next/link"
import {
  Store,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export function SellerCtaBanner() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 p-8 shadow-2xl sm:p-12">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-blue-300 uppercase">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Vendor Growth Engine
            </span>
            <h2 className="text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl">
              Start Selling On {brand.marketplaceName} & Scale Your Brand
              Nationwide
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300">
              Join thousands of verified independent merchants. Enjoy low
              commission rates, automated payouts, real-time analytics, and
              instant exposure to active buyers.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero Setup Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span>Automated Payouts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <Store className="h-4 w-4 text-amber-400" />
                <span>Dedicated Seller Portal</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/register?role=seller"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-zinc-950 shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-zinc-100 sm:w-auto"
            >
              Open Seller Store
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={
                process.env.NEXT_PUBLIC_SELLER_CENTRAL_URL ||
                "http://localhost:3001"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-blue-500/20 sm:w-auto"
            >
              Seller Central Portal
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SellerCtaBanner
