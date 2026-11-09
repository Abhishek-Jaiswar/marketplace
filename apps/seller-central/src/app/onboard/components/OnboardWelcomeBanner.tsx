import React from "react"
import {
  ShieldCheck,
  Building2,
  Landmark,
  Rocket,
  ArrowRight,
  X,
} from "lucide-react"
import Logo from "@/components/logo"

interface OnboardWelcomeBannerProps {
  onStart: () => void
  onCancel: () => void
}

export const OnboardWelcomeBanner: React.FC<OnboardWelcomeBannerProps> = ({
  onStart,
  onCancel,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-zinc-900 select-none">
      {/* Minimal Header */}
      <header className="flex w-full items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-4">
        <Logo iconSize={26} subtitle="Seller Onboarding" />
        <button
          onClick={onCancel}
          className="flex cursor-pointer items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-800"
        >
          <X className="h-4 w-4" /> Cancel & Exit
        </button>
      </header>

      {/* Welcome Hero Container */}
      <main className="animate-fadeIn mx-auto my-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center space-y-8 p-6 text-center sm:p-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1 text-xs font-extrabold text-indigo-700">
            <ShieldCheck className="h-4 w-4" /> Amazon-Style Seller Setup
          </div>
          <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Welcome to CBS Marketplace Seller Hub
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed font-medium text-zinc-500">
            Set up your merchant account in a few simple, distraction-free
            steps. Here is what you will need to get started:
          </p>
        </div>

        {/* Checklist Highlights */}
        <div className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-extrabold text-zinc-900">
              1. Business & GSTIN
            </h3>
            <p className="text-[11px] font-medium text-zinc-500">
              15-digit GSTIN number & digital signature proof.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 font-bold text-purple-600">
              <Landmark className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-extrabold text-zinc-900">
              2. Bank Settlement
            </h3>
            <p className="text-[11px] font-medium text-zinc-500">
              Account number & IFSC code for direct payouts.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-extrabold text-zinc-900">
              3. Storefront Setup
            </h3>
            <p className="text-[11px] font-medium text-zinc-500">
              Store name & courier pickup logistics location.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex w-full flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <button
            onClick={onCancel}
            className="h-12 w-full cursor-pointer rounded-xl border border-zinc-200 px-8 text-xs font-extrabold text-zinc-600 transition-all hover:bg-zinc-100 sm:w-auto"
          >
            Cancel & Exit
          </button>

          <button
            onClick={onStart}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-10 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:bg-indigo-800 sm:w-auto"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}
