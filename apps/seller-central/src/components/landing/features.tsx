import React from "react"
import {
  ListPlus,
  PackageCheck,
  BarChart4,
  Wallet2,
  Megaphone,
  Headset,
} from "lucide-react"

export default function Features() {
  return (
    <section
      id="features"
      className="w-full border-y border-zinc-100 bg-[#f9fafb]/50 px-8 py-16"
    >
      <div className="mx-auto max-w-7xl space-y-10 text-center">
        {/* Headings */}
        <div className="mx-auto max-w-xl space-y-2.5">
          <h2 className="text-2xl leading-none font-black tracking-tight text-zinc-900 md:text-3xl">
            Everything You Need to Succeed
          </h2>
          <p className="text-xs leading-normal font-bold text-zinc-400">
            Powerful tools and features to help you manage, grow and scale your
            business effortlessly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 text-left md:grid-cols-2 lg:grid-cols-6">
          {/* Card 1 */}
          <div className="border-zinc-150/60 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
              <ListPlus className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">Easy Listing</h4>
              <p className="text-[10px] font-semibold text-zinc-400">
                Create and manage product listings in just a few clicks.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border-zinc-150/60 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600">
              <PackageCheck className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Order Management
              </h4>
              <p className="text-[10px] font-semibold text-zinc-400">
                Track, pack and ship orders seamlessly from one place.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border-zinc-150/60 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-600">
              <BarChart4 className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Business Insights
              </h4>
              <p className="text-[10px] font-semibold text-zinc-400">
                Get real-time insights and analytics to grow smarter.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="border-zinc-150/60 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-600">
              <Wallet2 className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Secure Payments
              </h4>
              <p className="text-[10px] font-semibold text-zinc-400">
                Receive payments directly in your bank account.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="border-zinc-150/60 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
            <div className="text-pink-650 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10">
              <Megaphone className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Marketing Tools
              </h4>
              <p className="text-[10px] font-semibold text-zinc-400">
                Boost your visibility with ads, offers and promotions.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="border-zinc-150/60 flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
              <Headset className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Seller Support
              </h4>
              <p className="text-[10px] font-semibold text-zinc-400">
                24/7 dedicated support whenever you need help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
