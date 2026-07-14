"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetMeQuery, useGetSellerMeQuery } from "@workspace/store";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Building,
  Store,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  Lock,
} from "lucide-react";

export default function SellerLandingPage() {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const { data: sellerData, isLoading: sellerLoading } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });

  const isLoading = userLoading || (userData?.user && sellerLoading);


  return (
    <div>
      seller
    </div>
  );
}
