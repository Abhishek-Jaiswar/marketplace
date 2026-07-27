"use client"

import React, { useState } from "react"
import {
  Seller,
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
  UserIcon,
  MailIcon,
  PhoneIcon,
  AlertTriangleIcon,
} from "lucide-react"

interface SellerInspectionModalProps {
  seller: Seller | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SellerInspectionModal({
  seller,
  isOpen,
  onClose,
  onSuccess,
}: SellerInspectionModalProps) {
  const [activeTab, setActiveTab] = useState<"business" | "store" | "bank" | "documents">("business")
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectionRemarks, setRejectionRemarks] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [verifySeller, { isLoading }] = useVerifySellerAdminMutation()

  if (!isOpen || !seller) return null

  const handleApprove = async () => {
    setErrorMsg("")
    try {
      await verifySeller({
        sellerId: seller.id,
        body: {
          status: "APPROVED",
        },
      }).unwrap()
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to approve seller.")
    }
  }

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (!rejectionRemarks.trim()) {
      setErrorMsg("Please enter a reason for requesting revisions / rejecting.")
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card border shadow-2xl text-card-foreground flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <StoreIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {seller.businessName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>ID: {seller.id.substring(0, 8)}...</span>
                <span>•</span>
                {seller.status === "APPROVED" && <Badge variant="success">Approved</Badge>}
                {seller.status === "UNDER_REVIEW" && <Badge variant="warning">Under Review</Badge>}
                {seller.status === "REJECTED" && <Badge variant="destructive">Needs Attention</Badge>}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertTriangleIcon className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b px-6 pt-2 bg-muted/10 gap-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => { setActiveTab("business"); setShowRejectForm(false) }}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "business"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2Icon className="size-3.5" />
            Business Details
          </button>

          <button
            onClick={() => { setActiveTab("store"); setShowRejectForm(false) }}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "store"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <StoreIcon className="size-3.5" />
            Store & Address
          </button>

          <button
            onClick={() => { setActiveTab("bank"); setShowRejectForm(false) }}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "bank"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCardIcon className="size-3.5" />
            Bank Account
          </button>

          <button
            onClick={() => { setActiveTab("documents"); setShowRejectForm(false) }}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "documents"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheckIcon className="size-3.5" />
            Documents
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Reject Form Mode */}
          {showRejectForm ? (
            <form onSubmit={handleReject} className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-xl p-4 bg-destructive/5 border border-destructive/20 space-y-2">
                <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
                  <XCircleIcon className="size-4" />
                  Request Revisions / Reject Application
                </h3>
                <p className="text-xs text-muted-foreground">
                  Provide clear remarks explaining why this merchant application needs attention so the seller can fix it.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Rejection Reason / Remarks
                </label>
                <textarea
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  placeholder="e.g. Invalid GSTIN number or blurred signature image. Please re-upload clear proof."
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
              {/* TAB 1: Business Details */}
              {activeTab === "business" && (
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20">
                    <span className="text-muted-foreground font-medium">Business Name</span>
                    <div className="font-bold text-sm text-foreground">{seller.businessName}</div>
                  </div>

                  <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20">
                    <span className="text-muted-foreground font-medium">Business Type</span>
                    <div className="font-bold text-sm text-foreground">{seller.businessType}</div>
                  </div>

                  <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20">
                    <span className="text-muted-foreground font-medium">GSTIN Number</span>
                    <div className="font-bold text-sm font-mono text-foreground">
                      {seller.gstin || "Not Verified"}
                    </div>
                  </div>

                  <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20">
                    <span className="text-muted-foreground font-medium">Contact Phone</span>
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <PhoneIcon className="size-3.5 text-primary" />
                      {seller.contactPhone || "N/A"}
                    </div>
                  </div>

                  <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20 sm:col-span-2">
                    <span className="text-muted-foreground font-medium">Contact Email</span>
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <MailIcon className="size-3.5 text-primary" />
                      {seller.contactEmail || "N/A"}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Store & Address */}
              {activeTab === "store" && (
                <div className="space-y-4 text-xs">
                  {seller.store ? (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20">
                          <span className="text-muted-foreground font-medium">Store Name</span>
                          <div className="font-bold text-sm text-foreground">{seller.store.displayName}</div>
                        </div>

                        <div className="rounded-xl border p-3.5 space-y-1 bg-muted/20">
                          <span className="text-muted-foreground font-medium">Store URL Handle</span>
                          <div className="font-mono text-primary font-medium">/store/{seller.store.slug}</div>
                        </div>
                      </div>

                      <div className="rounded-xl border p-3.5 space-y-1.5 bg-muted/20">
                        <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                          <MapPinIcon className="size-3.5 text-primary" />
                          Pickup Address
                        </span>
                        {seller.store.address ? (
                          <div className="font-medium text-foreground leading-relaxed">
                            {seller.store.address.street1},{" "}
                            {seller.store.address.city}, {seller.store.address.state} - {seller.store.address.postalCode} ({seller.store.address.country})
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic">Address not configured yet</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No store details found</div>
                  )}
                </div>
              )}

              {/* TAB 3: Bank Account */}
              {activeTab === "bank" && (
                <div className="space-y-4 text-xs">
                  {seller.bankAccounts && seller.bankAccounts.length > 0 ? (
                    seller.bankAccounts.map((acc) => (
                      <div key={acc.id} className="grid gap-3 sm:grid-cols-2 rounded-xl border p-4 bg-muted/20">
                        <div>
                          <span className="text-muted-foreground">Bank Name</span>
                          <div className="font-bold text-foreground text-sm">{acc.bankName}</div>
                        </div>

                        <div>
                          <span className="text-muted-foreground">Account Holder</span>
                          <div className="font-semibold text-foreground">{acc.accountHolderName}</div>
                        </div>

                        <div>
                          <span className="text-muted-foreground">Account Number</span>
                          <div className="font-mono font-bold text-foreground">{acc.accountNumber}</div>
                        </div>

                        <div>
                          <span className="text-muted-foreground">IFSC Code</span>
                          <div className="font-mono font-bold text-primary">{acc.ifscCode}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No bank account details uploaded</div>
                  )}
                </div>
              )}

              {/* TAB 4: Documents */}
              {activeTab === "documents" && (
                <div className="space-y-4 text-xs">
                  {sigDoc ? (
                    <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <FileCheckIcon className="size-4 text-primary" />
                        Uploaded e-Signature
                      </span>
                      <div className="rounded-lg border bg-white p-4 flex items-center justify-center max-h-40">
                        <img
                          src={sigDoc.media.url || `http://localhost:5000/uploads/${sigDoc.media.fileName}`}
                          alt="Seller Signature"
                          className="max-h-32 object-contain"
                          onError={(e) => {
                            // Fallback if local upload path
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        <span className="text-xs text-muted-foreground italic">Signature file attached ({sigDoc.media.fileName})</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No signature file uploaded</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        {!showRejectForm && (
          <div className="flex items-center justify-between border-t px-6 py-4 bg-muted/20">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>

            {seller.status !== "APPROVED" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectForm(true)}
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <XCircleIcon className="size-4" />
                  Request Revisions
                </Button>

                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <CheckCircle2Icon className="size-4" />}
                  Approve Merchant
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
