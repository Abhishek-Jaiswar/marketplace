import React from "react";
import {
  ListPlus,
  PackageCheck,
  BarChart4,
  Wallet2,
  Megaphone,
  Headset,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="w-full bg-[#f9fafb]/50 border-y border-zinc-100 py-16 px-8">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        {/* Headings */}
        <div className="space-y-2.5 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-none">
            Everything You Need to Succeed
          </h2>
          <p className="text-xs text-zinc-400 font-bold leading-normal">
            Powerful tools and features to help you manage, grow and scale your
            business effortlessly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 text-left">
          {/* Card 1 */}
          <div className="bg-white border border-zinc-150/60 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <ListPlus className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Easy Listing
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Create and manage product listings in just a few clicks.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-zinc-150/60 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
              <PackageCheck className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Order Management
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Track, pack and ship orders seamlessly from one place.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-zinc-150/60 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <BarChart4 className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Business Insights
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Get real-time insights and analytics to grow smarter.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-zinc-150/60 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 shrink-0">
              <Wallet2 className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Secure Payments
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Receive payments directly in your bank account.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-zinc-150/60 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-9 w-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-650 shrink-0">
              <Megaphone className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Marketing Tools
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold">
                Boost your visibility with ads, offers and promotions.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-zinc-150/60 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <Headset className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1 leading-normal">
              <h4 className="text-xs font-black text-zinc-800">
                Seller Support
              </h4>
              <p className="text-[10px] text-zinc-400 font-semibold">
                24/7 dedicated support whenever you need help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}