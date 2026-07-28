import React from "react";
import { Check, FileCheck, ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardLegalReviewProps {
  tradeName?: string;
  gstin: string;
  bankName: string;
  accountNumber: string;
  onBack: () => void;
  onProceed: () => void;
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
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900">
          3. Confirm Legal Onboarding
        </h2>
        <p className="text-xs text-zinc-500 font-medium">
          Confirm your verified details before creating your storefront.
        </p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-bold text-zinc-500">
            Verified Legal Entity
          </span>
          <span className="text-xs font-extrabold text-zinc-900 flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-600" />
            {tradeName}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-bold text-zinc-500">
            GSTIN Number
          </span>
          <span className="text-xs font-mono font-bold text-zinc-800">
            {gstin}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-bold text-zinc-500">
            Digital Signature
          </span>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <FileCheck className="w-4 h-4" /> Signature Bound
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

      <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Edit Bank Details
        </button>

        <button
          type="button"
          onClick={onProceed}
          className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Proceed to Storefront & Pickup Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
