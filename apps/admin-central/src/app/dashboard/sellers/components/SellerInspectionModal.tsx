"use client"

import React, { useState } from "react"
import {
  Seller,
  VerificationStepKey,
  useVerifySellerAdminMutation,
} from "@workspace/store"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  StoreIcon,
  Building2Icon,
  CreditCardIcon,
  FileCheckIcon,
  CheckCircle2Icon,
  XCircleIcon,
  Loader2Icon,
  XIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  AlertTriangleIcon,
  RotateCcwIcon,
  ClockIcon,
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  InfoIcon,
} from "lucide-react"

interface SellerInspectionModalProps {
  seller: Seller | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Preset Rejection Reasons by Step for 1-click precision
const PRESET_REJECTION_REASONS: Record<VerificationStepKey, string[]> = {
  business: [
    "GSTIN number is invalid or unverified",
    "Business legal name mismatch with GST certificate",
    "Invalid business type selection",
    "Contact phone/email is unreachable or invalid",
  ],
  store: [
    "Incomplete pickup address (missing house/street number)",
    "Store name violates marketplace naming guidelines",
    "Invalid postal code / pincode for address",
    "Pickup location outside serviceable coverage area",
  ],
  bank: [
    "IFSC code does not match specified bank branch",
    "Account holder name mismatch with business name",
    "Invalid account number format",
    "Cancelled cheque missing or unreadable",
  ],
  documents: [
    "Uploaded e-Signature is blurry or truncated",
    "Signature does not match authorized signatory",
    "Document proof file is corrupted or unreadable",
    "Expired business license / authorization proof",
  ],
}

export function SellerInspectionModal({
  seller,
  isOpen,
  onClose,
  onSuccess,
}: SellerInspectionModalProps) {
  const [activeTab, setActiveTab] = useState<VerificationStepKey>("business")

  // Per-step rejection state
  const [stepRejectReasonInput, setStepRejectReasonInput] = useState<string>("")
  const [rejectingStep, setRejectingStep] = useState<VerificationStepKey | null>(null)

  // Global rejection state
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionRemarks, setRejectionRemarks] = useState("")

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [verifySeller, { isLoading }] = useVerifySellerAdminMutation()

  if (!isOpen || !seller) return null

  const verification = seller.verification

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Step status getters
  const getStepStatus = (step: VerificationStepKey) => {
    if (!verification) return "PENDING"
    switch (step) {
      case "business":
        return verification.businessStatus || "PENDING"
      case "store":
        return verification.storeStatus || "PENDING"
      case "bank":
        return verification.bankStatus || "PENDING"
      case "documents":
        return verification.documentsStatus || "PENDING"
    }
  }

  const getStepRejectionReason = (step: VerificationStepKey) => {
    if (!verification) return null
    switch (step) {
      case "business":
        return verification.businessRejectionReason
      case "store":
        return verification.storeRejectionReason
      case "bank":
        return verification.bankRejectionReason
      case "documents":
        return verification.documentsRejectionReason
    }
  }

  const steps: VerificationStepKey[] = ["business", "store", "bank", "documents"]
  const approvedStepsCount = steps.filter((s) => getStepStatus(s) === "APPROVED").length
  const rejectedStepsCount = steps.filter((s) => getStepStatus(s) === "REJECTED").length
  const pendingStepsCount = steps.filter((s) => getStepStatus(s) === "PENDING" || getStepStatus(s) === "UNDER_REVIEW").length
  const progressPercent = Math.round((approvedStepsCount / steps.length) * 100)

