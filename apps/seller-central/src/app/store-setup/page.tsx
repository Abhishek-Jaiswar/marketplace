"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetMeQuery,
  useGetSellerMeQuery,
  useUpdateStoreMutation,
  useSubmitOnboardingMutation,
} from "@workspace/store";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

import Logo from "@/components/logo";
import {
  StoreBrandingSection,
  CATEGORIES,
} from "./components/StoreBrandingSection";
import { LogisticsPickupSection } from "./components/LogisticsPickupSection";
import { HelpFloatingButton } from "../onboard/components/HelpFloatingButton";

export default function StoreSetupPage() {
  const router = useRouter();

  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const {
    data: sellerData,
    isLoading: sellerLoading,
    refetch: refetchSeller,
  } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });

  const [updateStore, { isLoading: isSavingStore }] = useUpdateStoreMutation();
  const [submitOnboarding, { isLoading: isSubmitting }] =
    useSubmitOnboardingMutation();

  // Form States
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(
    CATEGORIES[0] || "Consumer Electronics & Accessories"
  );

  // Logistics Address States
  const [street1, setStreet1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [copiedSlug, setCopiedSlug] = useState(false);

  // Auto-fill existing store details or prefill from GSTIN
  useEffect(() => {
    if (sellerData?.seller) {
      const seller = sellerData.seller;
      const existingStore = seller.store;

      // Prefill Display Name: Use existing store name OR fallback to GSTIN businessName
      const defaultName =
        existingStore?.displayName || seller.businessName || "";
      setDisplayName(defaultName);

      if (defaultName) {
        setSlug(
          defaultName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        );
      }

      if (existingStore?.description) {
        setDescription(existingStore.description);
      }

      // Prefill address if existing
      if (existingStore?.address) {
        const addr = existingStore.address;
        if (addr.street1) setStreet1(addr.street1);
        if (addr.city) setCity(addr.city);
        if (addr.state) setState(addr.state);
        if (addr.postalCode) setPostalCode(addr.postalCode);
      }
    }
  }, [sellerData]);

  // Handle Display Name change & Auto Slugification
  const handleNameChange = (val: string) => {
    setDisplayName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generatedSlug);
  };

  // PIN Code Auto-Lookup for Indian Postal PIN
  const handlePinChange = async (val: string) => {
    const cleanPin = val.replace(/\D/g, "").slice(0, 6);
    setPostalCode(cleanPin);
    setPinSuccess(false);

    if (cleanPin.length === 6) {
      try {
        setIsPinLoading(true);
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${cleanPin}`
        );
        const data = await res.json();
        if (
          Array.isArray(data) &&
          data[0]?.Status === "Success" &&
          data[0]?.PostOffice?.length > 0
        ) {
          const po = data[0].PostOffice[0];
          setCity(po.District || po.Block || po.Name);
          setState(po.State);
          setPinSuccess(true);
        }
      } catch (err) {
        console.error("PIN lookup failed:", err);
      } finally {
        setIsPinLoading(false);
      }
    }
  };

  const handleCopySlug = () => {
    navigator.clipboard.writeText(`https://cbsmarketplace.com/store/${slug}`);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleFinalizeSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!displayName.trim()) {
      setErrorMsg("Please provide a Store Display Name.");
      return;
    }

    if (!street1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMsg("Please fill out complete pickup address details.");
      return;
    }

    try {
      // 1. Save Store & Address
      await updateStore({
        displayName: displayName.trim(),
        description: description.trim(),
        address: {
          street1: street1.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: "India",
        },
      }).unwrap();

      // 2. Finalize Onboarding Status
      await submitOnboarding().unwrap();
      await refetchSeller();

      // 3. Launch into Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message ||
          err?.message ||
          "Failed to finalize store setup."
      );
    }
  };

  if (userLoading || sellerLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <span className="text-xs font-semibold">Loading Store Setup Portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-zinc-900 select-none pb-16">
      {/* SOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-200/80 shadow-xs backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo iconSize={26} subtitle="Store Setup Portal" />
            <div className="hidden sm:flex items-center gap-2 border-l border-zinc-200 pl-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-extrabold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Legal KYB Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right hidden md:block">
              <span className="text-xs font-bold text-zinc-800">
                Phase 2 of 2: Storefront & Pickup
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold">
                Final step before launching
              </span>
            </div>
            <div className="w-24 bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200 hidden sm:block">
              <div className="bg-indigo-600 h-full w-[90%] rounded-full transition-all" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6 text-left">
        {/* HERO TITLE CARD */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-950/10">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to CBS Storefront Setup
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Customize Your Digital Store & Pickup Address
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl font-medium leading-relaxed">
              Configure your merchant storefront branding and courier pickup location. Customers will see your store name on product listings and invoices.
            </p>
          </div>
        </div>

        {/* ERROR NOTICE */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleFinalizeSetup} className="space-y-6">
          {/* SECTION 1: STORE BRANDING */}
          <StoreBrandingSection
            displayName={displayName}
            onDisplayNameChange={handleNameChange}
            category={category}
            onCategoryChange={setCategory}
            slug={slug}
            copiedSlug={copiedSlug}
            onCopySlug={handleCopySlug}
            description={description}
            onDescriptionChange={setDescription}
          />

          {/* SECTION 2: LOGISTICS PICKUP LOCATION */}
          <LogisticsPickupSection
            street1={street1}
            onStreetChange={setStreet1}
            postalCode={postalCode}
            onPinChange={handlePinChange}
            isPinLoading={isPinLoading}
            pinSuccess={pinSuccess}
            city={city}
            onCityChange={setCity}
            state={state}
            onStateChange={setState}
          />

          {/* SUBMIT BUTTON */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your merchant storefront will be immediately published.</span>
            </div>

            <button
              type="submit"
              disabled={isSavingStore || isSubmitting}
              className="w-full sm:w-auto h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl px-8 text-sm font-extrabold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSavingStore || isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Launch Storefront & Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <HelpFloatingButton />
    </div>
  );
}
