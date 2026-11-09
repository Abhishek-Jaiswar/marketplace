import React from "react"
import { Grid, Tag, Lock, Check, Loader2, Store } from "lucide-react"

export interface OnboardGstinVerificationProps {
  gstin: string
  setGstin: (val: string) => void
  verified: boolean
  details: {
    tradeName: string
    legalName: string
    businessType: string
    state: string
    status: string
  } | null
  isVerifying: boolean
  onVerify: () => void
  categoryMode?: "all" | "specific"
  setCategoryMode?: (val: "all" | "specific") => void
}

export const OnboardGstinVerification: React.FC<
  OnboardGstinVerificationProps
> = ({
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
    <div className="flex flex-col gap-5 rounded-3xl border border-zinc-200/80 bg-white p-6 text-left shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600">
          <Store className="h-4 w-4" />
        </div>
        <h3 className="text-sm leading-none font-extrabold text-zinc-900">
          Business & GSTIN Verification
        </h3>
      </div>

      {/* Selling Categories Option */}
      {setCategoryMode && (
        <div className="space-y-3">
          <span className="block text-xs font-bold text-zinc-800">
            What do you plan to sell on CBS?
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCategoryMode("all")}
              className={`flex cursor-pointer gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                categoryMode === "all"
                  ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  categoryMode === "all"
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
                }`}
              >
                <Grid className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xs font-extrabold transition-colors ${
                    categoryMode === "all" ? "text-indigo-600" : "text-zinc-700"
                  }`}
                >
                  All Categories
                </span>
                <span className="mt-0.5 text-[10px] font-semibold text-zinc-400">
                  I want to sell across all categories
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategoryMode("specific")}
              className={`flex cursor-pointer gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                categoryMode === "specific"
                  ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  categoryMode === "specific"
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
                }`}
              >
                <Tag className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xs font-extrabold transition-colors ${
                    categoryMode === "specific"
                      ? "text-indigo-600"
                      : "text-zinc-700"
                  }`}
                >
                  Specific Category
                </span>
                <span className="mt-0.5 text-[10px] font-semibold text-zinc-400">
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
        <div className="relative flex flex-col items-stretch gap-2 rounded-xl border border-zinc-300 bg-zinc-50/50 p-1 focus-within:border-indigo-600 sm:flex-row sm:items-center">
          <input
            type="text"
            value={gstin}
            onChange={(e) => setGstin(e.target.value.toUpperCase())}
            placeholder="e.g. 27ABCDE1234F1Z5"
            disabled={verified}
            className="min-w-0 flex-1 border-none bg-transparent px-3 py-2.5 font-mono text-xs font-bold tracking-wider uppercase placeholder-zinc-400 focus:outline-none"
          />
          {verified ? (
            <div className="flex shrink-0 items-center justify-center gap-1 px-3.5 py-2 text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase select-none">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Verified</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onVerify}
              disabled={isVerifying}
              className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-5 text-xs font-extrabold text-white shadow-xs transition-colors hover:bg-indigo-700 disabled:opacity-55 sm:h-9"
            >
              {isVerifying ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Verify GSTIN"
              )}
            </button>
          )}
        </div>

        {/* Sync feedback panel */}
        {verified && details && (
          <div className="mt-2 space-y-1.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs">
            <div className="flex items-center gap-1 text-[10px] font-extrabold tracking-wide text-emerald-700 uppercase">
              <Check className="h-3 w-3" /> Entity Synced Successfully
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-[11px] leading-normal font-semibold text-zinc-600">
              <span>
                Trade Name:{" "}
                <strong className="text-zinc-900">{details.tradeName}</strong>
              </span>
              <span>
                Legal Name:{" "}
                <strong className="text-zinc-900">{details.legalName}</strong>
              </span>
              <span>
                State Division:{" "}
                <strong className="text-zinc-900">{details.state}</strong>
              </span>
              <span>
                Tax Status:{" "}
                <strong className="text-zinc-900">{details.status}</strong>
              </span>
            </div>
          </div>
        )}

        <div className="mt-1 flex items-center gap-1.5 pb-1 text-[10px] font-semibold text-zinc-400">
          <Lock className="h-3.5 w-3.5 text-zinc-400" />
          <span>GSTIN is mandatory to sell products on CBS Marketplace.</span>
        </div>
      </div>
    </div>
  )
}
