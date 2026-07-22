"use client";

import React from "react";
import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export function SellerCtaBanner() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border border-blue-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest font-mono">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Vendor Growth Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Start Selling On CBS Marketplace & Scale Your Brand Nationwide
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Join thousands of verified independent merchants. Enjoy low commission rates, automated payouts, real-time analytics, and instant exposure to active buyers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Setup Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Automated Payouts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                <Store className="w-4 h-4 text-amber-400" />
                <span>Dedicated Seller Portal</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register?role=seller"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-zinc-950 font-black text-sm hover:bg-zinc-100 transition-all duration-200 shadow-xl hover:scale-[1.02] group"
            >
              Open Seller Store
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-500/30 text-white font-bold text-sm hover:bg-blue-500/20 transition-all"
            >
              Seller Central Portal
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellerCtaBanner;
