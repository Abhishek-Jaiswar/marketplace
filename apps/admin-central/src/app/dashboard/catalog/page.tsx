"use client"

import React, { useState } from "react"
import {
  useGetProductsQuery,
  useReviewProductMutation,
  useGetBrandsQuery,
  useCreateBrandMutation,
  type Product,
} from "@workspace/store"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  PackageIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  SearchIcon,
  PlusIcon,
  ExternalLinkIcon,
} from "lucide-react"

export default function AdminCatalogPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "catalog" | "brands">(
    "queue"
  )
  const [searchQuery, setSearchQuery] = useState("")

  // Queries
  const {
    data: pendingProductsData,
    isLoading: pendingLoading,
    refetch: refetchPending,
  } = useGetProductsQuery({ status: "PENDING_REVIEW" })

  const {
    data: approvedProductsData,
    isLoading: approvedLoading,
    refetch: refetchApproved,
  } = useGetProductsQuery({
    status: "APPROVED",
    search: searchQuery || undefined,
  })

  const {
    data: brandsData,
    isLoading: brandsLoading,
    refetch: refetchBrands,
  } = useGetBrandsQuery()

  // Mutations
  const [reviewProduct, { isLoading: isReviewing }] = useReviewProductMutation()
  const [createBrand, { isLoading: isCreatingBrand }] = useCreateBrandMutation()

  // Modal States
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(
    null
  )
  const [rejectFeedback, setRejectFeedback] = useState("")
  const [showRejectInput, setShowRejectInput] = useState(false)

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const [brandForm, setBrandForm] = useState({
    name: "",
    slug: "",
    website: "",
    description: "",
    isVerified: true,
  })

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const pendingProducts = pendingProductsData?.items || []
  const approvedProducts = approvedProductsData?.items || []
  const brands = brandsData?.items || []

  const handleApproveProduct = async () => {
    if (!inspectingProduct) return
    try {
      await reviewProduct({
        id: inspectingProduct.id,
        status: "APPROVED",
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: `Product "${inspectingProduct.title}" approved and published to catalog!`,
      })
      setInspectingProduct(null)
      setShowRejectInput(false)
      refetchPending()
      refetchApproved()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to approve product.",
      })
    }
  }

  const handleRejectProduct = async () => {
    if (!inspectingProduct) return
    if (!rejectFeedback.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide rejection feedback for the seller.",
      })
      return
    }

    try {
      await reviewProduct({
        id: inspectingProduct.id,
        status: "REJECTED",
        reviewFeedback: rejectFeedback,
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: `Product "${inspectingProduct.title}" rejected with feedback.`,
      })
      setInspectingProduct(null)
      setShowRejectInput(false)
      setRejectFeedback("")
      refetchPending()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to reject product.",
      })
    }
  }

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createBrand({
        name: brandForm.name,
        slug: brandForm.slug || undefined,
        website: brandForm.website || null,
        description: brandForm.description || null,
        isVerified: brandForm.isVerified,
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: `Brand "${brandForm.name}" registered successfully.`,
      })
      setIsBrandModalOpen(false)
      setBrandForm({
        name: "",
        slug: "",
        website: "",
        description: "",
        isVerified: true,
      })
      refetchBrands()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to register brand.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Catalog Moderation & Brands
          </h1>
          <p className="text-sm text-muted-foreground">
            Moderate seller-submitted master products and administer verified
            platform brands.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsBrandModalOpen(true)}>
          <PlusIcon className="size-4" />
          Register New Brand
        </Button>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center justify-between rounded-lg border p-4 text-sm ${
            statusMessage.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
              : "border-rose-500/30 bg-rose-500/10 text-rose-600"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2Icon className="size-4" />
            ) : (
              <XCircleIcon className="size-4" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="ml-4 text-xs font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("queue")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "queue"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClockIcon className="size-4" />
          Review Queue
          <Badge
            variant={pendingProducts.length > 0 ? "destructive" : "secondary"}
            className="ml-1 text-xs"
          >
            {pendingProducts.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "catalog"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PackageIcon className="size-4" />
          Approved Master Catalog
          <Badge variant="outline" className="ml-1 text-xs">
            {approvedProducts.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab("brands")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "brands"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheckIcon className="size-4" />
          Brand Registry
          <Badge variant="outline" className="ml-1 text-xs">
            {brands.length}
          </Badge>
        </button>
      </div>

      {/* TAB 1: Review Queue */}
      {activeTab === "queue" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Seller Proposals Awaiting Moderation
            </CardTitle>
            <CardDescription>
              Verify GTIN/EAN barcodes, trademark compliance, and category
              taxonomy before approving items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading queue...
              </div>
            ) : pendingProducts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <CheckCircle2Icon className="size-10 text-emerald-500/50" />
                <p className="text-sm font-medium text-muted-foreground">
                  The product moderation queue is completely clear!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Brand</th>
                      <th className="px-4 py-3">Submitted At</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {p.title}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {p.category?.name || "Uncategorized"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.brand?.name || "Generic"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setInspectingProduct(p)
                              setShowRejectInput(false)
                              setRejectFeedback("")
                            }}
                          >
                            Inspect & Moderate
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
      )}

      {/* TAB 2: Approved Master Catalog */}
      {activeTab === "catalog" && (
        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search approved products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card>
            <CardContent className="p-0">
              {approvedLoading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Loading catalog...
                </div>
              ) : approvedProducts.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No approved master products found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <th className="px-4 py-3">Product Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Variants</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {approvedProducts.map((p) => (
                        <tr
                          key={p.id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {p.title}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              {p.category?.name || "General"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {p.brand?.name || "Generic"}
                          </td>
                          <td className="px-4 py-3 text-xs font-medium">
                            {p.variants?.length ?? 0} SKU(s)
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="default"
                              className="bg-emerald-600 text-xs text-white"
                            >
                              APPROVED
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Brand Registry */}
      {activeTab === "brands" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Registered Brands
            </CardTitle>
            <CardDescription>
              Verified brand entities with trademark authorization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading brands...
              </div>
            ) : brands.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No brands registered.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      <th className="px-4 py-3">Brand Name</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Website</th>
                      <th className="px-4 py-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {brands.map((b) => (
                      <tr
                        key={b.id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <td className="px-4 py-3 font-semibold text-foreground">
                          {b.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {b.slug}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {b.website ? (
                            <a
                              href={b.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              {b.website}
                              <ExternalLinkIcon className="size-3" />
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {b.isVerified ? (
                            <Badge
                              variant="default"
                              className="gap-1 bg-blue-600 text-xs text-white"
                            >
                              <ShieldCheckIcon className="size-3" />
                              VERIFIED BRAND
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              UNVERIFIED
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* INSPECTION MODAL: Product Moderation */}
      <Dialog
        open={!!inspectingProduct}
        onOpenChange={(open) => !open && setInspectingProduct(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Inspect Master Product Submission</DialogTitle>
            <DialogDescription>
              Review technical specifications, taxonomy, and description before
              approving for storefront discovery.
            </DialogDescription>
          </DialogHeader>

          {inspectingProduct && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Title
                </span>
                <span className="text-base font-bold text-foreground">
                  {inspectingProduct.title}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border py-3">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Category
                  </span>
                  <div className="mt-1 font-medium">
                    {inspectingProduct.category?.name || "—"}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Brand
                  </span>
                  <div className="mt-1 font-medium">
                    {inspectingProduct.brand?.name || "Generic"}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Description
                </span>
                <p className="mt-1 rounded-md bg-muted/30 p-3 text-sm text-foreground">
                  {inspectingProduct.description}
                </p>
              </div>

              {inspectingProduct.highlights &&
                inspectingProduct.highlights.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      Highlights
                    </span>
                    <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-foreground">
                      {inspectingProduct.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {showRejectInput && (
                <div className="flex flex-col gap-2 border-t border-border pt-2">
                  <label className="text-xs font-semibold text-rose-600">
                    Reason for Rejection (Visible to Seller)
                  </label>
                  <textarea
                    className="h-20 w-full rounded-md border border-rose-300 bg-background p-2 text-sm"
                    placeholder="e.g. Inaccurate brand name, missing mandatory GTIN barcode, or unclear product specifications..."
                    value={rejectFeedback}
                    onChange={(e) => setRejectFeedback(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {showRejectInput ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectInput(false)}
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  disabled={isReviewing}
                  onClick={handleRejectProduct}
                >
                  {isReviewing ? "Rejecting..." : "Confirm Rejection"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectInput(true)}
                >
                  Reject Proposal
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={isReviewing}
                  onClick={handleApproveProduct}
                >
                  {isReviewing ? "Approving..." : "Approve & Publish"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Register New Brand */}
      <Dialog open={isBrandModalOpen} onOpenChange={setIsBrandModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Verified Brand</DialogTitle>
            <DialogDescription>
              Add a recognized manufacturer brand to the marketplace registry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBrand} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Brand Name
              </label>
              <Input
                placeholder="e.g. Apple, Nike, Sony"
                required
                value={brandForm.name}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Official Website
              </label>
              <Input
                placeholder="https://www.apple.com"
                value={brandForm.website}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, website: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Description
              </label>
              <Input
                placeholder="Global consumer electronics..."
                value={brandForm.description}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, description: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isVerifiedBrand"
                className="rounded border-input text-primary focus:ring-primary"
                checked={brandForm.isVerified}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, isVerified: e.target.checked })
                }
              />
              <label
                htmlFor="isVerifiedBrand"
                className="text-xs font-medium text-foreground"
              >
                Mark as Officially Verified
              </label>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBrandModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingBrand}>
                {isCreatingBrand ? "Registering..." : "Register Brand"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
