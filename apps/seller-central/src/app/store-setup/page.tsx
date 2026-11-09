"use client"
import { brand } from "@workspace/ui/lib/brand"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  useGetMeQuery,
  useGetSellerMeQuery,
  useUpdateStoreMutation,
  useSubmitOnboardingMutation,
} from "@workspace/store"
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"

import { Logo } from "@workspace/ui/components/logo"
import {
  StoreBrandingSection,
  CATEGORIES,
} from "./components/StoreBrandingSection"
import { LogisticsPickupSection } from "./components/LogisticsPickupSection"
import { HelpFloatingButton } from "../onboard/components/HelpFloatingButton"

export default function StoreSetupPage() {
  const router = useRouter()

  const { data: userData } = useGetMeQuery()
  const { data: sellerData, refetch: refetchSeller } = useGetSellerMeQuery(
    undefined,
    {
      skip: !userData?.user,
    }
  )

  const [updateStore, { isLoading: isSavingStore }] = useUpdateStoreMutation()
  const [submitOnboarding, { isLoading: isSubmitting }] =
    useSubmitOnboardingMutation()

  // Form States
  const [displayName, setDisplayName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState(
    CATEGORIES[0] || "Consumer Electronics & Accessories"
  )

  // Logistics Address States
  const [street1, setStreet1] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [isPinLoading, setIsPinLoading] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

  const [errorMsg, setErrorMsg] = useState("")
  const [copiedSlug, setCopiedSlug] = useState(false)

  // Auto-fill existing store details or prefill from GSTIN
  useEffect(() => {
    if (sellerData?.seller) {
      const seller = sellerData.seller

      if (
        seller.status === "APPROVED" ||
        seller.status === "UNDER_REVIEW" ||
        seller.status === "REJECTED"
      ) {
        router.push("/dashboard")
        return
      }

      // Guard: Ensure user completed Step 1 (GSTIN) & Step 2 (Bank details) before accessing store-setup
      const hasBusinessDetails = Boolean(seller.gstin)
      const hasBankAccounts = Boolean(
        seller.bankAccounts && seller.bankAccounts.length > 0
      )
      if (!hasBusinessDetails) {
        router.push("/onboard?step=1")
        return
      }
      if (!hasBankAccounts) {
        router.push("/onboard?step=2")
        return
      }

      const existingStore = seller.store

      // Prefill Display Name: Use existing store name OR fallback to GSTIN businessName
      const defaultName =
        existingStore?.displayName || seller.businessName || ""
      setDisplayName(defaultName)

      if (defaultName) {
        setSlug(
          defaultName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        )
      }

      if (existingStore?.description) {
        setDescription(existingStore.description)
      }

      // Prefill address if existing
      if (existingStore?.address) {
        const addr = existingStore.address
        if (addr.street1) setStreet1(addr.street1)
        if (addr.city) setCity(addr.city)
        if (addr.state) setState(addr.state)
        if (addr.postalCode) setPostalCode(addr.postalCode)
      }
    }
  }, [sellerData, router])

  // Handle Display Name change & Auto Slugification
  const handleNameChange = (val: string) => {
    setDisplayName(val)
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setSlug(generatedSlug)
  }

  // PIN Code Auto-Lookup for Indian Postal PIN
  const handlePinChange = async (val: string) => {
    const cleanPin = val.replace(/\D/g, "").slice(0, 6)
    setPostalCode(cleanPin)
    setPinSuccess(false)

    if (cleanPin.length === 6) {
      try {
        setIsPinLoading(true)
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${cleanPin}`
        )
        const data = await res.json()
        if (
          Array.isArray(data) &&
          data[0]?.Status === "Success" &&
          data[0]?.PostOffice?.length > 0
        ) {
          const po = data[0].PostOffice[0]
          setCity(po.District || po.Block || po.Name)
          setState(po.State)
          setPinSuccess(true)
        }
      } catch (err) {
        console.error("PIN lookup failed:", err)
      } finally {
        setIsPinLoading(false)
      }
    }
  }

  const handleCopySlug = () => {
    navigator.clipboard.writeText(`https://cbsmarketplace.com/store/${slug}`)
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2000)
  }

  const handleFinalizeSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!displayName.trim()) {
      setErrorMsg("Please provide a Store Display Name.")
      return
    }

    if (
      !street1.trim() ||
      !city.trim() ||
      !state.trim() ||
      !postalCode.trim()
    ) {
      setErrorMsg("Please fill out complete pickup address details.")
      return
    }

    try {
      // 1. Save Store & Address
      await updateStore({
        displayName: displayName.trim(),
        description: description.trim(),
        address: {
          street1: street1.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: "India",
        },
      }).unwrap()

      // 2. Finalize Onboarding Status
      await submitOnboarding().unwrap()
      await refetchSeller()

      // 3. Launch into Dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to finalize store setup."
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans text-zinc-900 select-none">
      {/* SOP HEADER BAR */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white shadow-xs backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo size="md" descriptor="Store Setup Portal" />
            <div className="hidden items-center gap-2 border-l border-zinc-200 pl-3 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Legal KYB Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex hidden flex-col text-right md:block">
              <span className="text-xs font-bold text-zinc-800">
                Phase 2 of 2: Storefront & Pickup
              </span>
              <span className="text-[10px] font-semibold text-zinc-400">
                Final step before launching
              </span>
            </div>
            <div className="hidden h-2 w-24 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 sm:block">
              <div className="h-full w-[90%] rounded-full bg-indigo-600 transition-all" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="mx-auto max-w-4xl space-y-6 px-4 pt-8 text-left sm:px-6">
        {/* HERO TITLE CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" /> Welcome to {brand.name}{" "}
              Storefront Setup
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Customize Your Digital Store & Pickup Address
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed font-medium text-indigo-200/80 sm:text-sm">
              Configure your merchant storefront branding and courier pickup
              location. Customers will see your store name on product listings
              and invoices.
            </p>
          </div>
        </div>

        {/* ERROR NOTICE */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM CONTAINER */}
        <form onSubmit={handleFinalizeSetup} className="space-y-6">
          {/* SECTION 1: STORE BRANDING */}
          <StoreBrandingSection
            displayName={displayName}
            onDisplayNameChange={handleNameChange}
            category={category}
            onCategoryChange={setCategory}
            slug={slug}
            copiedSlug={copiedSlug}
            onCopySlug={handleCopySlug}
            description={description}
            onDescriptionChange={setDescription}
          />

          {/* SECTION 2: LOGISTICS PICKUP LOCATION */}
          <LogisticsPickupSection
            street1={street1}
            onStreetChange={setStreet1}
            postalCode={postalCode}
            onPinChange={handlePinChange}
            isPinLoading={isPinLoading}
            pinSuccess={pinSuccess}
            city={city}
            onCityChange={setCity}
            state={state}
            onStateChange={setState}
          />

          {/* SUBMIT BUTTON */}
          <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Your merchant storefront will be immediately published.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSavingStore || isSubmitting}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 sm:w-auto"
            >
              {isSavingStore || isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Launch Storefront & Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <HelpFloatingButton />
    </div>
  )
}
