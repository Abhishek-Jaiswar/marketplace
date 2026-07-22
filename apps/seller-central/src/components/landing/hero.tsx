import React from "react";
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Headset,
  Play,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ListPlus,
  PackageCheck,
  BarChart4,
  Wallet2,
  Megaphone,
  Home,
  Settings,
  Bell,
  Store,
  ChevronDown,
} from "lucide-react";

interface HeroProps {
  handleStartSelling: () => void;
}

export default function Hero({ handleStartSelling }: HeroProps) {
  return (
    <section className="w-full py-16 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Left Column */}
      <div className="lg:col-span-5 flex flex-col gap-6 text-left">
        {/* Star Trust Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 border border-indigo-100 bg-indigo-50/70 rounded-full w-fit text-xs font-bold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 fill-indigo-600 stroke-none" />
          <span>Trusted by 1L+ Sellers Across India</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black text-zinc-900 tracking-tight leading-[1.08]">
          Grow Your Business with{" "}
          <span className="text-indigo-600 font-black">ShopEase</span>
        </h1>

        <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-semibold max-w-lg">
          Reach crores of customers, manage your business easily and boost your
          sales with India's trusted marketplace.
        </p>

        {/* Features Row */}
        <div className="flex flex-row justify-between items-start gap-4 pt-4 pb-2 max-w-lg">
          <div className="flex flex-col gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-bold text-zinc-800 leading-tight">
              Crores of<br />Customers
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-bold text-zinc-800 leading-tight">
              Secure &<br />Trusted
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-bold text-zinc-800 leading-tight">
              Powerful<br />Insights
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <Headset className="w-6 h-6 text-indigo-600" />
            <span className="text-xs font-bold text-zinc-800 leading-tight">
              24/7 Seller<br />Support
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
          <button
            onClick={handleStartSelling}
            className="w-full sm:w-auto flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-500/15 transition-all select-none cursor-pointer"
          >
            <span>Start Selling Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button className="w-full sm:w-auto flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors select-none cursor-pointer">
            <span className="flex items-center justify-center h-8 w-8 rounded-full border border-indigo-200 bg-indigo-50/50">
              <Play className="w-3.5 h-3.5 fill-indigo-600 stroke-none ml-0.5" />
            </span>
            <span>Watch How It Works</span>
          </button>
        </div>

        {/* Mini checklist bullets */}
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400 mt-2 px-1">
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-extrabold">✓</span>
            <span>Free to join</span>
          </span>
          <span className="h-1 w-1 bg-zinc-300 rounded-full"></span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-extrabold">✓</span>
            <span>Easy onboarding</span>
          </span>
          <span className="h-1 w-1 bg-zinc-300 rounded-full"></span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-extrabold">✓</span>
            <span>No hidden charges</span>
          </span>
        </div>
      </div>

      {/* Right Column: Mock Dashboard Image */}
      <div className="lg:col-span-7 w-full flex items-center justify-center lg:justify-end">
        <div className="w-full max-w-[620px] bg-white border border-zinc-150/70 rounded-[28px] shadow-2xl overflow-hidden scale-95 md:scale-100">
          <img
            src="/dashboard-mockup.png"
            alt="ShopEase Seller Dashboard Mockup"
            className="w-full h-auto object-contain block"
          />
        </div>
      </div>
    </section>
  );
}