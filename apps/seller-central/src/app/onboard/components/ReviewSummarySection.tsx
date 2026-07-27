import React from "react";
import { CheckCircle2, ShieldCheck, Store, Landmark, PenTool, UserCheck, Rocket, Loader2, ArrowLeft } from "lucide-react";

interface ReviewSummarySectionProps {
  userName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  gstin?: string;
  signatureAttached?: boolean;
  storeName?: string;
  pickupAddress?: string;
  bankName?: string;
  accountNumber?: string;
  isSubmitting?: boolean;
  onPrevStep: () => void;
  onSubmitOnboarding: () => void;
}

export const ReviewSummarySection: React.FC<ReviewSummarySectionProps> = ({
  userName = "Abhishek Jaiswar",
  email = "abhishek@example.com",
  phone = "+91 85911 51528",
  businessName = "N/A",
  businessType = "INDIVIDUAL",
  gstin = "N/A",
  signatureAttached = false,
  storeName = "N/A",
  pickupAddress = "N/A",
  bankName = "N/A",
  accountNumber = "N/A",
  isSubmitting = false,
  onPrevStep,
  onSubmitOnboarding,
}) => {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 shadow-xl space-y-8 text-left animate-fadeIn">
      {/* Title */}
      <div className="space-y-1 border-b border-zinc-100 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
          <Rocket className="w-3.5 h-3.5" /> Final Review Step
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
          Review Your Seller Profile
        </h2>
        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
          Please confirm your onboarding details before launching your CBS Seller Hub account.
        </p>
      </div>

      {/* Summary Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Item 1: Contact Details */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Contact Information</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Verified
            </span>
          </div>
          <div className="text-xs text-zinc-500 space-y-1">
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
          </div>
        </div>

        {/* Item 2: Business & GSTIN */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Business Entity</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Authenticated
            </span>
          </div>
          <div className="text-xs text-zinc-500 space-y-1">
            <p><strong>Business Name:</strong> {businessName}</p>
            <p><strong>Entity Type:</strong> {businessType}</p>
            <p><strong>GSTIN:</strong> {gstin}</p>
          </div>
        </div>

        {/* Item 3: Digital Signature */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
              <PenTool className="w-4 h-4 text-indigo-600" />
              <span>Digital Signature</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {signatureAttached ? "✓ Attached" : "Pending"}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            {signatureAttached
              ? "Digital signature attached and bound to merchant profile."
              : "Digital signature pending."}
          </p>
        </div>

        {/* Item 4: Store & Address */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
              <Store className="w-4 h-4 text-indigo-600" />
              <span>Store & Pickup Location</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Configured
            </span>
          </div>
          <div className="text-xs text-zinc-500 space-y-1">
            <p><strong>Store Name:</strong> {storeName}</p>
            <p><strong>Pickup Address:</strong> {pickupAddress}</p>
          </div>
        </div>

        {/* Item 5: Bank Account */}
        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
              <Landmark className="w-4 h-4 text-indigo-600" />
              <span>Bank Settlement Account</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Linked
            </span>
          </div>
          <div className="text-xs text-zinc-500 space-y-1">
            <p><strong>Bank Name:</strong> {bankName}</p>
            <p><strong>Account Number:</strong> {accountNumber ? `****${accountNumber.slice(-4)}` : "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-zinc-200 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevStep}
          className="flex h-12 items-center gap-2 px-5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </button>

        <button
          type="button"
          onClick={onSubmitOnboarding}
          disabled={isSubmitting}
          className="flex h-12 items-center gap-2 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-extrabold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit & Launch Seller Central</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
