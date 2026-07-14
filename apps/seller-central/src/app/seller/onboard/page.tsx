"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetMeQuery,
  useGetSellerMeQuery,
  useOnboardSellerMutation,
  useUpdateSellerProfileMutation,
  useUpdateStoreMutation,
  useAddBankAccountMutation,
  useUploadDocumentMutation,
  useSubmitOnboardingMutation,
} from "@workspace/store";
import {
  Loader2,
  Building,
  Store,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Check,
  Globe,
} from "lucide-react";

export default function SellerOnboardingWizard() {
  const router = useRouter();

  // 1. Auth & Seller status checks
  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const { data: sellerData, isLoading: sellerLoading, refetch: refetchSeller } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });

  const [onboardSeller, { isLoading: isStarting }] = useOnboardSellerMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateSellerProfileMutation();
  const [updateStore, { isLoading: isUpdatingStore }] = useUpdateStoreMutation();
  const [addBankAccount, { isLoading: isAddingBank }] = useAddBankAccountMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [submitOnboarding, { isLoading: isSubmitting }] = useSubmitOnboardingMutation();

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step 1: Business Profile Form State
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("INDIVIDUAL");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Step 2: Store & Address Form State
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [addressPhone, setAddressPhone] = useState("");

  // Step 3: Bank Account Form State
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  // Step 4: Documents Upload State (Store uploaded file names from DB relations)
  const [gstUploaded, setGstUploaded] = useState<string | null>(null);
  const [panUploaded, setPanUploaded] = useState<string | null>(null);
  const [chequeUploaded, setChequeUploaded] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !userData?.user) {
      router.push("/seller/login");
    }
  }, [userData, userLoading, router]);

  // Pre-fill state if seller profile already exists in DB
  useEffect(() => {
    if (sellerData?.seller) {
      const seller = sellerData.seller;
      setBusinessName(seller.businessName || "");
      setBusinessType(seller.businessType || "INDIVIDUAL");
      setContactEmail(seller.contactEmail || "");
      setContactPhone(seller.contactPhone || "");

      // Pre-fill store
      if (seller.store) {
        setDisplayName(seller.store.displayName || "");
        setSlug(seller.store.slug || "");
        setDescription(seller.store.description || "");

        if (seller.store.address) {
          const addr = seller.store.address;
          setStreet1(addr.street1 || "");
          setStreet2(addr.street2 || "");
          setLandmark(addr.landmark || "");
          setCity(addr.city || "");
          setState(addr.state || "");
          setPostalCode(addr.postalCode || "");
          setCountry(addr.country || "India");
          setAddressPhone(addr.phoneNumber || "");
        }
      }

      // Pre-fill primary bank account
      const primaryBank = seller.bankAccounts?.find((b: any) => b.isPrimary);
      if (primaryBank) {
        setAccountHolderName(primaryBank.accountHolderName || "");
        setAccountNumber(primaryBank.accountNumber || "");
        setIfscCode(primaryBank.ifscCode || "");
        setBankName(primaryBank.bankName || "");
      }

      // Pre-fill uploaded documents
      const docs = seller.verification?.documents || [];
      const gstDoc = docs.find((d: any) => d.type === "GST_CERTIFICATE");
      const panDoc = docs.find((d: any) => d.type === "PAN_CARD");
      const chequeDoc = docs.find((d: any) => d.type === "CANCELLED_CHEQUE");

      if (gstDoc) setGstUploaded(gstDoc.media.fileName);
      if (panDoc) setPanUploaded(panDoc.media.fileName);
      if (chequeDoc) setChequeUploaded(chequeDoc.media.fileName);

      // Advance step if they already have basic data drafted
      if (seller.status !== "DRAFT" && seller.status !== "REJECTED" && seller.status !== "DOCUMENTS_PENDING") {
        router.push("/seller/dashboard");
      }
    }
  }, [sellerData, router]);

  const handleNextStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!businessName || !businessType) {
      setErrorMsg("Please enter Business Name and select Business Type.");
      return;
    }

    try {
      if (!sellerData?.seller) {
        // Initialize onboarding
        await onboardSeller({
          businessName: businessName.trim(),
          businessType: businessType as any,
          contactEmail: contactEmail.trim() || undefined,
          contactPhone: contactPhone.trim() || undefined,
        }).unwrap();
      } else {
        // Update existing draft profile
        await updateProfile({
          businessName: businessName.trim(),
          businessType: businessType as any,
          contactEmail: contactEmail.trim() || undefined,
          contactPhone: contactPhone.trim() || undefined,
        }).unwrap();
      }

      await refetchSeller();
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save profile.");
    }
  };

  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!displayName || !slug || !street1 || !city || !state || !postalCode) {
      setErrorMsg("Please complete all required fields for your store and address.");
      return;
    }

    try {
      await updateStore({
        displayName: displayName.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || undefined,
        address: {
          street1: street1.trim(),
          street2: street2.trim() || undefined,
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim(),
          phoneNumber: addressPhone.trim() || undefined,
        },
      }).unwrap();

      await refetchSeller();
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save store details.");
    }
  };

  const handleNextStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      setErrorMsg("Please fill in all bank details.");
      return;
    }

    try {
      await addBankAccount({
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim(),
      }).unwrap();

      await refetchSeller();
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save bank details.");
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!file) return;

    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);

    try {
      const response = await uploadDocument(formData).unwrap();
      const filename = response.document.media.fileName;

      if (type === "GST_CERTIFICATE") setGstUploaded(filename);
      if (type === "PAN_CARD") setPanUploaded(filename);
      if (type === "CANCELLED_CHEQUE") setChequeUploaded(filename);

      setSuccessMsg(`${type.replace("_", " ")} uploaded successfully!`);
      await refetchSeller();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to upload document.");
    }
  };

  const handleSubmitApplication = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!gstUploaded || !panUploaded || !chequeUploaded) {
      setErrorMsg("Please upload all three required documents before submitting.");
      return;
    }

    try {
      await submitOnboarding().unwrap();
      await refetchSeller();
      setSuccessMsg("Onboarding submitted successfully!");
      router.push("/seller/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to submit application.");
    }
  };

  const autoGenerateSlug = (val: string) => {
    setDisplayName(val);
    const cleaned = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove special characters
      .replace(/[\s_]+/g, "-") // replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // trim hyphens
    setSlug(cleaned);
  };

  if (userLoading || sellerLoading) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-zinc-950 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500">Loading your onboarding draft...</p>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: "Business Details", icon: Building },
    { num: 2, label: "Store & Address", icon: Store },
    { num: 3, label: "Bank Account", icon: CreditCard },
    { num: 4, label: "Documents", icon: FileText },
    { num: 5, label: "Review & Submit", icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white! dark:bg-zinc-950 font-sans transition-colors duration-300">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-900 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg">
              C
            </div>
            <span className="text-md font-bold tracking-tight font-mono">
              CBS <span className="text-indigo-600 dark:text-indigo-400">Seller Onboarding</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline-block font-semibold text-zinc-500">
              Welcome: <span className="text-zinc-900 dark:text-zinc-100">{userData?.user?.email}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Wizard */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Stepper Progress */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-6">
              Onboarding Steps
            </h3>
            <ul className="space-y-4">
              {stepsList.map((s) => {
                const Icon = s.icon;
                const isCompleted = s.num < step;
                const isActive = s.num === step;
                return (
                  <li key={s.num} className="flex items-center gap-3 group">
                    <div
                      className={`flex w-7 h-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        isCompleted
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                          : isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                          : "bg-zinc-50 dark:bg-zinc-950 text-zinc-400 border border-zinc-200 dark:border-zinc-850"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-bold transition-colors ${
                        isActive
                          ? "text-zinc-900 dark:text-white"
                          : isCompleted
                          ? "text-zinc-500"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Form Wizard Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notification Messages */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm space-y-6">
            
            {/* STEP 1: BUSINESS PROFILE */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1">
                    Business Profile
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Enter the legal details of your business or firm.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      Legal Business/Company Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Retailers Inc."
                      required
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      Business Entity Type *
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-all text-zinc-700 dark:text-zinc-350"
                    >
                      <option value="INDIVIDUAL">Individual / Proprietorship</option>
                      <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                      <option value="PARTNERSHIP">Partnership</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="PRIVATE_LIMITED">Private Limited Company</option>
                      <option value="PUBLIC_LIMITED">Public Limited Company</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Contact Email (Defaults to Account Email)
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="business@example.com"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Contact Phone/Mobile
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isStarting || isUpdatingProfile}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 cursor-pointer disabled:opacity-55"
                  >
                    {isStarting || isUpdatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Save & Continue <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: STORE DETAILS & ADDRESS */}
            {step === 2 && (
              <form onSubmit={handleNextStep2} className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1">
                    Store Branding & Pickup Address
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Define how customers see your store online and where couriers will pick up shipments.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Store Display Name *
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => autoGenerateSlug(e.target.value)}
                        placeholder="e.g. Acme Electronics"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Store Link / Slug *
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          placeholder="acme-electronics"
                          required
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                        />
                      </div>
                      <span className="block text-[10px] text-zinc-400">
                        Preview: <span className="font-semibold text-indigo-600 dark:text-indigo-400">cbs-market.com/stores/{slug || "your-slug"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      Store Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell customers about what you sell, your quality guarantee, etc."
                      rows={2}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800/85 my-4 pt-4"></div>
                  <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase tracking-wider">
                    Warehouse/Pickup Point Address
                  </h4>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      Street Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={street1}
                      onChange={(e) => setStreet1(e.target.value)}
                      placeholder="Room, Building, Area, Street Name"
                      required
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Street Address Line 2
                      </label>
                      <input
                        type="text"
                        value={street2}
                        onChange={(e) => setStreet2(e.target.value)}
                        placeholder="Suite, Unit, Landmark (optional)"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="Near Police Station"
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Maharashtra"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="400001"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="India"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      Pickup Contact Number (if different from account)
                    </label>
                    <input
                      type="tel"
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      placeholder="+91 9876543211"
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdatingStore}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 cursor-pointer disabled:opacity-55"
                  >
                    {isUpdatingStore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Save & Continue <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BANK DETAILS */}
            {step === 3 && (
              <form onSubmit={handleNextStep3} className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1">
                    Bank Account Details
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    We will deposit your sales proceeds directly to this primary bank account.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank Ltd"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400 font-mono tracking-wider"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="Full name as in bank passbook"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\s/g, ""))}
                        placeholder="e.g. 501002345678"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="submit"
                    disabled={isAddingBank}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 cursor-pointer disabled:opacity-55"
                  >
                    {isAddingBank ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Save & Continue <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: UPLOAD DOCUMENTS */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1">
                    Upload Business Verification Documents
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Upload copies of your legal documents to support verification. Files are saved directly to Cloudinary.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* File Upload Grid */}
                  {[
                    {
                      label: "GSTIN Certificate *",
                      type: "GST_CERTIFICATE",
                      uploaded: gstUploaded,
                      description: "Upload your official GST registration certificate (PDF, JPG, PNG).",
                    },
                    {
                      label: "PAN Card copy *",
                      type: "PAN_CARD",
                      uploaded: panUploaded,
                      description: "Upload business or individual proprietor PAN card photo.",
                    },
                    {
                      label: "Cancelled Cheque *",
                      type: "CANCELLED_CHEQUE",
                      uploaded: chequeUploaded,
                      description: "Upload a copy of a cancelled cheque showing account holder name, account number, and IFSC.",
                    },
                  ].map((docItem, idx) => (
                    <div
                      key={idx}
                      className="p-5 border border-zinc-150 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/30"
                    >
                      <div className="max-w-md text-left space-y-1">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {docItem.label}
                        </span>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-normal">
                          {docItem.description}
                        </p>
                        {docItem.uploaded && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>Uploaded: {docItem.uploaded}</span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        <label className="flex h-10 items-center justify-center gap-2 px-4 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-900 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 cursor-pointer text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-all select-none">
                          <UploadCloud className="w-4 h-4 shrink-0" />
                          <span>{docItem.uploaded ? "Replace File" : "Choose File"}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files[0]) {
                                handleFileUpload(docItem.type, files[0]);
                              }
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!gstUploaded || !panUploaded || !chequeUploaded) {
                        setErrorMsg("Please upload all three required documents before proceeding.");
                        return;
                      }
                      setErrorMsg("");
                      setStep(5);
                    }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 cursor-pointer disabled:opacity-55"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1">
                    Review and Submit Application
                  </h2>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Verify that your profile details are accurate before submitting for admin review.
                  </p>
                </div>

                {/* Review summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Business Details
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <li>Name: <span className="font-semibold text-zinc-900 dark:text-white">{businessName}</span></li>
                      <li>Type: <span className="font-semibold text-zinc-900 dark:text-white">{businessType}</span></li>
                      <li>Contact Email: <span className="font-semibold text-zinc-900 dark:text-white">{contactEmail || "N/A"}</span></li>
                      <li>Contact Phone: <span className="font-semibold text-zinc-900 dark:text-white">{contactPhone || "N/A"}</span></li>
                    </ul>
                  </div>

                  <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Store details
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <li>Name: <span className="font-semibold text-zinc-900 dark:text-white">{displayName}</span></li>
                      <li>Store URL: <span className="font-semibold text-zinc-900 dark:text-white">cbs-market.com/stores/{slug}</span></li>
                      <li>Description: <span className="font-semibold text-zinc-900 dark:text-white truncate block max-w-xs">{description || "N/A"}</span></li>
                      <li>Pickup Address: <span className="font-semibold text-zinc-900 dark:text-white">{street1}, {city}, {state} - {postalCode}</span></li>
                    </ul>
                  </div>

                  <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Bank details
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <li>Bank: <span className="font-semibold text-zinc-900 dark:text-white">{bankName}</span></li>
                      <li>Holder Name: <span className="font-semibold text-zinc-900 dark:text-white">{accountHolderName}</span></li>
                      <li>IFSC Code: <span className="font-semibold text-zinc-900 dark:text-white">{ifscCode}</span></li>
                      <li>Account Number: <span className="font-semibold text-zinc-900 dark:text-white">{accountNumber}</span></li>
                    </ul>
                  </div>

                  <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Uploaded Documents
                    </h4>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <li>GSTIN Certificate: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Uploaded ✓</span></li>
                      <li>PAN Card: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Uploaded ✓</span></li>
                      <li>Cancelled Cheque: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Uploaded ✓</span></li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 text-xs text-zinc-400 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p className="leading-relaxed">
                    By submitting this application, you declare that all documents uploaded and information supplied is authentic. Any mismatch or false document will lead to immediate rejection and seller account suspension.
                  </p>
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-150 dark:border-zinc-800/85">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 cursor-pointer dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/35 cursor-pointer disabled:opacity-55"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Submit Verification Request <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
