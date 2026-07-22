import React from "react";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  handleStartSelling: () => void;
}

export default function CTA({ handleStartSelling }: CTAProps) {
  return (
    <section id="benefits" className="w-full py-16 px-8 max-w-7xl mx-auto flex flex-col gap-8 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Stats Section */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-4 gap-6 items-center border border-zinc-150/70 bg-white p-6.5 rounded-[24px] shadow-sm">
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
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src={src}
                  alt="Seller avatar"
                />
              ))}
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-[8px] font-extrabold text-indigo-650 ring-2 ring-white">
                +50K
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-bold block leading-none">
              ...and growing every day!
            </span>
          </div>

          {/* Active Sellers Stat */}
          <div className="flex flex-col gap-1 sm:border-l sm:border-zinc-100 sm:pl-4 text-left">
            <span className="text-xl font-black text-zinc-900">10L+</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide block leading-none">
              Active Sellers
            </span>
          </div>

          {/* Products Sold Stat */}
          <div className="flex flex-col gap-1 sm:border-l sm:border-zinc-100 sm:pl-4 text-left">
            <span className="text-xl font-black text-zinc-900">15Cr+</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide block leading-none">
              Products Sold
            </span>
          </div>

          {/* Rating Stat */}
          <div className="flex flex-col gap-1 sm:border-l sm:border-zinc-100 sm:pl-4 text-left">
            <span className="text-xl font-black text-zinc-900">4.8 ★</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide block leading-none">
              Seller Rating
            </span>
          </div>
        </div>

        {/* Right Purple CTA Card Banner */}
        <div className="lg:col-span-5 bg-indigo-600 rounded-[24px] p-6.5 text-white flex flex-col sm:flex-row justify-between items-center gap-6 shadow-md">
          <div className="flex flex-col gap-2 max-w-[65%] text-left">
            <h4 className="text-sm font-extrabold leading-snug">
              Ready to grow your business?
            </h4>
            <p className="text-[10px] font-bold text-indigo-100 leading-normal">
              Join ShopEase and start your selling journey today.
            </p>
          </div>
          <button
            onClick={handleStartSelling}
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-white text-indigo-600 text-sm font-bold transition-colors hover:bg-zinc-50 shadow-md cursor-pointer flex items-center justify-center gap-1 shrink-0 whitespace-nowrap"
          >
            <span>Start Selling Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}