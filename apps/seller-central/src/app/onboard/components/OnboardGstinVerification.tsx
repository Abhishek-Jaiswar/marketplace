import React from "react";
import { Grid, Tag, Lock, Check, Loader2, Store } from "lucide-react";

export interface OnboardGstinVerificationProps {
  gstin: string;
  setGstin: (val: string) => void;
  verified: boolean;
  details: {
    tradeName: string;
    legalName: string;
    businessType: string;
    state: string;
    status: string;
  } | null;
  isVerifying: boolean;
  onVerify: () => void;
  categoryMode?: "all" | "specific";
  setCategoryMode?: (val: "all" | "specific") => void;
}

export const OnboardGstinVerification: React.FC<OnboardGstinVerificationProps> = ({
  gstin = "",
  setGstin,
  verified = false,
  details = null,
  isVerifying = false,
  onVerify,
  categoryMode = "all",
  setCategoryMode,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs flex flex-col gap-5 text-left">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <Store className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-extrabold text-zinc-900 leading-none">
          Business & GSTIN Verification
        </h3>
      </div>

      {/* Selling Categories Option */}
      {setCategoryMode && (
        <div className="space-y-3">
          <span className="block text-xs font-bold text-zinc-800">
            What do you plan to sell on CBS?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCategoryMode("all")}
              className={`p-4 rounded-2xl border text-left flex gap-3.5 transition-all cursor-pointer ${
                categoryMode === "all"
                  ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <div
                className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${
                  categoryMode === "all"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-zinc-50 border-zinc-200 text-zinc-400"
                }`}
              >
                <Grid className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xs font-extrabold transition-colors ${
                    categoryMode === "all" ? "text-indigo-600" : "text-zinc-700"
                  }`}
                >
                  All Categories
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  I want to sell across all categories
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategoryMode("specific")}
              className={`p-4 rounded-2xl border text-left flex gap-3.5 transition-all cursor-pointer ${
                categoryMode === "specific"
                  ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <div
                className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${
                  categoryMode === "specific"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-zinc-50 border-zinc-200 text-zinc-400"
                }`}
              >
                <Tag className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xs font-extrabold transition-colors ${
                    categoryMode === "specific" ? "text-indigo-600" : "text-zinc-700"
                  }`}
                >
                  Specific Category
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                  I want to sell in select categories only
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* GSTIN Input Form */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-zinc-800">
          Enter your GSTIN <span className="text-red-500">*</span>
        </label>
        <div className="relative border border-zinc-300 focus-within:border-indigo-600 rounded-xl p-1 bg-zinc-50/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="e.g. 27ABCDE1234F1Z5"
            disabled={verified}
            className="flex-1 bg-transparent border-none text-xs font-mono font-bold tracking-wider uppercase px-3 py-2.5 focus:outline-none placeholder-zinc-400 min-w-0"
          />
          {verified ? (
            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider px-3.5 py-2 select-none shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Verified</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onVerify}
              disabled={isVerifying}
              className="h-10 sm:h-9 px-5 shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-55 flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isVerifying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Verify GSTIN"
              )}
            </button>
          )}
        </div>

        {/* Sync feedback panel */}
        {verified && details && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 mt-2">
            <div className="flex items-center gap-1 text-emerald-700 font-extrabold uppercase tracking-wide text-[10px]">
              <Check className="w-3 h-3" /> Entity Synced Successfully
            </div>
            <div className="text-zinc-600 text-[11px] grid grid-cols-2 gap-y-1 font-semibold leading-normal">
              <span>Trade Name: <strong className="text-zinc-900">{details.tradeName}</strong></span>
              <span>Legal Name: <strong className="text-zinc-900">{details.legalName}</strong></span>
              <span>State Division: <strong className="text-zinc-900">{details.state}</strong></span>
              <span>Tax Status: <strong className="text-zinc-900">{details.status}</strong></span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 mt-1 pb-1">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          <span>GSTIN is mandatory to sell products on CBS Marketplace.</span>
        </div>
      </div>
    </div>
  );
};
