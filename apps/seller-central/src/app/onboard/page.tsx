"use client";

import React, { useState, useEffect, useRef } from "react";
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
  useLazyVerifyGstinQuery,
} from "@workspace/store";
import { Loader2, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

// Sub-components
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { VerificationSection } from "./components/VerificationSection";
import { BusinessVerification } from "./components/BusinessVerification";
import { SignatureSection } from "./components/SignatureSection";
import { StoreDetailsSection } from "./components/StoreDetailsSection";
import { ReviewSummarySection } from "./components/ReviewSummarySection";
import { RightPanel } from "./components/RightPanel";
import { HelpFloatingButton } from "./components/HelpFloatingButton";

export default function SellerOnboardingPage() {
  const router = useRouter();

  // Step state for step-wise rendering
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Auth & Seller states
  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const { data: sellerData, isLoading: sellerLoading, refetch: refetchSeller } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });

  const [onboardSeller] = useOnboardSellerMutation();
  const [updateProfile] = useUpdateSellerProfileMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [addBankAccount] = useAddBankAccountMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [submitOnboarding, { isLoading: isSubmitting }] = useSubmitOnboardingMutation();
  const [triggerVerifyGstin, { isFetching: isVerifyingGstin }] = useLazyVerifyGstinQuery();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Step state
  const [gstin, setGstin] = useState("");
  const [gstinVerified, setGstinVerified] = useState(false);
  const [gstinDetails, setGstinDetails] = useState<{ tradeName: string; legalName: string; businessType: string; state: string; status: string } | null>(null);
  const [categoryMode, setCategoryMode] = useState<"all" | "specific">("all");

  // Signature States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSignature, setCanvasSignature] = useState<string | null>(null);
  const [signatureUploaded, setSignatureUploaded] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !userData?.user) {
      router.push("/login");
    }
  }, [userData, userLoading, router]);

  // Sync profile details if they already exist
  useEffect(() => {
    if (sellerData?.seller) {
      const seller = sellerData.seller;
      setGstin(seller.gstin || "");
      if (seller.gstin) {
        setGstinVerified(true);
        setGstinDetails({
          tradeName: seller.businessName,
          legalName: seller.businessName,
          businessType: seller.businessType,
          state: seller.store?.address?.state || "N/A",
          status: "ACTIVE",
        });
      }

      // Check if signature document is uploaded
      const docs = seller.verification?.documents || [];
      const sigDoc = docs.find((d: any) => d.type === "SIGNATURE");
      if (sigDoc) {
        setSignatureUploaded(sigDoc.media.fileName);
      }

      // If fully onboarded and approved, go to dashboard
      if (seller.status === "APPROVED" || seller.status === "UNDER_REVIEW") {
        router.push("/dashboard");
      }
    }
  }, [sellerData, router]);

  // Initialize Signature Pad Styling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#4f46e5"; // Indigo-600
      }
    }
  }, [canvasRef.current]);

  // GSTIN Lookup Trigger
  const handleVerifyGstin = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!gstin || gstin.trim().length !== 15) {
      setErrorMsg("Please enter a valid 15-digit GSTIN.");
      return;
    }

    try {
      const response = await triggerVerifyGstin(gstin.trim()).unwrap();
      setGstinDetails(response);
      setGstinVerified(true);
      setSuccessMsg("GSTIN verified successfully!");

      if (!sellerData?.seller) {
        await onboardSeller({
          businessName: response.tradeName,
          businessType: response.businessType as any,
          gstin: gstin.trim(),
        }).unwrap();
      } else {
        await updateProfile({
          businessName: response.tradeName,
          businessType: response.businessType as any,
          gstin: gstin.trim(),
        }).unwrap();
      }
      await refetchSeller();
    } catch (err: any) {
      setGstinVerified(false);
      setErrorMsg(err?.data?.message || err?.message || "GSTIN verification failed.");
    }
  };

  // e-Signature Upload Callback
  const handleUploadSignatureFile = async (file: File) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!file) return;

    const formData = new FormData();
    formData.append("type", "SIGNATURE");
    formData.append("file", file);

    try {
      const response = await uploadDocument(formData).unwrap();
      setSignatureUploaded(response.document.media.fileName);
      setSuccessMsg("Signature uploaded successfully!");
      await refetchSeller();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to upload signature.");
    }
  };

  // Canvas Signature Methods
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0, clientY = 0;
    if ("touches" in e) {
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0, clientY = 0;
    if ("touches" in e) {
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setCanvasSignature(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasSignature(null);
      }
    }
  };

  const saveCanvasSignature = async () => {
    if (!canvasSignature) {
      setErrorMsg("Please draw your signature first.");
      return;
    }
    setErrorMsg("");
    try {
      const res = await fetch(canvasSignature);
      const blob = await res.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });
      await handleUploadSignatureFile(file);
    } catch (err: any) {
      setErrorMsg("Failed to upload drawn signature.");
    }
  };

  const handleSaveStore = async (data: {
    displayName: string;
    description?: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
  }) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await updateStore({
        displayName: data.displayName,
        description: data.description,
        address: {
          street1: data.street1,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: "India",
        },
      }).unwrap();
      setSuccessMsg("Store details & pickup address saved successfully!");
      await refetchSeller();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save store details.");
    }
  };

  const handleSaveBank = async (data: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  }) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await addBankAccount(data).unwrap();
      setSuccessMsg("Bank account saved successfully!");
      await refetchSeller();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to save bank account.");
    }
  };

  const isStoreCompleted = !!sellerData?.seller?.store?.addressId;
  const isBankCompleted = (sellerData?.seller?.bankAccounts?.length || 0) > 0;
  const isFormValid = gstinVerified && !!signatureUploaded && isStoreCompleted && isBankCompleted;

  // Submit and route to dashboard
  const handleGoToDashboard = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!gstinVerified || !signatureUploaded) {
      setErrorMsg("Please complete GSTIN verification and attach your signature.");
      return;
    }

    if (!isStoreCompleted) {
      setErrorMsg("Please complete Store Setup & Pickup Address.");
      return;
    }

    if (!isBankCompleted) {
      setErrorMsg("Please add Bank Account details.");
      return;
    }

    try {
      await submitOnboarding().unwrap();
      await refetchSeller();
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to finalize onboarding.");
    }
  };

  if (userLoading || sellerLoading || isSubmitting) {
    return (
      <div className="flex min-h-screen bg-zinc-50 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500">Loading your onboarding dashboard...</p>
        </div>
      </div>
    );
  }

  // Dynamic progress calculation
  let progress = 20;
  if (gstinVerified) progress += 20;
  if (signatureUploaded) progress += 20;
  if (isStoreCompleted) progress += 20;
  if (isBankCompleted) progress += 20;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 font-sans transition-colors duration-300">
      {/* 1. Header Bar */}
      <Header
        userName={userData?.user?.firstName ? `${userData.user.firstName} ${userData.user.lastName || ""}`.trim() : "Abhishek Jaiswar"}
        sellerId={sellerData?.seller?.id ? `SE-${sellerData.seller.id.substring(0, 6).toUpperCase()}` : "SE123456"}
      />

      {/* 2. Unified Grid Layout with Step-Wise Middle Form */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Progress & Interactive Step Sidebar (col-span-3) */}
        <div className="lg:col-span-3">
          <Sidebar
            progressPercentage={progress}
            mobileVerified={true}
            emailVerified={true}
            idVerified={gstinVerified}
            signatureVerified={!!signatureUploaded}
            storeNameCompleted={isStoreCompleted}
            addressCompleted={isBankCompleted}
            activeStep={currentStep}
            onSelectStep={setCurrentStep}
          />
        </div>

        {/* Middle Column: Step-Wise Form Display (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Greeting Header */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider">
                Step {currentStep} of 4
              </span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              Hello, {userData?.user?.firstName || "Abhishek"}! 👋
            </h1>
            <p className="text-xs text-zinc-400 font-bold">
              Complete your seller details step-by-step to start selling.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-red-500/20 bg-red-50 text-red-600 text-xs font-semibold text-left">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-50 text-emerald-600 text-xs font-semibold text-left">
              <CheckCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Account & Contact Verification */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <VerificationSection
                phoneNumber={sellerData?.seller?.contactPhone || "+91 85911 51528"}
                emailAddress={userData?.user?.email || "abhisheknduw@gmail.com"}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex h-12 items-center gap-2 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <span>Next: Business & Signature →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Business GSTIN & e-Signature */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <BusinessVerification
                gstin={gstin}
                setGstin={setGstin}
                gstinVerified={gstinVerified}
                gstinDetails={gstinDetails}
                isVerifyingGstin={isVerifyingGstin}
                onVerifyGstin={handleVerifyGstin}
                categoryMode={categoryMode}
                setCategoryMode={setCategoryMode}
              />

              <SignatureSection
                canvasSignature={canvasSignature}
                signatureUploaded={signatureUploaded}
                isUploading={isUploading}
                isSubmitting={isSubmitting}
                onUploadSignature={handleUploadSignatureFile}
                onClearCanvas={clearCanvas}
                onSaveCanvas={saveCanvasSignature}
                onGoToDashboard={() => setCurrentStep(3)}
                canvasRef={canvasRef}
                isDrawing={isDrawing}
                startDrawing={startDrawing}
                draw={draw}
                stopDrawing={stopDrawing}
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex h-11 items-center gap-2 px-5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!gstinVerified || !signatureUploaded}
                  className="flex h-12 items-center gap-2 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>Next: Store & Bank Setup →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Store & Bank Account Setup */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <StoreDetailsSection
                initialDisplayName={sellerData?.seller?.store?.displayName}
                initialDescription={sellerData?.seller?.store?.description}
                initialStreet={sellerData?.seller?.store?.address?.street1}
                initialCity={sellerData?.seller?.store?.address?.city}
                initialState={sellerData?.seller?.store?.address?.state}
                initialPostalCode={sellerData?.seller?.store?.address?.postalCode}
                initialBankName={sellerData?.seller?.bankAccounts?.[0]?.bankName}
                initialAccountNumber={sellerData?.seller?.bankAccounts?.[0]?.accountNumber}
                initialIfscCode={sellerData?.seller?.bankAccounts?.[0]?.ifscCode}
                initialHolderName={sellerData?.seller?.bankAccounts?.[0]?.accountHolderName}
                storeCompleted={isStoreCompleted}
                bankCompleted={isBankCompleted}
                onSaveStore={handleSaveStore}
                onSaveBank={handleSaveBank}
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex h-11 items-center gap-2 px-5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  disabled={!isStoreCompleted || !isBankCompleted}
                  className="flex h-12 items-center gap-2 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>Proceed to Final Review →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Final Review & Submission */}
          {currentStep === 4 && (
            <ReviewSummarySection
              userName={userData?.user?.firstName ? `${userData.user.firstName} ${userData.user.lastName || ""}`.trim() : "Seller Partner"}
              email={userData?.user?.email}
              phone={sellerData?.seller?.contactPhone || "+91 85911 51528"}
              businessName={sellerData?.seller?.businessName}
              businessType={sellerData?.seller?.businessType}
              gstin={sellerData?.seller?.gstin || "Verified GSTIN"}
              signatureAttached={!!signatureUploaded}
              storeName={sellerData?.seller?.store?.displayName}
              pickupAddress={sellerData?.seller?.store?.address ? `${sellerData.seller.store.address.street1}, ${sellerData.seller.store.address.city}, ${sellerData.seller.store.address.state}` : "Configured"}
              bankName={sellerData?.seller?.bankAccounts?.[0]?.bankName}
              accountNumber={sellerData?.seller?.bankAccounts?.[0]?.accountNumber}
              isSubmitting={isSubmitting}
              onPrevStep={() => setCurrentStep(3)}
              onSubmitOnboarding={handleGoToDashboard}
            />
          )}
        </div>

        {/* Right Column: Widgets (col-span-3) */}
        <div className="lg:col-span-3">
          <RightPanel
            onPreviewStore={() => router.push(`/store/${sellerData?.seller?.store?.slug || "draft"}`)}
            onGoToDashboard={handleGoToDashboard}
            isDashboardEnabled={isFormValid}
          />
        </div>
      </main>

      {/* Floating help toggle */}
      <HelpFloatingButton />
    </div>
  );
}
