"use client"

import React, { useState } from "react"
import {
  useGetInventoryQuery,
  useGetLocationsQuery,
  useGetLedgerQuery,
  useGetListingsQuery,
  useCreateLocationMutation,
  useAdjustStockMutation,
  type InventoryItem,
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
  WarehouseIcon,
  PlusIcon,
  PackageCheckIcon,
  LayersIcon,
  HistoryIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  MapPinIcon,
  ShieldAlertIcon,
  LockIcon,
} from "lucide-react"

export default function SellerInventoryPage() {
  const [activeTab, setActiveTab] = useState<"stock" | "locations" | "ledger">(
    "stock"
  )

  // Queries
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    refetch: refetchInventory,
  } = useGetInventoryQuery()
  const {
    data: locationsData,
    isLoading: locationsLoading,
    refetch: refetchLocations,
  } = useGetLocationsQuery()
  const {
    data: ledgerData,
    isLoading: ledgerLoading,
    refetch: refetchLedger,
  } = useGetLedgerQuery()
  const { data: listingsData } = useGetListingsQuery()

  // Mutations
  const [createLocation, { isLoading: isCreatingLocation }] =
    useCreateLocationMutation()
  const [adjustStock, { isLoading: isAdjustingStock }] =
    useAdjustStockMutation()

  // Modals
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [adjustForm, setAdjustForm] = useState({
    sellerListingId: "",
    locationId: "",
    quantityDelta: "",
    reason: "RESTOCK" as const,
    referenceId: "",
    note: "",
    safetyStock: "0",
  })

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [locationForm, setLocationForm] = useState({
    name: "",
    code: "",
    isPrimary: false,
    street1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  })

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const items = inventoryData?.data || []
  const locations = locationsData?.data || []
  const ledgerEntries = ledgerData?.data || []
  const listings = listingsData?.items || []

  // KPI Calculations
  const totalOnHand = items.reduce((acc, i) => acc + i.onHand, 0)
  const totalReserved = items.reduce((acc, i) => acc + i.reserved, 0)
  const totalAvailable = Math.max(0, totalOnHand - totalReserved)
  const lowStockCount = items.filter(
    (i) => i.onHand <= i.lowStockThreshold
  ).length

  const handleOpenAdjustModal = (item?: InventoryItem) => {
    setAdjustForm({
      sellerListingId: item?.sellerListingId || (listings[0]?.id ?? ""),
      locationId: item?.locationId || (locations[0]?.id ?? ""),
      quantityDelta: "10",
      reason: "RESTOCK",
      referenceId: `PO-${Date.now().toString().slice(-6)}`,
      note: "Batch inbound restock",
      safetyStock: item ? String(item.safetyStock) : "0",
    })
    setIsAdjustModalOpen(true)
  }

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault()
    const delta = parseInt(adjustForm.quantityDelta, 10)
    if (isNaN(delta) || delta === 0) {
      setStatusMessage({
        type: "error",
        text: "Delta quantity cannot be zero.",
      })
      return
    }

    try {
      await adjustStock({
        sellerListingId: adjustForm.sellerListingId,
        locationId: adjustForm.locationId,
        quantityDelta: delta,
        reason: adjustForm.reason,
        referenceId: adjustForm.referenceId || null,
        note: adjustForm.note || null,
        safetyStock: parseInt(adjustForm.safetyStock, 10) || 0,
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: "Stock updated and ledger entry recorded successfully.",
      })
      setIsAdjustModalOpen(false)
      refetchInventory()
      refetchLedger()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to adjust stock.",
      })
    }
  }

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createLocation({
        name: locationForm.name,
        code: locationForm.code.toUpperCase(),
        isPrimary: locationForm.isPrimary,
        address: {
          street1: locationForm.street1,
          city: locationForm.city,
          state: locationForm.state,
          postalCode: locationForm.postalCode,
          country: locationForm.country,
        },
      }).unwrap()

      setStatusMessage({
        type: "success",
        text: "Warehouse location created successfully.",
      })
      setIsLocationModalOpen(false)
      setLocationForm({
        name: "",
        code: "",
        isPrimary: false,
        street1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      })
      refetchLocations()
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.data?.message || "Failed to register warehouse.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Multi-Warehouse Inventory & Ledger
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage distributed warehouse stock, active checkout locks, and
            double-entry audit trails.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsLocationModalOpen(true)}
          >
            <WarehouseIcon className="size-4" />
            Add Warehouse
          </Button>
          <Button
            className="gap-2 bg-primary text-primary-foreground"
            onClick={() => handleOpenAdjustModal()}
          >
            <PlusIcon className="size-4" />
            Adjust Stock
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
              <AlertTriangleIcon className="size-4" />
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Total On-Hand Stock
            </CardTitle>
            <PackageCheckIcon className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalOnHand.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Physical units across all warehouses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Active Reserved
            </CardTitle>
            <LockIcon className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalReserved.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              15-minute checkout holds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Purchasable Available
            </CardTitle>
            <LayersIcon className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAvailable.toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              On-Hand minus active holds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">
              Low Stock Warnings
            </CardTitle>
            <ShieldAlertIcon className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {lowStockCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Items at or below safety threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("stock")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "stock"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PackageCheckIcon className="size-4" />
          Warehouse Stock Levels
          <Badge variant="secondary" className="ml-1 text-xs">
            {items.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab("locations")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "locations"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <WarehouseIcon className="size-4" />
          Warehouse Locations
          <Badge variant="outline" className="ml-1 text-xs">
            {locations.length}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "ledger"
              ? "bg-secondary text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HistoryIcon className="size-4" />
          Double-Entry Audit Ledger
          <Badge variant="outline" className="ml-1 text-xs">
            Immutable
          </Badge>
        </button>
      </div>

      {/* TAB 1: Stock Levels */}
      {activeTab === "stock" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Stock Distribution per Warehouse
            </CardTitle>
            <CardDescription>
              Real-time inventory levels broken down by physical location and
              active buyer reservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading inventory...
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <WarehouseIcon className="size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">
                  No stock initialized yet. Adjust stock on your listed offers
                  to begin.
                </p>
                <Button size="sm" onClick={() => handleOpenAdjustModal()}>
                  Perform First Restock
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      <th className="px-4 py-3">Listing SKU</th>
                      <th className="px-4 py-3">Warehouse</th>
                      <th className="px-4 py-3">Physical On-Hand</th>
                      <th className="px-4 py-3">Checkout Reserved</th>
                      <th className="px-4 py-3">Net Purchasable</th>
                      <th className="px-4 py-3">Buffer / Safety</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item) => {
                      const available = Math.max(0, item.onHand - item.reserved)
                      const isLow = item.onHand <= item.lowStockThreshold

                      return (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">
                                {item.sellerListing?.sellerSku || "SKU-UNKNOWN"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.sellerListing?.variant?.sku}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 font-medium">
                              <MapPinIcon className="size-3.5 text-muted-foreground" />
                              <span>{item.location?.name || "Hub"}</span>
                              <Badge
                                variant="outline"
                                className="ml-1 font-mono text-xs"
                              >
                                {item.location?.code}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            {item.onHand} units
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-amber-600">
                              {item.reserved} held
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-semibold ${
                                available > 0
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                            >
                              {available} units
                            </span>
                            {isLow && (
                              <Badge
                                variant="destructive"
                                className="ml-2 text-xs"
                              >
                                Low Stock
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {item.safetyStock} units
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAdjustModal(item)}
                            >
                              Adjust Stock
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
      )}

      {/* TAB 2: Warehouse Locations */}
      {activeTab === "locations" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locationsLoading ? (
            <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
              Loading warehouse hubs...
            </div>
          ) : locations.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <WarehouseIcon className="size-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">
                  No fulfillment warehouses configured. Register your first
                  facility to assign inventory.
                </p>
                <Button size="sm" onClick={() => setIsLocationModalOpen(true)}>
                  Register Warehouse
                </Button>
              </CardContent>
            </Card>
          ) : (
            locations.map((loc) => (
              <Card key={loc.id} className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-xs">
                      {loc.code}
                    </Badge>
                    {loc.isPrimary && (
                      <Badge
                        variant="default"
                        className="bg-emerald-600 text-xs text-white"
                      >
                        Primary Origin
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 text-base font-semibold">
                    {loc.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {loc.type.replace(/_/g, " ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    <div className="flex items-start gap-1.5">
                      <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <span>
                        {loc.address
                          ? `${loc.address.street1}, ${loc.address.city}, ${loc.address.state} - ${loc.address.postalCode}`
                          : "No street address mapped"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Double-Entry Audit Ledger */}
      {activeTab === "ledger" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Double-Entry Stock Audit Trail
            </CardTitle>
            <CardDescription>
              Append-only immutable record of all inventory transactions with
              snapshot balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ledgerLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading ledger entries...
              </div>
            ) : ledgerEntries.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No inventory ledger movements recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Delta Quantity</th>
                      <th className="px-4 py-3">Balance After</th>
                      <th className="px-4 py-3">Reference ID</th>
                      <th className="px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ledgerEntries.map((entry) => {
                      const isPositive = entry.quantityDelta > 0

                      return (
                        <tr
                          key={entry.id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              {entry.reason}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold ${
                                isPositive
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                            >
                              {isPositive ? (
                                <ArrowUpIcon className="size-3.5" />
                              ) : (
                                <ArrowDownIcon className="size-3.5" />
                              )}
                              {entry.quantityDelta > 0
                                ? `+${entry.quantityDelta}`
                                : entry.quantityDelta}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs font-medium">
                            {entry.balanceAfter} units
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {entry.referenceId || "—"}
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-xs text-muted-foreground">
                            {entry.note || "—"}
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
      )}

      {/* DIALOG 1: Stock Adjustment */}
      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Inventory Stock</DialogTitle>
            <DialogDescription>
              Record an audit-backed quantity change with reason and reference
              tracking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustStock} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Listing Offer
              </label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                required
                value={adjustForm.sellerListingId}
                onChange={(e) =>
                  setAdjustForm({
                    ...adjustForm,
                    sellerListingId: e.target.value,
                  })
                }
              >
                <option value="">Select listing...</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.sellerSku} — ₹{l.sellingPrice} ({l.variant?.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Warehouse Location
              </label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                required
                value={adjustForm.locationId}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, locationId: e.target.value })
                }
              >
                <option value="">Select warehouse...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Quantity Delta
                </label>
                <Input
                  type="number"
                  placeholder="+50 or -5"
                  required
                  value={adjustForm.quantityDelta}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      quantityDelta: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Reason
                </label>
                <select
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={adjustForm.reason}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      reason: e.target.value as any,
                    })
                  }
                >
                  <option value="RESTOCK">RESTOCK (Inbound Shipment)</option>
                  <option value="DAMAGE_WRITEOFF">
                    DAMAGE_WRITEOFF (Lost/Damaged)
                  </option>
                  <option value="INVENTORY_AUDIT_ADJUSTMENT">
                    AUDIT_ADJUSTMENT (Count Correction)
                  </option>
                  <option value="TRANSFER">
                    TRANSFER (Inter-facility move)
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Reference ID
                </label>
                <Input
                  placeholder="PO-29481"
                  value={adjustForm.referenceId}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      referenceId: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Safety Stock Buffer
                </label>
                <Input
                  type="number"
                  value={adjustForm.safetyStock}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      safetyStock: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Audit Notes
              </label>
              <Input
                placeholder="Optional explanation for audit records..."
                value={adjustForm.note}
                onChange={(e) =>
                  setAdjustForm({ ...adjustForm, note: e.target.value })
                }
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdjustModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isAdjustingStock}>
                {isAdjustingStock ? "Recording..." : "Apply Adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Register Warehouse Location */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Warehouse Location</DialogTitle>
            <DialogDescription>
              Configure a storage or shipping facility to track local stock.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLocation} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Warehouse Name
                </label>
                <Input
                  placeholder="e.g. Gurgaon North Hub"
                  required
                  value={locationForm.name}
                  onChange={(e) =>
                    setLocationForm({ ...locationForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Location Code
                </label>
                <Input
                  placeholder="GGN-WH-01"
                  required
                  className="font-mono uppercase"
                  value={locationForm.code}
                  onChange={(e) =>
                    setLocationForm({ ...locationForm, code: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Street Address
              </label>
              <Input
                placeholder="Plot 42, Udyog Vihar Phase 4"
                required
                value={locationForm.street1}
                onChange={(e) =>
                  setLocationForm({ ...locationForm, street1: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  City
                </label>
                <Input
                  placeholder="Gurgaon"
                  required
                  value={locationForm.city}
                  onChange={(e) =>
                    setLocationForm({ ...locationForm, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  State
                </label>
                <Input
                  placeholder="Haryana"
                  required
                  value={locationForm.state}
                  onChange={(e) =>
                    setLocationForm({ ...locationForm, state: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Postal Code
                </label>
                <Input
                  placeholder="122016"
                  required
                  value={locationForm.postalCode}
                  onChange={(e) =>
                    setLocationForm({
                      ...locationForm,
                      postalCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isPrimaryWarehouse"
                className="rounded border-input text-primary focus:ring-primary"
                checked={locationForm.isPrimary}
                onChange={(e) =>
                  setLocationForm({
                    ...locationForm,
                    isPrimary: e.target.checked,
                  })
                }
              />
              <label
                htmlFor="isPrimaryWarehouse"
                className="text-xs font-medium text-foreground"
              >
                Set as Primary Fulfillment Origin
              </label>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLocationModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingLocation}>
                {isCreatingLocation ? "Registering..." : "Register Hub"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
