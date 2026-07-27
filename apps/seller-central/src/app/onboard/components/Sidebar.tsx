import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check, Store } from "lucide-react";

interface SidebarProps {
  progressPercentage?: number;
  mobileVerified?: boolean;
  emailVerified?: boolean;
  idVerified?: boolean;
  signatureVerified?: boolean;
  storeNameCompleted?: boolean;
  addressCompleted?: boolean;
  listingCreated?: boolean;
  stockAdded?: boolean;
  activeStep?: number;
  onSelectStep?: (step: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  progressPercentage = 20,
  mobileVerified = true,
  emailVerified = true,
  idVerified = false,
  signatureVerified = false,
  storeNameCompleted = false,
  addressCompleted = false,
  listingCreated = false,
  stockAdded = false,
  activeStep = 1,
  onSelectStep,
}) => {
  const [openSections, setOpenSections] = useState({
    account: true,
    business: true,
    store: false,
    listing: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col gap-6 text-left">
      {/* Progress Bar Card */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
          Your onboarding progress
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-extrabold text-indigo-600">
            {progressPercentage}% Complete
          </span>
        </div>
        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Accordion Steps List */}
      <div className="space-y-4">
        {/* Section 1: Account Verification */}
        <div className={`border-b border-zinc-100 pb-3 rounded-2xl transition-colors ${activeStep === 1 ? "bg-indigo-50/50 p-2" : ""}`}>
          <button
            type="button"
            onClick={() => {
              toggleSection("account");
              if (onSelectStep) onSelectStep(1);
            }}
            className="w-full flex items-center justify-between py-1.5 text-xs font-extrabold text-zinc-800 uppercase tracking-wider hover:opacity-85 transition-opacity cursor-pointer"
          >
            <span className={activeStep === 1 ? "text-indigo-600 font-extrabold" : ""}>1. Account Verification</span>
            {openSections.account ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          {openSections.account && (
            <ul className="mt-3.5 space-y-3 pl-1">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Mobile Verification</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-700">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>Email Verification</span>
              </li>
            </ul>
          )}
        </div>

        {/* Section 2: Business Verification */}
        <div className={`border-b border-zinc-100 pb-3 rounded-2xl transition-colors ${activeStep === 2 ? "bg-indigo-50/50 p-2" : ""}`}>
          <button
            type="button"
            onClick={() => {
              toggleSection("business");
              if (onSelectStep) onSelectStep(2);
            }}
            className="w-full flex items-center justify-between py-1.5 text-xs font-extrabold text-zinc-800 uppercase tracking-wider hover:opacity-85 transition-opacity cursor-pointer"
          >
            <span className={activeStep === 2 ? "text-indigo-600 font-extrabold" : ""}>2. Business & Signature</span>
            {openSections.business ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          {openSections.business && (
            <ul className="mt-3.5 space-y-3 pl-1">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-500">
                {idVerified ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-orange-500 bg-white"></div>
                )}
                <span>GSTIN Verification</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-500">
                {signatureVerified ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-orange-500 bg-white"></div>
                )}
                <span>Digital Signature</span>
              </li>
            </ul>
          )}
        </div>

        {/* Section 3: Store Details */}
        <div className={`border-b border-zinc-100 pb-3 rounded-2xl transition-colors ${activeStep === 3 ? "bg-indigo-50/50 p-2" : ""}`}>
          <button
            type="button"
            onClick={() => {
              toggleSection("store");
              if (onSelectStep) onSelectStep(3);
            }}
            className="w-full flex items-center justify-between py-1.5 text-xs font-extrabold text-zinc-800 uppercase tracking-wider hover:opacity-85 transition-opacity cursor-pointer"
          >
            <span className={activeStep === 3 ? "text-indigo-600 font-extrabold" : ""}>3. Store & Bank Details</span>
            {openSections.store ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          {openSections.store && (
            <ul className="mt-3.5 space-y-3 pl-1">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-400">
                {storeNameCompleted ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-300 bg-white"></div>
                )}
                <span>Display Name & Pickup Address</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-400">
                {addressCompleted ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-300 bg-white"></div>
                )}
                <span>Bank Payout Account</span>
              </li>
            </ul>
          )}
        </div>

        {/* Section 4: Listing & Inventory */}
        <div className="pb-1">
          <button
            type="button"
            onClick={() => toggleSection("listing")}
            className="w-full flex items-center justify-between py-1.5 text-xs font-extrabold text-zinc-800 uppercase tracking-wider hover:opacity-85 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <span>Listing & Inventory</span>
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full lowercase tracking-normal">
                optional
              </span>
            </div>
            {openSections.listing ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          {openSections.listing && (
            <ul className="mt-3.5 space-y-3 pl-1">
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-400">
                {listingCreated ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-300 bg-white"></div>
                )}
                <span>Create Your Listing</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-semibold text-zinc-400">
                {stockAdded ? (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-300 bg-white"></div>
                )}
                <span>Add Your Stock</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Complete All Steps Promo Box */}
      <div className="bg-indigo-50/70 border border-indigo-100/50 rounded-2xl p-4 flex gap-3.5 items-center mt-auto">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Store className="w-5 h-5" />
        </div>
        <p className="text-[11px] font-bold text-indigo-950 leading-snug">
          Complete all steps to start selling and reach millions of customers!
        </p>
      </div>
    </div>
  );
};
