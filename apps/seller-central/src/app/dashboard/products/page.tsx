"use client"
import { brand } from "@workspace/ui/lib/brand"

import React, { useState } from "react"
import {
  useGetListingsQuery,
  useGetProductsQuery,
  useGetBrandsQuery,
  useGetCategoryTreeQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useCreateProductMutation,
  type Product,
  type SellerListing,
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
  PlusIcon,
  SearchIcon,
  TagIcon,
  SparklesIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LayersIcon,
  StoreIcon,
  EditIcon,
} from "lucide-react"

export default function SellerProductsPage() {
  const [activeTab, setActiveTab] = useState<"listings" | "catalog">("listings")
  const [searchQuery, setSearchQuery] = useState("")

  // Queries
  const {
    data: listingsData,
    isLoading: listingsLoading,
    refetch: refetchListings,
  } = useGetListingsQuery()
  const { data: catalogData, isLoading: catalogLoading } = useGetProductsQuery({
    status: "APPROVED",
    search: searchQuery || undefined,
  })
  const { data: categoriesData } = useGetCategoryTreeQuery()
  const { data: brandsData } = useGetBrandsQuery()

  // Mutations
  const [createListing, { isLoading: isCreatingListing }] =
    useCreateListingMutation()
  const [updateListing, { isLoading: isUpdatingListing }] =
    useUpdateListingMutation()
  const [createProduct, { isLoading: isCreatingProduct }] =
    useCreateProductMutation()

  // Modal States
  const [isListModalOpen, setIsListModalOpen] = useState(false)
  const [selectedProductForListing, setSelectedProductForListing] =
    useState<Product | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [listingForm, setListingForm] = useState({
    sellerSku: "",
    mrpPrice: "",
    sellingPrice: "",
    condition: "NEW" as const,
    handlingTimeDays: "1",
    warranty: "",
  })

  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false)
  const [proposeForm, setProposeForm] = useState({
    title: "",
    categoryId: "",
    brandId: "",
    description: "",
    highlights: "",
    sku: "",
    barcode: "",
    color: "",
    size: "",
  })

  const [isEditListingOpen, setIsEditListingOpen] = useState(false)
  const [editingListing, setEditingListing] = useState<SellerListing | null>(
    null
  )
  const [editPriceForm, setEditPriceForm] = useState({
    sellingPrice: "",
    mrpPrice: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  })

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleOpenListModal = (product: Product) => {
    setSelectedProductForListing(product)
    if (
      product.variants &&
      product.variants.length > 0 &&
      product.variants[0]
    ) {
      setSelectedVariantId(product.variants[0].id)
    }
    setListingForm({
      sellerSku: `SKU-${Date.now().toString().slice(-6)}`,
      mrpPrice: "",
      sellingPrice: "",
      condition: "NEW",
      handlingTimeDays: "1",
      warranty: "1 Year Manufacturer",
    })
    setIsListModalOpen(true)
  }

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVariantId) return

    const mrp = parseInt(listingForm.mrpPrice, 10)
    const selling = parseInt(listingForm.sellingPrice, 10)

    if (selling > mrp) {
      setStatusMessage({
        type: "error",
        text: "Selling price cannot exceed MRP.",
      })
      return
    }

    try {
      await createListing({
        variantId: selectedVariantId,
        sellerSku: listingForm.sellerSku,
        mrpPrice: mrp,
        sellingPrice: selling,
        condition: listingForm.condition,
        handlingTimeDays: parseInt(listingForm.handlingTimeDays, 10) || 1,
        warranty: listingForm.warranty || null,
      }).unwrap()

      setStatusMessage({ type: "success", text: "Offer listed successfully!" })
      setIsListModalOpen(false)
      refetchListings()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to create listing.",
      })
    }
  }

  const handleProposeProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const highlightsArray = proposeForm.highlights
        ? proposeForm.highlights.split("\n").filter((h) => h.trim().length > 0)
        : []

      await createProduct({
        title: proposeForm.title,
        description: proposeForm.description,
        categoryId: proposeForm.categoryId,
        brandId: proposeForm.brandId || null,
        highlights: highlightsArray,
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: "Product submitted for catalog review! Admin will verify GTIN and specifications.",
      })
      setIsProposeModalOpen(false)
      setProposeForm({
        title: "",
        categoryId: "",
        brandId: "",
        description: "",
        highlights: "",
        sku: "",
        barcode: "",
        color: "",
        size: "",
      })
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to submit product.",
      })
    }
  }

  const handleUpdateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingListing) return

    try {
      await updateListing({
        id: editingListing.id,
        sellingPrice: parseInt(editPriceForm.sellingPrice, 10),
        mrpPrice: parseInt(editPriceForm.mrpPrice, 10),
        status: editPriceForm.status,
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: "Listing updated successfully.",
      })
      setIsEditListingOpen(false)
      refetchListings()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to update listing.",
      })
    }
  }

  const listings = listingsData?.items || []
  const catalogProducts = catalogData?.items || []

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Product Catalog & Offers
          </h1>
          <p className="text-sm text-muted-foreground">
            List offers against verified master catalog products or propose new
            additions to the marketplace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsProposeModalOpen(true)}
          >
            <SparklesIcon className="size-4 text-amber-500" />
            Propose New Master Product
          </Button>
          <Button
            className="gap-2 bg-primary text-primary-foreground"
            onClick={() => setActiveTab("catalog")}
          >
            <PlusIcon className="size-4" />
            Add Offer from Catalog
          </Button>
        </div>
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
              <AlertCircleIcon className="size-4" />
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

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "listings"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <StoreIcon className="size-4" />
          My Listed Offers
          <Badge variant="secondary" className="ml-1 text-xs">
            {listings.length}
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
          <LayersIcon className="size-4" />
          Marketplace Master Catalog
          <Badge variant="outline" className="ml-1 text-xs">
            Browse
          </Badge>
        </button>
      </div>

      {/* TAB 1: My Listed Offers */}
      {activeTab === "listings" && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Active Marketplace Offers
              </CardTitle>
              <CardDescription>
                These are the variants you are currently selling on the{" "}
                {brand.name}
                storefront.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Loading your offers...
                </div>
              ) : listings.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <PackageIcon className="size-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    You have not listed any offers yet.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("catalog")}
                  >
                    Browse Master Catalog to List First Offer
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        <th className="px-4 py-3">Seller SKU</th>
                        <th className="px-4 py-3">Master SKU / Attributes</th>
                        <th className="px-4 py-3">Condition</th>
                        <th className="px-4 py-3">MRP</th>
                        <th className="px-4 py-3">Selling Price</th>
                        <th className="px-4 py-3">Stock on Hand</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {listings.map((listing) => {
                        const totalStock =
                          listing.inventoryItems?.reduce(
                            (acc, item) => acc + item.onHand,
                            0
                          ) ?? 0

                        return (
                          <tr
                            key={listing.id}
                            className="transition-colors hover:bg-muted/40"
                          >
                            <td className="px-4 py-3 font-mono text-xs font-medium">
                              {listing.sellerSku}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">
                                  {listing.variant?.sku || "SKU-UNKNOWN"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {listing.variant?.attributes
                                    ? Object.entries(listing.variant.attributes)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(" • ")
                                    : "Default"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">
                                {listing.condition}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground line-through">
                              ₹{listing.mrpPrice.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3 font-semibold text-emerald-600">
                              ₹{listing.sellingPrice.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-medium ${
                                  totalStock > 0
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                }`}
                              >
                                {totalStock > 0 ? (
                                  <CheckCircle2Icon className="size-3.5" />
                                ) : (
                                  <AlertCircleIcon className="size-3.5" />
                                )}
                                {totalStock} units
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  listing.status === "ACTIVE"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs uppercase"
                              >
                                {listing.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="size-8 p-0"
                                onClick={() => {
                                  setEditingListing(listing)
                                  setEditPriceForm({
                                    sellingPrice: String(listing.sellingPrice),
                                    mrpPrice: String(listing.mrpPrice),
                                    status:
                                      listing.status === "ACTIVE"
                                        ? "ACTIVE"
                                        : "INACTIVE",
                                  })
                                  setIsEditListingOpen(true)
                                }}
                              >
                                <EditIcon className="size-4 text-muted-foreground" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Marketplace Master Catalog */}
      {activeTab === "catalog" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative max-w-md flex-1">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search master catalog by title or brand..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {catalogLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading master catalog...
            </div>
          ) : catalogProducts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <PackageIcon className="size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">
                  No approved products match your search.
                </p>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsProposeModalOpen(true)}
                >
                  <PlusIcon className="size-4" />
                  Propose this Product to Catalog
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {catalogProducts.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col justify-between transition-colors hover:border-primary/50"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs">
                        {product.category?.name || "General"}
                      </Badge>
                      {product.brand && (
                        <span className="text-xs font-semibold text-muted-foreground">
                          {product.brand.name}
                        </span>
                      )}
                    </div>
                    <CardTitle className="mt-1 line-clamp-2 text-base leading-tight font-semibold">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        {product.variants?.length ?? 0} Canonical Variant(s)
                      </span>
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleOpenListModal(product)}
                      >
                        <TagIcon className="size-3.5" />
                        List Offer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DIALOG 1: List Offer against Master Product */}
      <Dialog open={isListModalOpen} onOpenChange={setIsListModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>List Offer on Marketplace</DialogTitle>
            <DialogDescription>
              Set your commercial terms and SKU for{" "}
              <strong>{selectedProductForListing?.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateListing} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Select Variant
              </label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                required
              >
                {selectedProductForListing?.variants?.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.sku} (
                    {Object.entries(v.attributes)
                      .map(([key, val]) => `${key}: ${val}`)
                      .join(", ")}
                    )
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  MRP Price (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 9999"
                  required
                  value={listingForm.mrpPrice}
                  onChange={(e) =>
                    setListingForm({ ...listingForm, mrpPrice: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Selling Price (₹)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 7999"
                  required
                  value={listingForm.sellingPrice}
                  onChange={(e) =>
                    setListingForm({
                      ...listingForm,
                      sellingPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Seller SKU
                </label>
                <Input
                  required
                  value={listingForm.sellerSku}
                  onChange={(e) =>
                    setListingForm({
                      ...listingForm,
                      sellerSku: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Item Condition
                </label>
                <select
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={listingForm.condition}
                  onChange={(e) =>
                    setListingForm({
                      ...listingForm,
                      condition: e.target.value as any,
                    })
                  }
                >
                  <option value="NEW">Brand New</option>
                  <option value="REFURBISHED">Refurbished</option>
                  <option value="USED_LIKE_NEW">Used - Like New</option>
                </select>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsListModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingListing}>
                {isCreatingListing ? "Listing Offer..." : "Publish Offer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Propose New Master Product (Amazon/Flipkart Review Queue) */}
      <Dialog open={isProposeModalOpen} onOpenChange={setIsProposeModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Propose New Master Product</DialogTitle>
            <DialogDescription>
              New products enter <strong>PENDING_REVIEW</strong> and are
              verified by administrators before appearing in search.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProposeProduct} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Product Title
              </label>
              <Input
                placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                required
                value={proposeForm.title}
                onChange={(e) =>
                  setProposeForm({ ...proposeForm, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Category
                </label>
                <select
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  required
                  value={proposeForm.categoryId}
                  onChange={(e) =>
                    setProposeForm({
                      ...proposeForm,
                      categoryId: e.target.value,
                    })
                  }
                >
                  <option value="">Select category...</option>
                  {categoriesData?.data?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Brand
                </label>
                <select
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={proposeForm.brandId}
                  onChange={(e) =>
                    setProposeForm({ ...proposeForm, brandId: e.target.value })
                  }
                >
                  <option value="">Select brand...</option>
                  {brandsData?.items?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Description
              </label>
              <textarea
                className="mt-1 h-20 w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm"
                placeholder="Detailed technical overview and product features..."
                required
                value={proposeForm.description}
                onChange={(e) =>
                  setProposeForm({
                    ...proposeForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Highlights (One per line)
              </label>
              <textarea
                className="mt-1 h-16 w-full rounded-md border border-input bg-background p-3 font-mono text-sm text-xs shadow-sm"
                placeholder="Industry-leading noise cancellation&#10;Up to 30-hour battery life&#10;Crystal clear hands-free calling"
                value={proposeForm.highlights}
                onChange={(e) =>
                  setProposeForm({ ...proposeForm, highlights: e.target.value })
                }
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProposeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingProduct}>
                {isCreatingProduct ? "Submitting..." : "Submit for Moderation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Edit Offer Price & Status */}
      <Dialog open={isEditListingOpen} onOpenChange={setIsEditListingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Listing Offer</DialogTitle>
            <DialogDescription>
              Update price or toggle selling status for SKU{" "}
              {editingListing?.sellerSku}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateListing} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  MRP Price (₹)
                </label>
                <Input
                  type="number"
                  value={editPriceForm.mrpPrice}
                  onChange={(e) =>
                    setEditPriceForm({
                      ...editPriceForm,
                      mrpPrice: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Selling Price (₹)
                </label>
                <Input
                  type="number"
                  value={editPriceForm.sellingPrice}
                  onChange={(e) =>
                    setEditPriceForm({
                      ...editPriceForm,
                      sellingPrice: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Offer Status
              </label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={editPriceForm.status}
                onChange={(e) =>
                  setEditPriceForm({
                    ...editPriceForm,
                    status: e.target.value as any,
                  })
                }
              >
                <option value="ACTIVE">ACTIVE (Visible on Storefront)</option>
                <option value="INACTIVE">INACTIVE (Hidden)</option>
              </select>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditListingOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingListing}>
                {isUpdatingListing ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
