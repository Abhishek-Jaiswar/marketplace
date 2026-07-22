"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery, useGetSellerMeQuery } from "@workspace/store";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import CTA from "@/components/landing/cta";

export default function LandingPage() {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  const { data: sellerData } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });

  const handleStartSelling = () => {
    if (userData?.user) {
      if (sellerData?.seller) {
        router.push("/dashboard");
      } else {
        router.push("/onboard");
      }
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="flex-1 w-full bg-[#f9fafb] flex flex-col text-left font-sans">
      <Hero handleStartSelling={handleStartSelling} />
      <Features />
      <CTA handleStartSelling={handleStartSelling} />
    </div>
  );
}