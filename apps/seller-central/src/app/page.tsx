"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useAppSelector,
  useGetMeQuery,
  useGetSellerMeQuery,
} from "@workspace/store"
import { ArrowRight, Sparkles } from "lucide-react"
import { getSellerOnboardingRedirect } from "@/lib/onboarding"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import CTA from "@/components/landing/cta"

export default function LandingPage() {
  const router = useRouter()
  const { user: cachedUser } = useAppSelector((state) => state.auth)
  const { data: userData } = useGetMeQuery()
  const user = userData?.user || cachedUser

  const { data: sellerData, isLoading: isSellerLoading } = useGetSellerMeQuery(
    undefined,
    {
      skip: !user,
    }
  )

  const redirectTarget = getSellerOnboardingRedirect(sellerData?.seller)

  const handleStartSelling = () => {
    if (user) {
      if (redirectTarget) {
        router.push(redirectTarget)
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/register")
    }
  }

  const showOnboardingBanner = Boolean(
    user && redirectTarget && !isSellerLoading
  )

  return (
    <div className="flex w-full flex-1 flex-col bg-[#f9fafb] text-left font-sans">
      {/* Pending Onboarding Banner for logged in user */}
      {showOnboardingBanner && user && (
        <div className="flex w-full flex-col items-center justify-between gap-3 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 px-4 py-3.5 text-white shadow-inner sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5 text-xs font-semibold sm:text-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>
              Welcome back{" "}
              <strong className="text-amber-300">{user.email}</strong>! Complete
              your seller onboarding to start listing products.
            </span>
          </div>
          <Link
            href={redirectTarget || "/onboard"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-1.5 text-xs font-extrabold text-indigo-950 shadow-md transition-all hover:bg-amber-300"
          >
            <span>Complete Onboarding</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <Hero handleStartSelling={handleStartSelling} />
      <Features />
      <CTA handleStartSelling={handleStartSelling} />
    </div>
  )
}
