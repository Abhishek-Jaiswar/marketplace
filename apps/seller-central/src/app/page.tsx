"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useGetMeQuery, useGetSellerMeQuery } from "@workspace/store";
import { ArrowRight, Sparkles } from "lucide-react";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import CTA from "@/components/landing/cta";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user: cachedUser } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
  const user = userData?.user || cachedUser;

  const { data: sellerData, isLoading: isSellerLoading } = useGetSellerMeQuery(undefined, {
    skip: !user,
  });

  const hasSellerProfile = Boolean(sellerData?.seller);

  const handleStartSelling = () => {
    if (user) {
      if (hasSellerProfile) {
        router.push("/dashboard");
      } else {
        router.push("/onboard");
      }
    } else {
      router.push("/register");
    }
  };

  const showOnboardingBanner = Boolean(user && !hasSellerProfile && !isSellerLoading);

  return (
    <div className="flex-1 w-full bg-[#f9fafb] flex flex-col text-left font-sans">
      {/* Pending Onboarding Banner for logged in user */}
      {showOnboardingBanner && user && (
        <div className="w-full bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white py-3.5 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>
              Welcome back <strong className="text-amber-300">{user.email}</strong>! Complete your seller onboarding to start listing products.
            </span>
          </div>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold text-xs shadow-md transition-all shrink-0"
          >
            <span>Complete Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <Hero handleStartSelling={handleStartSelling} />
      <Features />
      <CTA handleStartSelling={handleStartSelling} />
    </div>
  );
}