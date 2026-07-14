"use client";

import React from "react"
import Link from "next/link"
import { useGetMeQuery, useGetSellerMeQuery } from "@workspace/store"
import {
  Users,
  Wallet,
  Percent,
  PhoneCall,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react"

export default function RootPage() {
  const { data: userData, isLoading: userLoading } = useGetMeQuery()
  const { data: sellerData, isLoading: sellerLoading } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  })

  const isLoading = userLoading || (userData?.user && sellerLoading)

  const renderCTA = () => {
    if (isLoading) {
      return (
        <div className="flex h-11 items-center justify-center rounded-xl bg-zinc-900/5 px-6 text-sm font-semibold text-zinc-500 w-fit">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-600" /> Connecting to your profile...
        </div>
      )
    }

    if (userData?.user) {
      const seller = sellerData?.seller
      if (!seller) {
        return (
          <Link
            href="/seller/onboard"
            className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
          >
            Start Selling / Onboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )
      }

      if (seller.status === "APPROVED") {
        return (
          <Link
            href="/seller/dashboard"
            className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            Go to Seller Dashboard
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )
      }

      return (
        <Link
          href="/seller/dashboard"
          className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-8 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-zinc-800 hover:-translate-y-0.5"
        >
          Check Application Status ({seller.status})
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )
    }

    return (
      <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
        <Link
          href="/seller/register"
          className="group flex h-12 items-center justify-center gap-2 rounded-sm bg-[#FFE11B] px-8 text-xs font-bold uppercase tracking-wider text-zinc-900 shadow-sm transition-all hover:bg-[#F2D000]"
        >
          Register as Seller
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/seller/login"
          className="flex h-12 items-center justify-center rounded-sm border border-zinc-250 bg-white px-8 text-xs font-bold uppercase tracking-wider text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-350"
        >
          Log In to Seller Portal
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full bg-white flex flex-col">
      {/* Breadcrumb Section */}
      <div className="w-full border-b border-zinc-100/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <span className="text-zinc-300 font-normal text-xs">&gt;</span>
          <span className="text-zinc-600">Sell Online</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-zinc-50 via-zinc-100 to-indigo-50/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.1] max-w-xl">
              Sell Online with <span className="text-indigo-600">CBS Marketplace</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-lg leading-relaxed font-medium">
              Create your seller account today and start reaching millions of customers. Onboard in minutes with minimal documentation, secure weekly payments, and dedicated support.
            </p>
            <div className="pt-2">{renderCTA()}</div>
          </div>

          {/* Hero Right */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-zinc-200">
              <img
                src="/seller_hub_hero.png"
                alt="CBS Seller Partners"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Card */}
      <div className="w-full max-w-7xl mx-auto px-6 -mt-10 relative z-10 mb-16">
        <div className="bg-white rounded-xl border border-zinc-150 shadow-xl py-8 px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-zinc-100">
          {/* Benefit 1 */}
          <div className="flex flex-col items-center text-center px-4 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide leading-tight">
                45 crore+ customers
              </span>
              <span className="text-[11px] font-medium text-zinc-400">
                Reach buyers across all pincodes
              </span>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col items-center text-center px-4 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide leading-tight">
                7* days payouts
              </span>
              <span className="text-[11px] font-medium text-zinc-400">
                Secure & regular bank transfers
              </span>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col items-center text-center px-4 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Percent className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide leading-tight">
                Low cost setup
              </span>
              <span className="text-[11px] font-medium text-zinc-400">
                No hidden setup or listing fees
              </span>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="flex flex-col items-center text-center px-4 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide leading-tight">
                One-click support
              </span>
              <span className="text-[11px] font-medium text-zinc-400">
                Dedicated 24/7 seller assistance
              </span>
            </div>
          </div>

          {/* Benefit 5 */}
          <div className="flex flex-col items-center text-center px-4 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wide leading-tight">
                Dhamaka Days access
              </span>
              <span className="text-[11px] font-medium text-zinc-400">
                Maximize sales during major events
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}