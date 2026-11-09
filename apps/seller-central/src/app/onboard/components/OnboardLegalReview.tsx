import React from "react"
import { Check, FileCheck, ArrowLeft, ArrowRight } from "lucide-react"

interface OnboardLegalReviewProps {
  tradeName?: string
  gstin: string
  bankName: string
  accountNumber: string
  onBack: () => void
  onProceed: () => void
}

export const OnboardLegalReview: React.FC<OnboardLegalReviewProps> = ({
  tradeName = "Verified GSTIN Entity",
  gstin,
  bankName,
  accountNumber,
  onBack,
  onProceed,
}) => {
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900">
          3. Confirm Legal Onboarding
        </h2>
        <p className="text-xs font-medium text-zinc-500">
          Confirm your verified details before creating your storefront.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-bold text-zinc-500">
            Verified Legal Entity
          </span>
          <span className="flex items-center gap-1 text-xs font-extrabold text-zinc-900">
            <Check className="h-4 w-4 text-emerald-600" />
            {tradeName}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-bold text-zinc-500">GSTIN Number</span>
          <span className="font-mono text-xs font-bold text-zinc-800">
            {gstin}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-bold text-zinc-500">
            Digital Signature
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            <FileCheck className="h-4 w-4" /> Signature Bound
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-500">
            Bank Settlement Account
          </span>
          <span className="text-xs font-bold text-zinc-800">
            {bankName} (****{accountNumber ? accountNumber.slice(-4) : "0000"})
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" /> Edit Bank Details
        </button>

        <button
          type="button"
          onClick={onProceed}
          className="flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-8 text-xs font-extrabold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
        >
          <span>Proceed to Storefront & Pickup Setup</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
