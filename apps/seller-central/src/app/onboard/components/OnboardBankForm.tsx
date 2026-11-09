import React from "react"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

interface OnboardBankFormProps {
  accountHolderName: string
  setAccountHolderName: (val: string) => void
  bankName: string
  setBankName: (val: string) => void
  accountNumber: string
  setAccountNumber: (val: string) => void
  ifscCode: string
  setIfscCode: (val: string) => void
  isSaving: boolean
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
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
    <div className="animate-fadeIn space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-zinc-900">
          2. Bank Payout Account
        </h2>
        <p className="text-xs font-medium text-zinc-500">
          Enter bank details for direct payout settlements.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            placeholder="Full Name as per Bank Account"
            required
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. HDFC Bank / ICICI Bank"
            required
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="9-18 digit account number"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 font-mono text-xs font-bold text-zinc-900 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              required
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 font-mono text-xs font-bold text-zinc-900 uppercase transition-all focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1 text-xs font-bold text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to GSTIN
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-8 text-xs font-extrabold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Save & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
