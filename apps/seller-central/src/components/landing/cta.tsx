import { brand } from "@workspace/ui/lib/brand"
import React from "react"
import { ArrowRight } from "lucide-react"

interface CTAProps {
  handleStartSelling: () => void
}

export default function CTA({ handleStartSelling }: CTAProps) {
  return (
    <section
      id="benefits"
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-8 py-16 text-left"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Stats Section */}
        <div className="border-zinc-150/70 grid grid-cols-1 items-center gap-6 rounded-[24px] border bg-white p-6.5 shadow-sm sm:grid-cols-4 lg:col-span-7">
          {/* Avatars Promo */}
          <div className="flex flex-col gap-2">
            <div className="flex -space-x-2.5 overflow-hidden">
              {[
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop",
              ].map((src, idx) => (
                <img
                  key={idx}
                  className="inline-block h-7 w-7 rounded-full object-cover ring-2 ring-white"
                  src={src}
                  alt="Seller avatar"
                />
              ))}
              <div className="text-indigo-650 inline-flex h-7 w-7 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-[8px] font-extrabold ring-2 ring-white">
                +50K
              </div>
            </div>
            <span className="block text-[10px] leading-none font-bold text-zinc-400">
              ...and growing every day!
            </span>
          </div>

          {/* Active Sellers Stat */}
          <div className="flex flex-col gap-1 text-left sm:border-l sm:border-zinc-100 sm:pl-4">
            <span className="text-xl font-black text-zinc-900">10L+</span>
            <span className="block text-[10px] leading-none font-bold tracking-wide text-zinc-400 uppercase">
              Active Sellers
            </span>
          </div>

          {/* Products Sold Stat */}
          <div className="flex flex-col gap-1 text-left sm:border-l sm:border-zinc-100 sm:pl-4">
            <span className="text-xl font-black text-zinc-900">15Cr+</span>
            <span className="block text-[10px] leading-none font-bold tracking-wide text-zinc-400 uppercase">
              Products Sold
            </span>
          </div>

          {/* Rating Stat */}
          <div className="flex flex-col gap-1 text-left sm:border-l sm:border-zinc-100 sm:pl-4">
            <span className="text-xl font-black text-zinc-900">4.8 ★</span>
            <span className="block text-[10px] leading-none font-bold tracking-wide text-zinc-400 uppercase">
              Seller Rating
            </span>
          </div>
        </div>

        {/* Right Purple CTA Card Banner */}
        <div className="flex flex-col items-center justify-between gap-6 rounded-[24px] bg-indigo-600 p-6.5 text-white shadow-md sm:flex-row lg:col-span-5">
          <div className="flex max-w-[65%] flex-col gap-2 text-left">
            <h4 className="text-sm leading-snug font-extrabold">
              Ready to grow your business?
            </h4>
            <p className="text-[10px] leading-normal font-bold text-indigo-100">
              Join {brand.name} and start your selling journey today.
            </p>
          </div>
          <button
            onClick={handleStartSelling}
            className="flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-1 rounded-xl bg-white px-5 text-sm font-bold whitespace-nowrap text-indigo-600 shadow-md transition-colors hover:bg-zinc-50 sm:w-auto"
          >
            <span>Start Selling Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  )
}
