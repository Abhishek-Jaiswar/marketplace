"use client"

import React from "react"
import Link from "next/link"
import {
  useGetInventoryQuery,
  useGetListingsQuery,
  useGetSellerMeQuery,
} from "@workspace/store"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  XCircleIcon,
} from "lucide-react"

export default function SellerDashboard() {
  const { data: sellerData } = useGetSellerMeQuery()
  const seller = sellerData?.seller
  const { data: listingsData } = useGetListingsQuery(
    { sellerId: seller?.id ?? "", limit: 100 },
    { skip: !seller?.id }
  )
  const { data: inventoryData } = useGetInventoryQuery(
    { limit: 100 },
    { skip: seller?.status !== "APPROVED" }
  )
  const stock = inventoryData?.data ?? []
  const metrics = [
    { label: "Listings", value: listingsData?.total },
    {
      label: "Units available",
      value: stock.reduce(
        (total, item) => total + item.onHand - item.reserved,
        0
      ),
    },
    {
      label: "Items running low",
      value: stock.filter((item) => item.onHand <= item.lowStockThreshold)
        .length,
    },
  ]

  const isUnderReview = seller?.status === "UNDER_REVIEW"
  const isRejected = seller?.status === "REJECTED"
  const isApproved = seller?.status === "APPROVED"

  const rejectionRemarks =
    seller?.verification?.remarks ||
    "Please review your uploaded documents and details."

  return (
    <div className="flex flex-col gap-6">
      {/* Real-time Status Banners for Great UX */}
      {isUnderReview && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-900 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600">
              <ClockIcon className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold">
                Merchant Application Under Review
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Our administration team is currently verifying your GSTIN &
                business details. Features will unlock upon approval.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0">
            Pending Admin Verification
          </Badge>
        </div>
      )}

      {isRejected && (
        <div className="flex flex-col gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-900">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600">
                <XCircleIcon className="size-5" />
              </div>
              <div>
                <div className="text-sm font-bold">
                  Action Needed: Application Revision Requested
                </div>
                <p className="mt-0.5 text-xs font-medium text-rose-700">
                  Admin Remarks: &quot;{rejectionRemarks}&quot;
                </p>
              </div>
            </div>
            <Button
              render={<Link href="/onboard" />}
              size="sm"
              variant="destructive"
              className="shrink-0 gap-1.5"
            >
              Update Application Details
              <ArrowRightIcon className="size-3.5" />
            </Button>
          </div>

          {/* Granular Step Rejection Feedback Breakdown */}
          {seller?.verification && (
            <div className="grid gap-2 border-t border-rose-500/20 pt-2 text-xs sm:grid-cols-2">
              {seller.verification.businessStatus === "REJECTED" && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 font-medium text-rose-800">
                  <strong>Business Details:</strong>{" "}
                  {seller.verification.businessRejectionReason ||
                    "Needs attention"}
                </div>
              )}
              {seller.verification.storeStatus === "REJECTED" && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 font-medium text-rose-800">
                  <strong>Store & Address:</strong>{" "}
                  {seller.verification.storeRejectionReason ||
                    "Needs attention"}
                </div>
              )}
              {seller.verification.bankStatus === "REJECTED" && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 font-medium text-rose-800">
                  <strong>Bank Account:</strong>{" "}
                  {seller.verification.bankRejectionReason || "Needs attention"}
                </div>
              )}
              {seller.verification.documentsStatus === "REJECTED" && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-2.5 font-medium text-rose-800">
                  <strong>Documents:</strong>{" "}
                  {seller.verification.documentsRejectionReason ||
                    "Needs attention"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Seller Overview
            </h1>
            {isApproved && (
              <Badge variant="success" className="gap-1">
                <ShieldCheckIcon className="size-3" /> Verified Seller
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor your store sales, fulfillment pipeline, and performance
            metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" render={<Link href="/dashboard/products" />}>
            Add product
          </Button>
        </div>
      </div>

      <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-card p-4">
            <dt className="text-muted-foreground">{metric.label}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums">
              {metric.value ?? "–"}
            </dd>
          </div>
        ))}
      </dl>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Orders</h2>
        <p className="mt-1 text-muted-foreground">
          New orders will appear here once checkout is live.
        </p>
      </section>
    </div>
  )
}
