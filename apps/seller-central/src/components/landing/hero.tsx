import { brand } from "@workspace/ui/lib/brand"
import React from "react"
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Headset,
  Play,
  ArrowRight,
  Sparkles,
} from "lucide-react"

interface HeroProps {
  handleStartSelling: () => void
}

export default function Hero({ handleStartSelling }: HeroProps) {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 py-16 lg:grid-cols-12">
      {/* Left Column */}
      <div className="flex flex-col gap-6 text-left lg:col-span-5">
        {/* Star Trust Badge */}
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-bold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5 fill-indigo-600 stroke-none" />
          <span>Trusted by 1L+ Sellers Across India</span>
        </div>

        {/* Heading */}
        <h1 className="lg:text-6.5xl text-4xl leading-[1.08] font-black tracking-tight text-zinc-900 md:text-5xl">
          Grow Your Business with{" "}
          <span className="font-black text-indigo-600">{brand.name}</span>
        </h1>

        <p className="max-w-lg text-sm leading-relaxed font-semibold text-zinc-500 md:text-base">
          Reach crores of customers, manage your business easily and boost your
          sales with India&apos;s trusted marketplace.
        </p>

        {/* Features Row */}
        <div className="flex max-w-lg flex-row items-start justify-between gap-4 pt-4 pb-2">
          <div className="flex flex-col gap-2.5">
            <Users className="h-6 w-6 text-indigo-600" />
            <span className="text-xs leading-tight font-bold text-zinc-800">
              Crores of
              <br />
              Customers
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="text-xs leading-tight font-bold text-zinc-800">
              Secure &<br />
              Trusted
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <span className="text-xs leading-tight font-bold text-zinc-800">
              Powerful
              <br />
              Insights
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <Headset className="h-6 w-6 text-indigo-600" />
            <span className="text-xs leading-tight font-bold text-zinc-800">
              24/7 Seller
              <br />
              Support
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col items-center gap-6 pt-4 sm:flex-row">
          <button
            onClick={handleStartSelling}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-500/15 transition-all select-none hover:bg-indigo-700 sm:w-auto"
          >
            <span>Start Selling Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold text-indigo-600 transition-colors select-none hover:text-indigo-700 sm:w-auto">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50/50">
              <Play className="ml-0.5 h-3.5 w-3.5 fill-indigo-600 stroke-none" />
            </span>
            <span>Watch How It Works</span>
          </button>
        </div>

        {/* Mini checklist bullets */}
        <div className="mt-2 flex items-center gap-4 px-1 text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-extrabold text-emerald-600">
              ✓
            </span>
            <span>Free to join</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-extrabold text-emerald-600">
              ✓
            </span>
            <span>Easy onboarding</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-extrabold text-emerald-600">
              ✓
            </span>
            <span>No hidden charges</span>
          </span>
        </div>
      </div>

      {/* Right Column: Mock Dashboard Image */}
      <div className="flex w-full items-center justify-center lg:col-span-7 lg:justify-end">
        <div className="border-zinc-150/70 w-full max-w-[620px] scale-95 overflow-hidden rounded-[28px] border bg-white shadow-2xl md:scale-100">
          <img
            src="/dashboard-mockup.png"
            alt={`${brand.name} Seller Dashboard Mockup`}
            className="block h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}
