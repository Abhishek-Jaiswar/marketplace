import React from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface OnboardBankFormProps {
  accountHolderName: string;
  setAccountHolderName: (val: string) => void;
  bankName: string;
  setBankName: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  ifscCode: string;
  setIfscCode: (val: string) => void;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const OnboardBankForm: React.FC<OnboardBankFormProps> = ({
  accountHolderName,
  setAccountHolderName,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
  isSaving,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900">
          2. Bank Payout Account
        </h2>
        <p className="text-xs text-zinc-500 font-medium">
          Enter bank details for direct payout settlements.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            placeholder="Full Name as per Bank Account"
            required
            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. HDFC Bank / ICICI Bank"
            required
            className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="9-18 digit account number"
              required
              className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              required
              className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-bold text-zinc-900 font-mono uppercase focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to GSTIN
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Save & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
