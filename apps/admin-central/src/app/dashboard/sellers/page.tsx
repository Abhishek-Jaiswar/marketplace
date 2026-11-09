"use client"

import React, { useState } from "react"
import { useGetSellersAdminQuery, Seller } from "@workspace/store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  StoreIcon,
  SearchIcon,
  ClockIcon,
  CheckCircle2Icon,
  XCircleIcon,
  EyeIcon,
  Loader2Icon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { SellerInspectionModal } from "./components/SellerInspectionModal"

export default function SellerApprovalPage() {
  const [selectedTab, setSelectedTab] = useState<
    "ALL" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"
  >("UNDER_REVIEW")
  const [searchQuery, setSearchQuery] = useState("")
  const [inspectingSeller, setInspectingSeller] = useState<Seller | null>(null)

  const { data, isLoading, isFetching, refetch } = useGetSellersAdminQuery()

  const allSellers = data?.data || []

  // Filter sellers by tab and search query
  const filteredSellers = allSellers.filter((seller) => {
    // Filter by tab
    if (selectedTab !== "ALL" && seller.status !== selectedTab) {
      return false
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const businessMatch = seller.businessName?.toLowerCase().includes(q)
      const storeMatch = seller.store?.displayName?.toLowerCase().includes(q)
      const emailMatch = seller.contactEmail?.toLowerCase().includes(q)
      const gstinMatch = seller.gstin?.toLowerCase().includes(q)
      return businessMatch || storeMatch || emailMatch || gstinMatch
    }

    return true
  })

  // Quick stats
  const pendingCount = allSellers.filter(
    (s) => s.status === "UNDER_REVIEW"
  ).length
  const approvedCount = allSellers.filter((s) => s.status === "APPROVED").length
  const rejectedCount = allSellers.filter((s) => s.status === "REJECTED").length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Seller Approval Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and verify merchant applications before granting storefront
            access.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5"
        >
          <RefreshCwIcon
            className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh List
        </Button>
      </div>

      {/* UX Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Pending Card */}
        <Card
          onClick={() => setSelectedTab("UNDER_REVIEW")}
          className={`cursor-pointer border-l-4 border-l-amber-500 transition-all ${
            selectedTab === "UNDER_REVIEW"
              ? "bg-amber-500/5 ring-2 ring-primary/20"
              : "hover:border-amber-500/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Pending Review
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <ClockIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {pendingCount} Applications
            </div>
            <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              Waiting for admin verification
            </p>
          </CardContent>
        </Card>

        {/* Approved Card */}
        <Card
          onClick={() => setSelectedTab("APPROVED")}
          className={`cursor-pointer border-l-4 border-l-emerald-500 transition-all ${
            selectedTab === "APPROVED"
              ? "bg-emerald-500/5 ring-2 ring-primary/20"
              : "hover:border-emerald-500/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Approved Merchants
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2Icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {approvedCount} Active
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Active selling permissions
            </p>
          </CardContent>
        </Card>

        {/* Needs Revision Card */}
        <Card
          onClick={() => setSelectedTab("REJECTED")}
          className={`cursor-pointer border-l-4 border-l-rose-500 transition-all ${
            selectedTab === "REJECTED"
              ? "bg-rose-500/5 ring-2 ring-primary/20"
              : "hover:border-rose-500/50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Needs Attention
            </CardTitle>
            <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
              <XCircleIcon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {rejectedCount} Rejected
            </div>
            <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
              Revisions requested
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheckIcon className="size-4 text-primary" />
              Merchant Applications List
            </CardTitle>
            <CardDescription>
              Select a seller application to inspect documents, GSTIN, bank
              details, and grant approval.
            </CardDescription>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store or GSTIN..."
              className="h-9 pl-9 text-xs"
            />
          </div>
        </CardHeader>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b bg-muted/10 px-6 text-xs font-medium">
          {[
            { id: "UNDER_REVIEW", label: `Pending Review (${pendingCount})` },
            { id: "APPROVED", label: `Approved (${approvedCount})` },
            { id: "REJECTED", label: `Needs Attention (${rejectedCount})` },
            { id: "ALL", label: `All Sellers (${allSellers.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`cursor-pointer border-b-2 px-3 py-2.5 transition-all ${
                selectedTab === tab.id
                  ? "border-primary font-bold text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Loader2Icon className="size-8 animate-spin text-primary" />
              <p className="text-xs font-medium text-muted-foreground">
                Loading seller applications...
              </p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <StoreIcon className="mb-2 size-10 stroke-1 text-muted-foreground/50" />
              <div className="text-sm font-semibold text-foreground">
                No merchant applications found
              </div>
              <p className="mt-1 max-w-xs text-xs">
                There are no sellers matching the selected status or search
                query.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-[11px] text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Store & Business</th>
                    <th className="px-4 py-3">GSTIN</th>
                    <th className="px-4 py-3">Business Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Applied Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="text-sm font-bold text-foreground">
                          {seller.store?.displayName || seller.businessName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {seller.contactEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-foreground">
                        {seller.gstin || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{seller.businessType}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {seller.status === "APPROVED" && (
                          <Badge variant="success">Approved</Badge>
                        )}
                        {seller.status === "UNDER_REVIEW" && (
                          <Badge variant="warning">Under Review</Badge>
                        )}
                        {seller.status === "REJECTED" && (
                          <Badge variant="destructive">Needs Attention</Badge>
                        )}
                        {seller.status === "DRAFT" && (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(seller.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setInspectingSeller(seller)}
                          className="h-8 gap-1.5 text-xs font-semibold transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                          <EyeIcon className="size-3.5" />
                          Inspect & Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seller Inspection Modal */}
      <SellerInspectionModal
        seller={inspectingSeller}
        isOpen={!!inspectingSeller}
        onClose={() => setInspectingSeller(null)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
