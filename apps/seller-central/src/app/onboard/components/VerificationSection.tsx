import React from "react";
import { ShieldCheck, Smartphone, Mail, Check } from "lucide-react";

interface VerificationSectionProps {
  phoneNumber?: string;
  emailAddress?: string;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
  phoneNumber = "+91 85911 51528",
  emailAddress = "abhisheknduw@gmail.com",
}) => {
  return (
    <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-left">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-extrabold text-zinc-900 leading-none">
          Mobile & Email Verification
        </h3>
      </div>

      {/* Verification Items List */}
      <div className="space-y-3">
        {/* Mobile Verification Item */}
        <div className="flex items-center justify-between border border-zinc-150 rounded-2xl p-3 bg-zinc-50/10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-600">
              <Smartphone className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-zinc-700 font-mono">
              {phoneNumber}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider select-none">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Verified</span>
          </div>
        </div>

        {/* Email Verification Item */}
        <div className="flex items-center justify-between border border-zinc-150 rounded-2xl p-3 bg-zinc-50/10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-600">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-zinc-700">
              {emailAddress}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider select-none">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
