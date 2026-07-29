"use client"

import React, { useState, useEffect } from "react"
import {
  useGetSellerMeQuery,
  useGetMeQuery,
  useUpdateStoreMutation,
  useUpdateSellerProfileMutation,
  useAddBankAccountMutation,
  type BusinessType,
} from "@workspace/store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  StoreIcon,
  UserIcon,
  Building2Icon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  Loader2Icon,
  SaveIcon,
  EyeIcon,
  EyeOffIcon,
  ExternalLinkIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  GlobeIcon,
  SparklesIcon,
  LockIcon,
  CheckIcon,
} from "lucide-react"

type ActiveTab = "store" | "personal" | "business" | "banking" | "security"

const BUSINESS_TYPE_OPTIONS: { label: string; value: BusinessType }[] = [
  { label: "Individual", value: "INDIVIDUAL" },
  { label: "Sole Proprietorship", value: "SOLE_PROPRIETORSHIP" },
  { label: "Partnership", value: "PARTNERSHIP" },
  { label: "Limited Liability Partnership (LLP)", value: "LLP" },
  { label: "Private Limited Company", value: "PRIVATE_LIMITED" },
  { label: "Public Limited Company", value: "PUBLIC_LIMITED" },
]

export default function SettingsPage() {
  const { data: sellerData, isLoading: sellerLoading, refetch: refetchSeller } =
    useGetSellerMeQuery()
  const { data: userData, isLoading: userLoading } = useGetMeQuery()

  const [updateStore, { isLoading: isUpdatingStore }] = useUpdateStoreMutation()
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateSellerProfileMutation()
  const [addBankAccount, { isLoading: isUpdatingBank }] =
    useAddBankAccountMutation()

  const [activeTab, setActiveTab] = useState<ActiveTab>("store")
  const [showAccountNumber, setShowAccountNumber] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const seller = sellerData?.seller
  const user = userData?.user

  // Form States - Store
  const [storeForm, setStoreForm] = useState({
    displayName: "",
    slug: "",
    description: "",
    street1: "",
    street2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phoneNumber: "",
  })

  // Form States - Business
  const [businessForm, setBusinessForm] = useState({
    businessName: "",
    businessType: "SOLE_PROPRIETORSHIP" as BusinessType,
    contactEmail: "",
    contactPhone: "",
    gstin: "",
  })

  // Form States - Bank
  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  })

  // Pre-fill forms when seller data is loaded
  useEffect(() => {
    if (seller) {
      const store = seller.store
      if (store) {
        setStoreForm({
          displayName: store.displayName || "",
          slug: store.slug || "",
          description: store.description || "",
          street1: store.address?.street1 || "",
          street2: store.address?.street2 || "",
          landmark: store.address?.landmark || "",
          city: store.address?.city || "",
          state: store.address?.state || "",
          postalCode: store.address?.postalCode || "",
          country: store.address?.country || "India",
          phoneNumber: store.address?.phoneNumber || seller.contactPhone || "",
        })
      }

      setBusinessForm({
        businessName: seller.businessName || "",
        businessType: seller.businessType || "SOLE_PROPRIETORSHIP",
        contactEmail: seller.contactEmail || user?.email || "",
        contactPhone: seller.contactPhone || "",
        gstin: seller.gstin || "",
      })

      const primaryBank = seller.bankAccounts?.find((b) => b.isPrimary) || seller.bankAccounts?.[0]
      if (primaryBank) {
        setBankForm({
          accountHolderName: primaryBank.accountHolderName || "",
          bankName: primaryBank.bankName || "",
          accountNumber: primaryBank.accountNumber || "",
          ifscCode: primaryBank.ifscCode || "",
        })
      }
    }
  }, [seller, user])

  const showNotification = (type: "success" | "error", message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 5000)
  }

  // Submit Handlers
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateStore({
        displayName: storeForm.displayName,
        slug: storeForm.slug || undefined,
        description: storeForm.description || undefined,
        address: {
          street1: storeForm.street1,
          street2: storeForm.street2 || undefined,
          landmark: storeForm.landmark || undefined,
          city: storeForm.city,
          state: storeForm.state,
          postalCode: storeForm.postalCode,
          country: storeForm.country,
          phoneNumber: storeForm.phoneNumber || undefined,
        },
      }).unwrap()
      showNotification("success", "Store settings saved successfully!")
      refetchSeller()
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || "Failed to update store settings."
      )
    }
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        businessName: businessForm.businessName,
        businessType: businessForm.businessType,
        contactEmail: businessForm.contactEmail || undefined,
        contactPhone: businessForm.contactPhone || undefined,
        gstin: businessForm.gstin || undefined,
      }).unwrap()
      showNotification("success", "Business details updated successfully!")
      refetchSeller()
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || "Failed to update business details."
      )
    }
  }

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addBankAccount({
        accountHolderName: bankForm.accountHolderName,
        bankName: bankForm.bankName,
        accountNumber: bankForm.accountNumber,
        ifscCode: bankForm.ifscCode,
      }).unwrap()
      showNotification("success", "Payout bank account updated successfully!")
      refetchSeller()
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || "Failed to update bank account details."
      )
    }
  }

  if (sellerLoading || userLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2Icon className="size-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="text-xs font-medium tracking-wide">
          Loading Seller Settings...
        </span>
      </div>
    )
  }

  const statusColorMap: Record<string, string> = {
    APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    UNDER_REVIEW: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    DOCUMENTS_PENDING: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    DRAFT: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    REJECTED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  }

  const userInitials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "SE"

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border p-6">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src="/avatars/seller.jpg"
                alt={user?.firstName || "Seller"}
              />
              <AvatarFallback className="bg-primary text-lg font-bold text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight">
                  {seller?.store?.displayName ||
                    seller?.businessName ||
                    "Seller Store"}
                </h1>
                <Badge
                  variant="outline"
                  className={`border text-[11px] font-semibold tracking-wider uppercase ${
                    statusColorMap[seller?.status || "DRAFT"]
                  }`}
                >
                  {seller?.status || "DRAFT"}
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-2 text-xs hover:text-primary cursor-pointer">
                <GlobeIcon className="size-3.5 text-indigo-400" />
                <span>
                  {seller?.store?.slug
                    ? `seller.cbsmarketplace.com/store/${seller.store.slug}`
                    : "Store handle pending"}
                </span>
                {seller?.store?.slug && (
                  <a
                    href={`/store/${seller.store.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary"
                  >
                    <ExternalLinkIcon className="size-3" />
                  </a>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="rounded-full px-3 py-1 text-xs backdrop-blur-md">
              Seller ID:{" "}
              <span className="font-mono font-semibold">
                {seller?.id?.slice(0, 8)}...
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-medium shadow-xs transition-all ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-950 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-950 dark:bg-rose-900/30 dark:text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2Icon className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircleIcon className="size-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Layout Grid: Sidebar Tabs + Form Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Tabs */}
        <div className="space-y-1 lg:col-span-1">
          <nav className="flex space-x-1 overflow-x-auto rounded-xl bg-slate-100 p-1.5 lg:flex-col lg:space-y-1 lg:space-x-0 dark:bg-slate-900">
            <button
              onClick={() => setActiveTab("store")}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === "store"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <StoreIcon className="size-4 shrink-0" />
              <span>Store Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === "personal"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <UserIcon className="size-4 shrink-0" />
              <span>Personal Info</span>
            </button>

            <button
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === "business"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <Building2Icon className="size-4 shrink-0" />
              <span>Business & Tax</span>
            </button>

            <button
              onClick={() => setActiveTab("banking")}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === "banking"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <CreditCardIcon className="size-4 shrink-0" />
              <span>Payout & Banking</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-all ${
                activeTab === "security"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/50"
              }`}
            >
              <LockIcon className="size-4 shrink-0" />
              <span>Security</span>
            </button>
          </nav>

          {/* Quick Help Box */}
          <div className="hidden rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs lg:block dark:border-indigo-900/30 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 font-semibold text-indigo-950 dark:text-indigo-300">
              <SparklesIcon className="size-4 text-indigo-600" />
              <span>Storefront Tip</span>
            </div>
            <p className="mt-1.5 text-slate-600 dark:text-slate-400">
              Keep your store description clear and set your accurate pickup
              address to ensure smooth logistics calculation.
            </p>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3">
          {/* TAB 1: STORE PROFILE */}
          {activeTab === "store" && (
            <form onSubmit={handleStoreSubmit} className="space-y-6">
              <Card className="rounded-2xl shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <StoreIcon className="size-4 text-indigo-600" />
                    Storefront Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Customize your public seller storefront presence and
                    branding handle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Display Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={storeForm.displayName}
                        onChange={(e) =>
                          setStoreForm({
                            ...storeForm,
                            displayName: e.target.value,
                          })
                        }
                        placeholder="e.g. Apex Electronics Store"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Store Slug / Handle
                      </label>
                      <div className="relative">
                        <Input
                          value={storeForm.slug}
                          onChange={(e) =>
                            setStoreForm({
                              ...storeForm,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "-"),
                            })
                          }
                          placeholder="apex-electronics"
                          className="pl-28"
                        />
                        <span className="absolute top-2.5 left-3 text-xs text-slate-400 select-none">
                          store/
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Store Description
                    </label>
                    <textarea
                      value={storeForm.description}
                      onChange={(e) =>
                        setStoreForm({
                          ...storeForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Describe products, return promises, and store highlights..."
                      className="w-full rounded-xl border border-slate-200 bg-background p-3 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Warehouse & Pickup Address */}
              <Card className="rounded-2xl shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <MapPinIcon className="size-4 text-indigo-600" />
                    Pickup & Warehouse Address
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Location used for courier dispatch and order returns
                    calculation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Street Line 1 <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={storeForm.street1}
                        onChange={(e) =>
                          setStoreForm({
                            ...storeForm,
                            street1: e.target.value,
                          })
                        }
                        placeholder="Plot No. / Building Name / Suite"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Street Line 2
                      </label>
                      <Input
                        value={storeForm.street2}
                        onChange={(e) =>
                          setStoreForm({
                            ...storeForm,
                            street2: e.target.value,
                          })
                        }
                        placeholder="Area / Industrial Area"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Landmark
                      </label>
                      <Input
                        value={storeForm.landmark}
                        onChange={(e) =>
                          setStoreForm({
                            ...storeForm,
                            landmark: e.target.value,
                          })
                        }
                        placeholder="Near Metro Station or landmark"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={storeForm.city}
                        onChange={(e) =>
                          setStoreForm({ ...storeForm, city: e.target.value })
                        }
                        placeholder="e.g. Mumbai"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={storeForm.state}
                        onChange={(e) =>
                          setStoreForm({ ...storeForm, state: e.target.value })
                        }
                        placeholder="e.g. Maharashtra"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        PIN / Postal Code{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={storeForm.postalCode}
                        onChange={(e) =>
                          setStoreForm({
                            ...storeForm,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="400001"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Contact Phone
                      </label>
                      <Input
                        value={storeForm.phoneNumber}
                        onChange={(e) =>
                          setStoreForm({
                            ...storeForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-slate-50/50 py-3 dark:bg-slate-900/30">
                  <Button
                    type="submit"
                    disabled={isUpdatingStore}
                    className="gap-2 text-xs"
                  >
                    {isUpdatingStore ? (
                      <Loader2Icon className="size-3.5 animate-spin" />
                    ) : (
                      <SaveIcon className="size-3.5" />
                    )}
                    Save Store Profile
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* TAB 2: PERSONAL INFO */}
          {activeTab === "personal" && (
            <Card className="rounded-2xl shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <UserIcon className="size-4 text-indigo-600" />
                  Account Owner Details
                </CardTitle>
                <CardDescription className="text-xs">
                  Your primary administrator identity for Seller Central.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 rounded-xl bg-slate-100/70 p-4 dark:bg-slate-900/50">
                  <Avatar className="size-14 border border-slate-200 dark:border-slate-800">
                    <AvatarImage src="/avatars/seller.jpg" />
                    <AvatarFallback className="bg-indigo-600 font-bold text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-bold">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                    <Badge
                      variant="outline"
                      className="mt-1 text-[10px] font-semibold uppercase"
                    >
                      Account Owner
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      First Name
                    </label>
                    <Input
                      value={user?.firstName || ""}
                      disabled
                      readOnly
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <Input
                      value={user?.lastName || ""}
                      disabled
                      readOnly
                      className="bg-slate-50 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Input
                        value={user?.email || ""}
                        disabled
                        readOnly
                        className="bg-slate-50 pr-9 dark:bg-slate-900"
                      />
                      <MailIcon className="absolute top-2.5 right-3 size-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Primary Phone
                    </label>
                    <div className="relative">
                      <Input
                        value={seller?.contactPhone || "Not set"}
                        disabled
                        readOnly
                        className="bg-slate-50 pr-9 dark:bg-slate-900"
                      />
                      <PhoneIcon className="absolute top-2.5 right-3 size-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: BUSINESS & TAX */}
          {activeTab === "business" && (
            <form onSubmit={handleBusinessSubmit} className="space-y-6">
              <Card className="rounded-2xl shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Building2Icon className="size-4 text-indigo-600" />
                    Legal Business & GST Details
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Registered entity information verified during seller
                    onboarding.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Legal Business Name{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={businessForm.businessName}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            businessName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Business Entity Type{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={businessForm.businessType}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            businessType: e.target.value as BusinessType,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-background px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800"
                      >
                        {BUSINESS_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        GSTIN Identification Number
                      </label>
                      <div className="relative">
                        <Input
                          value={businessForm.gstin}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              gstin: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="22AAAAA0000A1Z5"
                        />
                        {businessForm.gstin && (
                          <ShieldCheckIcon className="absolute top-2.5 right-3 size-4 text-emerald-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Business Contact Email
                      </label>
                      <Input
                        type="email"
                        value={businessForm.contactEmail}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            contactEmail: e.target.value,
                          })
                        }
                        placeholder="billing@yourcompany.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Business Contact Phone
                      </label>
                      <Input
                        value={businessForm.contactPhone}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            contactPhone: e.target.value,
                          })
                        }
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  {/* Verification Status Banner */}
                  <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <ShieldCheckIcon className="size-4 text-indigo-600" />
                        <span>Seller Verification Status</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${statusColorMap[seller?.status || "DRAFT"]}`}
                      >
                        {seller?.status || "DRAFT"}
                      </Badge>
                    </div>
                    {seller?.verification?.businessRejectionReason && (
                      <p className="mt-2 text-xs text-rose-600">
                        Rejection reason:{" "}
                        {seller.verification.businessRejectionReason}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-slate-50/50 py-3 dark:bg-slate-900/30">
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="gap-2 text-xs"
                  >
                    {isUpdatingProfile ? (
                      <Loader2Icon className="size-3.5 animate-spin" />
                    ) : (
                      <SaveIcon className="size-3.5" />
                    )}
                    Save Business Details
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* TAB 4: PAYOUT & BANKING */}
          {activeTab === "banking" && (
            <form onSubmit={handleBankSubmit} className="space-y-6">
              <Card className="rounded-2xl shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <CreditCardIcon className="size-4 text-indigo-600" />
                    Payout Bank Account
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Bank details where revenue payouts and settlement funds will
                    be transferred.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Account Holder Name{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={bankForm.accountHolderName}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            accountHolderName: e.target.value,
                          })
                        }
                        placeholder="As written on bank passbook / statement"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Bank Name <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={bankForm.bankName}
                        onChange={(e) =>
                          setBankForm({ ...bankForm, bankName: e.target.value })
                        }
                        placeholder="e.g. HDFC Bank / ICICI Bank"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        IFSC Code <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={bankForm.ifscCode}
                        onChange={(e) =>
                          setBankForm({
                            ...bankForm,
                            ifscCode: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="HDFC0001234"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Account Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showAccountNumber ? "text" : "password"}
                          value={bankForm.accountNumber}
                          onChange={(e) =>
                            setBankForm({
                              ...bankForm,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder="Enter complete bank account number"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowAccountNumber(!showAccountNumber)
                          }
                          className="absolute top-2.5 right-3 text-slate-400 hover:text-slate-600"
                        >
                          {showAccountNumber ? (
                            <EyeOffIcon className="size-4" />
                          ) : (
                            <EyeIcon className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t bg-slate-50/50 py-3 dark:bg-slate-900/30">
                  <Button
                    type="submit"
                    disabled={isUpdatingBank}
                    className="gap-2 text-xs"
                  >
                    {isUpdatingBank ? (
                      <Loader2Icon className="size-3.5 animate-spin" />
                    ) : (
                      <SaveIcon className="size-3.5" />
                    )}
                    Save Bank Details
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === "security" && (
            <Card className="rounded-2xl shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <LockIcon className="size-4 text-indigo-600" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-xs">
                  Manage login password and active sessions security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold">
                        Password Management
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Ensure your account password is strong and unique.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Security Recommendations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="size-4 shrink-0 text-emerald-500" />
                      <span>
                        Use distinct passwords for seller and customer accounts
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="size-4 shrink-0 text-emerald-500" />
                      <span>Keep bank payout details confidential</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="size-4 shrink-0 text-emerald-500" />
                      <span>Never share OTPs with third parties</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
