"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  useGetMeQuery,
  useGetSellerMeQuery,
  useOnboardSellerMutation,
  useUpdateSellerProfileMutation,
  useAddBankAccountMutation,
  useUploadDocumentMutation,
  useLazyVerifyGstinQuery,
  useAppDispatch,
  useAppSelector,
  setOnboardingStep,
  setWelcomeView,
  startOnboarding,
} from "@workspace/store"
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"

import { Logo } from "@workspace/ui/components/logo"
import { OnboardGstinVerification } from "./components/OnboardGstinVerification"
import { OnboardSignaturePad } from "./components/OnboardSignaturePad"
import { HelpFloatingButton } from "./components/HelpFloatingButton"
import { OnboardWelcomeBanner } from "./components/OnboardWelcomeBanner"
import { OnboardBankForm } from "./components/OnboardBankForm"
import { OnboardLegalReview } from "./components/OnboardLegalReview"

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  // Redux onboarding state
  const { currentStep, isWelcomeView } = useAppSelector(
    (state) => state.onboarding
  )

  // Auth & Seller queries
  const { data: userData, isLoading: userLoading } = useGetMeQuery()
  const { data: sellerData, refetch: refetchSeller } = useGetSellerMeQuery(
    undefined,
    {
      skip: !userData?.user,
    }
  )

  const [onboardSeller] = useOnboardSellerMutation()
  const [updateProfile] = useUpdateSellerProfileMutation()
  const [addBankAccount] = useAddBankAccountMutation()
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation()
  const [triggerVerifyGstin, { isFetching: isVerifyingGstin }] =
    useLazyVerifyGstinQuery()

  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Business & GSTIN states
  const [gstin, setGstin] = useState("")
  const [gstinVerified, setGstinVerified] = useState(false)
  const [gstinDetails, setGstinDetails] = useState<{
    tradeName: string
    legalName: string
    businessType: string
    state: string
    status: string
  } | null>(null)

  // Signature states
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasSignature, setCanvasSignature] = useState<string | null>(null)
  const [signatureUploaded, setSignatureUploaded] = useState<string | null>(
    null
  )

  // Bank Account states
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [accountHolderName, setAccountHolderName] = useState("")
  const [isSavingBank, setIsSavingBank] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !userData?.user) {
      router.push("/login")
    }
  }, [userData, userLoading, router])

  // Sync step from URL parameter (e.g. /onboard?step=2) on mount or refresh
  useEffect(() => {
    const stepParam = searchParams.get("step")
    if (stepParam) {
      const stepNum = parseInt(stepParam, 10)
      if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 3) {
        dispatch(setWelcomeView(false))
        dispatch(setOnboardingStep(stepNum))
      }
    }
  }, [searchParams, dispatch])

  // Sync profile details and auto-resume steps
  useEffect(() => {
    if (sellerData?.seller) {
      const seller = sellerData.seller
      setGstin(seller.gstin || "")
      if (seller.gstin) {
        setGstinVerified(true)
        setGstinDetails({
          tradeName: seller.businessName,
          legalName: seller.businessName,
          businessType: seller.businessType,
          state: seller.store?.address?.state || "N/A",
          status: "ACTIVE",
        })
      }

      // Signature check
      const docs = seller.verification?.documents || []
      const sigDoc = docs.find((d: any) => d.type === "SIGNATURE")
      if (sigDoc) {
        setSignatureUploaded(sigDoc.media.fileName)
      }

      // Bank account check
      if (seller.bankAccounts && seller.bankAccounts.length > 0) {
        const bank = seller.bankAccounts[0]
        if (bank) {
          setBankName(bank.bankName || "")
          setAccountNumber(bank.accountNumber || "")
          setIfscCode(bank.ifscCode || "")
          setAccountHolderName(bank.accountHolderName || "")
        }
      }

      // Smart Navigation based on DB completion
      if (
        seller.status === "APPROVED" ||
        seller.status === "UNDER_REVIEW" ||
        seller.status === "REJECTED"
      ) {
        router.push("/dashboard")
      } else if (
        seller.gstin &&
        seller.bankAccounts &&
        seller.bankAccounts.length > 0
      ) {
        router.push("/store-setup")
      } else if (seller.gstin && !searchParams.get("step")) {
        // If Business details (GSTIN) are done and no explicit URL step is set, resume at Step 2 (Bank Details)
        dispatch(setWelcomeView(false))
        dispatch(setOnboardingStep(2))
        const params = new URLSearchParams(searchParams.toString())
        params.set("step", "2")
        router.replace(`${pathname}?${params.toString()}`)
      }
    }
  }, [sellerData, router, dispatch, pathname, searchParams])

  // Update step in Redux AND push to URL query string
  const handleStepChange = (step: number) => {
    dispatch(setOnboardingStep(step))
    dispatch(setWelcomeView(false))
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", step.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleStartOnboarding = () => {
    dispatch(startOnboarding())
    dispatch(setOnboardingStep(1))
    const params = new URLSearchParams(searchParams.toString())
    params.set("step", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCancelOnboarding = () => {
    dispatch(setWelcomeView(true))
    dispatch(setOnboardingStep(1))
    router.push("/")
  }

  // GSTIN Verification
  const handleVerifyGstin = async () => {
    setErrorMsg("")
    setSuccessMsg("")
    if (!gstin.trim() || gstin.trim().length !== 15) {
      setErrorMsg("Please enter a valid 15-digit GSTIN number.")
      return
    }

    try {
      const response = await triggerVerifyGstin(gstin.trim()).unwrap()
      setGstinVerified(true)
      setGstinDetails({
        tradeName: response.tradeName,
        legalName: response.legalName,
        businessType: response.businessType,
        state: response.state,
        status: response.status,
      })
      setSuccessMsg(
        `GSTIN Verified! Registered Legal Name: ${response.tradeName}`
      )

      if (!sellerData?.seller) {
        await onboardSeller({
          businessName: response.tradeName,
          businessType: response.businessType as any,
          gstin: gstin.trim(),
        }).unwrap()
      } else {
        await updateProfile({
          businessName: response.tradeName,
          businessType: response.businessType as any,
          gstin: gstin.trim(),
        }).unwrap()
      }
      await refetchSeller()
    } catch (err: any) {
      setGstinVerified(false)
      setErrorMsg(
        err?.data?.message || err?.message || "GSTIN verification failed."
      )
    }
  }

  // Signature File Upload
  const handleUploadSignatureFile = async (file: File) => {
    setErrorMsg("")
    setSuccessMsg("")
    if (!file) return

    const formData = new FormData()
    formData.append("type", "SIGNATURE")
    formData.append("file", file)

    try {
      const response = await uploadDocument(formData).unwrap()
      setSignatureUploaded(response.document.media.fileName)
      setSuccessMsg("Signature uploaded successfully!")
      await refetchSeller()
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to upload signature."
      )
    }
  }

  // Signature Canvas Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineWidth = 2.5
    ctx.lineCap = "round"
    ctx.strokeStyle = "#4f46e5"
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      setCanvasSignature(canvas.toDataURL())
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setCanvasSignature(null)
  }

  const saveCanvasSignature = async () => {
    if (!canvasSignature) return
    try {
      const blob = await (await fetch(canvasSignature)).blob()
      const file = new File([blob], "signature-drawn.png", {
        type: "image/png",
      })
      await handleUploadSignatureFile(file)
    } catch {
      setErrorMsg("Failed to save drawn signature.")
    }
  }

  // Bank Save Handler
  const handleSaveBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (
      !accountNumber.trim() ||
      !ifscCode.trim() ||
      !bankName.trim() ||
      !accountHolderName.trim()
    ) {
      setErrorMsg("All bank account fields are required.")
      return
    }

    try {
      setIsSavingBank(true)
      await addBankAccount({
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
      }).unwrap()
      await refetchSeller()
      setSuccessMsg("Bank Account details saved!")
      handleStepChange(3)
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to save bank details."
      )
    } finally {
      setIsSavingBank(false)
    }
  }

  const handleProceedToStoreSetup = () => {
    router.push("/store-setup")
  }

  // -------------------------------------------------------------
  // STEP 0: WELCOME & LAUNCH SCREEN (INSTRUCTIONS + START / CANCEL)
  // -------------------------------------------------------------
  if (isWelcomeView && !searchParams.get("step")) {
    return (
      <>
        <OnboardWelcomeBanner
          onStart={handleStartOnboarding}
          onCancel={handleCancelOnboarding}
        />
        <HelpFloatingButton />
      </>
    )
  }

  // -------------------------------------------------------------
  // STEP 1-3: CENTERED MINIMALIST DISTRACTION-FREE STEP UI
  // -------------------------------------------------------------
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-16 font-sans text-zinc-900 select-none">
      {/* Top Minimal Progress Bar Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200/80 bg-white px-6 py-4">
        <Logo size="md" descriptor="Seller Onboarding" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col space-x-10 text-right sm:block">
            <span className="text-xs font-bold text-zinc-800">
              Step {currentStep} of 3
            </span>
            <span className="text-[10px] font-semibold text-zinc-400">
              {currentStep === 1
                ? "Business & GSTIN Verification"
                : currentStep === 2
                  ? "Bank Payout Account"
                  : "Legal Confirmation"}
            </span>
          </div>

          <div className="h-2 w-20 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{
                width:
                  currentStep === 1
                    ? "33%"
                    : currentStep === 2
                      ? "66%"
                      : "100%",
              }}
            />
          </div>
        </div>
      </header>

      {/* CENTERED STEP CONTENT CONTAINER (NO CLUTTERED CARDS) */}
      <main className="mx-auto w-full max-w-xl flex-1 space-y-6 px-4 pt-8 text-left sm:px-6">
        {/* Error Notice */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Notice */}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: BUSINESS GSTIN & E-SIGNATURE */}
        {currentStep === 1 && (
          <div className="animate-fadeIn space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-zinc-900">
                1. Business & GSTIN Verification
              </h2>
              <p className="text-xs font-medium text-zinc-500">
                Verify your 15-digit GSTIN legal entity and attach an
                e-signature.
              </p>
            </div>

            <OnboardGstinVerification
              gstin={gstin}
              setGstin={setGstin}
              onVerify={handleVerifyGstin}
              isVerifying={isVerifyingGstin}
              verified={gstinVerified}
              details={gstinDetails}
            />

            <OnboardSignaturePad
              signatureUploaded={signatureUploaded}
              canvasSignature={canvasSignature}
              onUploadFile={handleUploadSignatureFile}
              onSaveCanvasSignature={saveCanvasSignature}
              clearCanvas={clearCanvas}
              isUploading={isUploading}
              canvasRef={canvasRef}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
            />

            <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
              <button
                type="button"
                onClick={handleCancelOnboarding}
                className="cursor-pointer text-xs font-bold text-zinc-500 hover:text-zinc-800"
              >
                Cancel & Exit
              </button>

              <button
                type="button"
                onClick={() => handleStepChange(2)}
                disabled={!gstinVerified || !signatureUploaded}
                className="flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-8 text-xs font-extrabold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                <span>Proceed to Bank Details</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BANK ACCOUNT DETAILS */}
        {currentStep === 2 && (
          <OnboardBankForm
            accountHolderName={accountHolderName}
            setAccountHolderName={setAccountHolderName}
            bankName={bankName}
            setBankName={setBankName}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            ifscCode={ifscCode}
            setIfscCode={setIfscCode}
            isSaving={isSavingBank}
            onSubmit={handleSaveBankSubmit}
            onBack={() => handleStepChange(1)}
          />
        )}

        {/* STEP 3: LEGAL REVIEW & PROCEED TO STOREFRONT SETUP */}
        {currentStep === 3 && (
          <OnboardLegalReview
            tradeName={
              gstinDetails?.tradeName || sellerData?.seller?.businessName
            }
            gstin={gstin}
            bankName={bankName}
            accountNumber={accountNumber}
            onBack={() => handleStepChange(2)}
            onProceed={handleProceedToStoreSetup}
          />
        )}
      </main>

      <HelpFloatingButton />
    </div>
  )
}

export default function SellerOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 font-sans text-zinc-500">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold">
            Loading Seller Portal...
          </span>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