  // API handlers
  const handleApproveStep = async (step: VerificationStepKey) => {
    setErrorMsg("")
    setSuccessMsg("")
    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          stepDecisions: {
            [step]: {
              status: "APPROVED",
            },
          },
        },
      }).unwrap()
      setSuccessMsg(`Step "${step.toUpperCase()}" marked as Approved.`)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to approve step.")
    }
  }

  const handleRejectStepSubmit = async (reasonText: string, step: VerificationStepKey) => {
    setErrorMsg("")
    setSuccessMsg("")
    if (!reasonText.trim()) {
      setErrorMsg("Please select or enter a rejection reason.")
      return
    }

    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          stepDecisions: {
            [step]: {
              status: "REJECTED",
              rejectionReason: reasonText.trim(),
            },
          },
        },
      }).unwrap()
      setSuccessMsg(`Step "${step.toUpperCase()}" rejected with reason.`)
      setRejectingStep(null)
      setStepRejectReasonInput("")
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to submit step rejection.")
    }
  }

  const handleReviveStep = async (step: VerificationStepKey) => {
    setErrorMsg("")
    setSuccessMsg("")
    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          reviveStep: step,
        },
      }).unwrap()
      setSuccessMsg(`Step "${step.toUpperCase()}" revived back to Pending review!`)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to revive step.")
    }
  }

  const handleReviveSeller = async () => {
    setErrorMsg("")
    setSuccessMsg("")
    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          reviveSeller: true,
        },
      }).unwrap()
      setSuccessMsg("Seller application revived back to Under Review!")
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to revive seller application.")
    }
  }

  const handleApproveEntireSeller = async () => {
    setErrorMsg("")
    setSuccessMsg("")
    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          status: "APPROVED",
        },
      }).unwrap()
      setSuccessMsg("Merchant application approved successfully!")
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to approve seller.")
    }
  }

  const handleRejectEntireSeller = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    if (!rejectionRemarks.trim()) {
      setErrorMsg("Please enter remarks explaining why this application is rejected.")
      return
    }

    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          status: "REJECTED",
          remarks: rejectionRemarks.trim(),
        },
      }).unwrap()
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to submit rejection.")
    }
  }

  const sigDoc = seller.verification?.documents?.find((d) => d.type === "SIGNATURE")

  const renderStepBadge = (step: VerificationStepKey) => {
    const st = getStepStatus(step)
    if (st === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2Icon className="size-3.5" />
          Verified
        </span>
      )
    }
    if (st === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive border border-destructive/20">
          <XCircleIcon className="size-3.5" />
          Rejected
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <ClockIcon className="size-3.5" />
        Pending
      </span>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Increased width to max-w-6xl for precision layout */}
      <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-card border shadow-2xl text-card-foreground flex flex-col h-[90vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs border border-primary/20">
              <StoreIcon className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                  {seller.businessName}
                </h2>
                {seller.status === "APPROVED" && <Badge variant="success" className="px-2.5 py-0.5">Approved Merchant</Badge>}
                {seller.status === "UNDER_REVIEW" && <Badge variant="warning" className="px-2.5 py-0.5">Under Review</Badge>}
                {seller.status === "REJECTED" && <Badge variant="destructive" className="px-2.5 py-0.5">Action Needed</Badge>}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 font-medium">
                <span>Seller ID: <code className="font-mono text-foreground font-semibold">{seller.id}</code></span>
                <span>•</span>
                <span>Type: <strong>{seller.businessType}</strong></span>
                {seller.contactEmail && (
                  <>
                    <span>•</span>
                    <span>Email: <strong>{seller.contactEmail}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Dynamic Stepper Progress Bar */}
        <div className="border-b px-6 py-3.5 bg-muted/10 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheckIcon className="size-4 text-primary" />
              <span>Step-by-Step Verification Status:</span>
              <span className="text-muted-foreground font-normal">
                ({approvedStepsCount} of {steps.length} Steps Approved — {progressPercent}%)
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2Icon className="size-3.5" />
                {approvedStepsCount} Verified
              </span>
              {rejectedStepsCount > 0 && (
                <span className="flex items-center gap-1.5 text-destructive font-bold">
                  <XCircleIcon className="size-3.5" />
                  {rejectedStepsCount} Rejected
                </span>
              )}
              {pendingStepsCount > 0 && (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <ClockIcon className="size-3.5" />
                  {pendingStepsCount} Pending
                </span>
              )}
            </div>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted border border-muted/50">
            <div
              className={`h-full transition-all duration-300 ${
                rejectedStepsCount > 0
                  ? "bg-amber-500"
                  : progressPercent === 100
                  ? "bg-emerald-500"
                  : "bg-primary"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Global Alert Notices */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg("")} className="hover:opacity-75 cursor-pointer">
              <XIcon className="size-4" />
            </button>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="size-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg("")} className="hover:opacity-75 cursor-pointer">
              <XIcon className="size-4" />
            </button>
          </div>
        )}

        {/* Main Split Content Area */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x">
          
          {/* LEFT SECTION: Data Inspection Deck (approx 65% / 8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full overflow-hidden bg-background">
            
            {/* Step Navigation Tabs */}
            <div className="flex border-b px-6 pt-3 bg-muted/10 gap-2 overflow-x-auto text-xs font-semibold shrink-0">
              <button
                onClick={() => { setActiveTab("business"); setShowRejectForm(false) }}
                className={`flex items-center gap-2.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "business"
                    ? "border-primary text-primary font-bold bg-background rounded-t-xl shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-xl"
                }`}
              >
                <Building2Icon className="size-4" />
                <span>1. Business Details</span>
                {renderStepBadge("business")}
              </button>

              <button
                onClick={() => { setActiveTab("store"); setShowRejectForm(false) }}
                className={`flex items-center gap-2.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "store"
                    ? "border-primary text-primary font-bold bg-background rounded-t-xl shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-xl"
                }`}
              >
                <StoreIcon className="size-4" />
                <span>2. Store & Address</span>
                {renderStepBadge("store")}
              </button>

              <button
                onClick={() => { setActiveTab("bank"); setShowRejectForm(false) }}
                className={`flex items-center gap-2.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "bank"
                    ? "border-primary text-primary font-bold bg-background rounded-t-xl shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-xl"
                }`}
              >
                <CreditCardIcon className="size-4" />
                <span>3. Bank Account</span>
                {renderStepBadge("bank")}
              </button>

              <button
                onClick={() => { setActiveTab("documents"); setShowRejectForm(false) }}
                className={`flex items-center gap-2.5 px-4 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === "documents"
                    ? "border-primary text-primary font-bold bg-background rounded-t-xl shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-xl"
                }`}
              >
                <FileCheckIcon className="size-4" />
                <span>4. Documents</span>
                {renderStepBadge("documents")}
              </button>
            </div>

            {/* Left Data View Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {showRejectForm ? (
                /* Global Application Rejection Form */
                <form onSubmit={handleRejectEntireSeller} className="space-y-4 animate-in fade-in duration-150 max-w-xl">
                  <div className="rounded-xl p-4 bg-destructive/5 border border-destructive/20 space-y-2">
                    <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
                      <XCircleIcon className="size-4" />
                      Reject Entire Merchant Application
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Provide clear remarks explaining overall why this merchant application is rejected.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Rejection Reason / Remarks
                    </label>
                    <textarea
                      value={rejectionRemarks}
                      onChange={(e) => setRejectionRemarks(e.target.value)}
                      placeholder="e.g. Invalid GSTIN or corrupted signature document. Please re-apply with valid details."
                      rows={4}
                      required
                      className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRejectForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      disabled={isLoading}
                      className="gap-1.5"
                    >
                      {isLoading ? <Loader2Icon className="size-3.5 animate-spin" /> : <XCircleIcon className="size-3.5" />}
                      Submit Rejection
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {/* TAB 1: Business Details Data */}
                  {activeTab === "business" && (
                    <div className="space-y-5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Building2Icon className="size-4 text-primary" />
                          Business Identity & Tax Information
                        </h3>
                        <span className="text-xs text-muted-foreground">Step 1 of 4</span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                          <span className="text-muted-foreground font-medium">Business Registered Name</span>
                          <div className="font-bold text-sm text-foreground flex items-center justify-between">
                            <span>{seller.businessName}</span>
                            <button
                              onClick={() => copyToClipboard(seller.businessName, "businessName")}
                              className="text-muted-foreground hover:text-foreground"
                              title="Copy Business Name"
                            >
                              {copiedField === "businessName" ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                          <span className="text-muted-foreground font-medium">Legal Structure Type</span>
                          <div className="font-bold text-sm text-foreground">{seller.businessType}</div>
                        </div>

                        <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                          <span className="text-muted-foreground font-medium">GSTIN Tax Registration</span>
                          <div className="font-bold text-sm font-mono text-primary flex items-center justify-between">
                            <span>{seller.gstin || "Not Provided"}</span>
                            {seller.gstin && (
                              <button
                                onClick={() => copyToClipboard(seller.gstin!, "gstin")}
                                className="text-muted-foreground hover:text-foreground"
                                title="Copy GSTIN"
                              >
                                {copiedField === "gstin" ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                          <span className="text-muted-foreground font-medium">Primary Contact Phone</span>
                          <div className="font-semibold text-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <PhoneIcon className="size-3.5 text-primary" />
                              {seller.contactPhone || "N/A"}
                            </span>
                            {seller.contactPhone && (
                              <button
                                onClick={() => copyToClipboard(seller.contactPhone!, "phone")}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {copiedField === "phone" ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="rounded-xl border p-4 bg-muted/20 space-y-1 sm:col-span-2">
                          <span className="text-muted-foreground font-medium">Official Contact Email</span>
                          <div className="font-semibold text-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <MailIcon className="size-3.5 text-primary" />
                              {seller.contactEmail || "N/A"}
                            </span>
                            {seller.contactEmail && (
                              <button
                                onClick={() => copyToClipboard(seller.contactEmail!, "email")}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                {copiedField === "email" ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Store & Address Data */}
                  {activeTab === "store" && (
                    <div className="space-y-5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <StoreIcon className="size-4 text-primary" />
                          Storefront & Warehouse Pickup Address
                        </h3>
                        <span className="text-xs text-muted-foreground">Step 2 of 4</span>
                      </div>

                      {seller.store ? (
                        <>
                          <div className="grid gap-4 sm:grid-cols-2 text-xs">
                            <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                              <span className="text-muted-foreground font-medium">Store Display Name</span>
                              <div className="font-bold text-sm text-foreground">{seller.store.displayName}</div>
                            </div>

                            <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                              <span className="text-muted-foreground font-medium">Store URL Handle</span>
                              <div className="font-mono text-primary font-bold flex items-center justify-between">
                                <span>/store/{seller.store.slug}</span>
                                <a
                                  href={`/store/${seller.store.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <ExternalLinkIcon className="size-3.5" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border p-4 bg-muted/20 space-y-2 text-xs">
                            <span className="text-muted-foreground font-bold flex items-center gap-1.5">
                              <MapPinIcon className="size-4 text-primary" />
                              Primary Warehouse / Pickup Location Address
                            </span>
                            {seller.store.address ? (
                              <div className="font-medium text-foreground leading-relaxed p-3 rounded-lg border bg-background space-y-1">
                                <div className="font-bold text-foreground">{seller.store.address.street1}</div>
                                {seller.store.address.street2 && (
                                  <div className="text-muted-foreground">{seller.store.address.street2}</div>
                                )}
                                <div className="text-muted-foreground">
                                  {seller.store.address.city}, {seller.store.address.state} —{" "}
                                  <code className="font-mono font-bold text-foreground">{seller.store.address.postalCode}</code>
                                </div>
                                <div className="text-xs text-primary font-bold pt-1">
                                  Country: {seller.store.address.country}
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground italic p-4 text-center rounded-lg border bg-background">
                                Address details missing or not submitted yet
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">No store details uploaded</div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: Bank Account Data */}
                  {activeTab === "bank" && (
                    <div className="space-y-5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <CreditCardIcon className="size-4 text-primary" />
                          Bank Settlement Account Details
                        </h3>
                        <span className="text-xs text-muted-foreground">Step 3 of 4</span>
                      </div>

                      {seller.bankAccounts && seller.bankAccounts.length > 0 ? (
                        seller.bankAccounts.map((acc) => (
                          <div key={acc.id} className="rounded-xl border p-4 bg-muted/20 space-y-3 text-xs">
                            <div className="flex items-center justify-between border-b pb-2">
                              <div className="font-extrabold text-sm text-foreground flex items-center gap-2">
                                <CreditCardIcon className="size-4 text-primary" />
                                {acc.bankName}
                              </div>
                              {acc.isPrimary && <Badge variant="secondary">Primary Account</Badge>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <span className="text-muted-foreground">Account Holder Name</span>
                                <div className="font-bold text-foreground text-xs mt-0.5">{acc.accountHolderName}</div>
                              </div>

                              <div>
                                <span className="text-muted-foreground">Account Number</span>
                                <div className="font-mono font-bold text-foreground text-xs mt-0.5 flex items-center gap-2">
                                  <span>{acc.accountNumber}</span>
                                  <button
                                    onClick={() => copyToClipboard(acc.accountNumber, `acc_${acc.id}`)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    {copiedField === `acc_${acc.id}` ? <CheckIcon className="size-3 text-emerald-500" /> : <CopyIcon className="size-3" />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <span className="text-muted-foreground">Bank IFSC Code</span>
                                <div className="font-mono font-bold text-primary text-xs mt-0.5 flex items-center gap-2">
                                  <span>{acc.ifscCode}</span>
                                  <button
                                    onClick={() => copyToClipboard(acc.ifscCode, `ifsc_${acc.id}`)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    {copiedField === `ifsc_${acc.id}` ? <CheckIcon className="size-3 text-emerald-500" /> : <CopyIcon className="size-3" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">No bank account details uploaded</div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: Documents Data */}
                  {activeTab === "documents" && (
                    <div className="space-y-5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <FileCheckIcon className="size-4 text-primary" />
                          Verification Proofs & Authorized Signature
                        </h3>
                        <span className="text-xs text-muted-foreground">Step 4 of 4</span>
                      </div>

                      {sigDoc ? (
                        <div className="rounded-xl border p-4 bg-muted/20 space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground flex items-center gap-2">
                              <FileCheckIcon className="size-4 text-primary" />
                              Uploaded e-Signature Document
                            </span>
                            <span className="text-muted-foreground font-mono">{sigDoc.media.fileName}</span>
                          </div>

                          <div className="rounded-xl border bg-white p-6 flex flex-col items-center justify-center min-h-[160px] shadow-inner">
                            <img
                              src={sigDoc.media.url || `http://localhost:5000/uploads/${sigDoc.media.fileName}`}
                              alt="Seller Signature Proof"
                              className="max-h-36 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none'
                              }}
                            />
                            <div className="text-xs text-zinc-500 font-mono mt-2">
                              {sigDoc.media.fileName} ({sigDoc.media.mimeType})
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">No signature file uploaded</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT SECTION: Step Decision & Progressive Revive Sidebar (approx 35% / 4-5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full bg-muted/10 p-6 space-y-5 overflow-y-auto">
            
            {/* Step Decision Card */}
            <div className="rounded-xl border bg-card p-4 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                  Review Step: {activeTab}
                </span>
                {renderStepBadge(activeTab)}
              </div>

              {/* Current Rejection Reason Callout if rejected */}
              {getStepRejectionReason(activeTab) && (
                <div className="rounded-lg p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <XCircleIcon className="size-4 shrink-0" />
                    Current Step Rejection Reason:
                  </div>
                  <p className="font-medium leading-relaxed pl-5.5">
                    &quot;{getStepRejectionReason(activeTab)}&quot;
                  </p>
                </div>
              )}

              {/* Action Buttons for active step */}
              <div className="space-y-2">
                {getStepStatus(activeTab) === "REJECTED" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReviveStep(activeTab)}
                    disabled={isLoading}
                    className="w-full gap-2 text-primary border-primary/30 hover:bg-primary/10 font-bold"
                  >
                    <RotateCcwIcon className="size-4" />
                    Revive & Reset Step to Pending
                  </Button>
                ) : getStepStatus(activeTab) === "APPROVED" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRejectingStep(activeTab)}
                    disabled={isLoading}
                    className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 font-bold"
                  >
                    <XCircleIcon className="size-4" />
                    Change to Rejected
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectingStep(activeTab)}
                      disabled={isLoading}
                      className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 font-bold"
                    >
                      <XCircleIcon className="size-4" />
                      Reject Step
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleApproveStep(activeTab)}
                      disabled={isLoading}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      <CheckCircle2Icon className="size-4" />
                      Approve Step
                    </Button>
                  </div>
                )}
              </div>

              {/* Inline Step Rejection Preset Reason Picker */}
              {rejectingStep === activeTab && (
                <div className="space-y-3 pt-3 border-t animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-destructive flex items-center justify-between">
                    <span>Select Rejection Reason for {activeTab.toUpperCase()}:</span>
                    <button
                      onClick={() => setRejectingStep(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>

                  {/* Preset Chip Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-muted-foreground font-semibold">1-Click Presets:</span>
                    <div className="space-y-1.5">
                      {PRESET_REJECTION_REASONS[activeTab]?.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleRejectStepSubmit(preset, activeTab)}
                          className="w-full text-left p-2 rounded-lg border text-xs text-foreground bg-muted/20 hover:bg-destructive/10 hover:border-destructive/30 transition-all font-medium flex items-center justify-between group cursor-pointer"
                        >
                          <span className="line-clamp-2">{preset}</span>
                          <XCircleIcon className="size-3.5 text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Reason Box */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-muted-foreground font-semibold">Or enter custom reason:</span>
                    <textarea
                      value={stepRejectReasonInput}
                      onChange={(e) => setStepRejectReasonInput(e.target.value)}
                      placeholder="Type specific issue details..."
                      rows={2}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/30"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectStepSubmit(stepRejectReasonInput, activeTab)}
                      disabled={isLoading || !stepRejectReasonInput.trim()}
                      className="w-full gap-1.5 mt-1"
                    >
                      {isLoading ? <Loader2Icon className="size-3.5 animate-spin" /> : <XCircleIcon className="size-3.5" />}
                      Submit Custom Rejection
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Overall Audit Summary Checklist */}
            <div className="rounded-xl border bg-card p-4 space-y-3 shadow-sm">
              <span className="font-bold text-xs text-foreground uppercase tracking-wider block border-b pb-2">
                All Steps Overview
              </span>

              <div className="space-y-2 text-xs">
                {steps.map((st) => (
                  <div
                    key={st}
                    onClick={() => setActiveTab(st)}
                    className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      activeTab === st ? "bg-muted/40 border-primary/50" : "bg-muted/10 hover:bg-muted/20"
                    }`}
                  >
                    <span className="capitalize font-semibold text-foreground">{st} Details</span>
                    {renderStepBadge(st)}
                  </div>
                ))}
              </div>
            </div>

            {/* Info Hint */}
            <div className="rounded-xl p-3.5 bg-primary/5 border border-primary/10 text-xs text-muted-foreground space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <InfoIcon className="size-4" />
                Progressive Verification Rule
              </div>
              <p className="text-[11px] leading-relaxed">
                If any step is rejected, the seller application requires revisions. Once all 4 steps are verified, the merchant can be fully approved.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Global Actions */}
        {!showRejectForm && (
          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/20 shrink-0">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              {seller.status === "REJECTED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReviveSeller}
                  disabled={isLoading}
                  className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10 font-bold"
                >
                  <RotateCcwIcon className="size-4" />
                  Revive Seller Application
                </Button>
              )}
            </div>

            {seller.status !== "APPROVED" && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectForm(true)}
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 font-bold"
                >
                  <XCircleIcon className="size-4" />
                  Reject Entire Application
                </Button>

                <Button
                  size="sm"
                  onClick={handleApproveEntireSeller}
                  disabled={isLoading}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5"
                >
                  {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <CheckCircle2Icon className="size-4" />}
                  Approve Entire Merchant
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
