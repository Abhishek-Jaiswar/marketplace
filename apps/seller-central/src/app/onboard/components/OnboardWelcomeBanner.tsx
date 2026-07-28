import React from "react";
import { ShieldCheck, Building2, Landmark, Rocket, ArrowRight, X } from "lucide-react";
import Logo from "@/components/logo";

interface OnboardWelcomeBannerProps {
  onStart: () => void;
  onCancel: () => void;
}

export const OnboardWelcomeBanner: React.FC<OnboardWelcomeBannerProps> = ({
  onStart,
  onCancel,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none text-zinc-900">
      {/* Minimal Header */}
      <header className="w-full bg-white border-b border-zinc-200/80 px-6 py-4 flex items-center justify-between">
        <Logo iconSize={26} subtitle="Seller Onboarding" />
        <button
          onClick={onCancel}
          className="text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
        >
          <X className="w-4 h-4" /> Cancel & Exit
        </button>
      </header>

      {/* Welcome Hero Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-3xl mx-auto w-full my-auto text-center space-y-8 animate-fadeIn">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-extrabold text-indigo-700">
            <ShieldCheck className="w-4 h-4" /> Amazon-Style Seller Setup
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            Welcome to CBS Marketplace Seller Hub
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
            Set up your merchant account in a few simple, distraction-free steps.
            Here is what you will need to get started:
          </p>
        </div>

        {/* Checklist Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-zinc-900">
              1. Business & GSTIN
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              15-digit GSTIN number & digital signature proof.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-zinc-900">
              2. Bank Settlement
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              Account number & IFSC code for direct payouts.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-zinc-900">
              3. Storefront Setup
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              Store name & courier pickup logistics location.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto h-12 px-8 rounded-xl border border-zinc-200 text-xs font-extrabold text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer"
          >
            Cancel & Exit
          </button>

          <button
            onClick={onStart}
            className="w-full sm:w-auto h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-extrabold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
