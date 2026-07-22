"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetMeQuery,
  useGetSellerMeQuery,
  useVerifySellerAdminMutation,
} from "@workspace/store";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building,
  Store,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  Settings,
  ChevronRight,
  User,
  Shield,
  FileText,
  CreditCard,
  Edit,
} from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();

  const { data: userData, isLoading: userLoading } = useGetMeQuery();
  const { data: sellerData, isLoading: sellerLoading, refetch: refetchSeller } = useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });

  const [verifySeller, { isLoading: isVerifying }] = useVerifySellerAdminMutation();

  const [simRemarks, setSimRemarks] = useState("Looks authentic and verified.");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isLoading = userLoading || sellerLoading;

  // Handle Admin review simulation
  const handleAdminReview = async (status: "APPROVED" | "REJECTED") => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!sellerData?.seller?.id) {
      setErrorMsg("Seller ID is not found.");
      return;
    }

    try {
      const response = await verifySeller({
        sellerId: sellerData.seller.id,
        body: {
          status,
          remarks: simRemarks,
        },
      }).unwrap();

      setSuccessMsg(response.message || `Seller status updated successfully.`);
      await refetchSeller();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Failed to update seller status.");
    }
  };

  const handleEditDraft = () => {
    // Navigate to onboarding wizard
    router.push("/onboard");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-zinc-950 items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-zinc-500">Loading seller workspace...</p>
        </div>
      </div>
    );
  }

  const seller = sellerData?.seller;

  // Render Status Screens if not approved
  if (!seller) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-zinc-950 items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-zinc-900 border border-zinc-150 p-8 rounded-3xl shadow-sm space-y-6">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Profile Missing</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            You don&apos;t have a seller profile registered with this account yet.
          </p>
          <button
            onClick={() => router.push("/onboard")}
            className="w-full flex h-11 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg cursor-pointer"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  // 1. UNDER REVIEW SCREEN
  if (seller.status === "UNDER_REVIEW") {
    return (
      <div className="flex min-h-screen bg-white dark:bg-zinc-950 flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl space-y-8 text-center relative overflow-hidden">
          
          <Clock className="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto animate-pulse" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Application Under Review
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              We have received your business onboarding application for <span className="font-bold text-zinc-700 dark:text-zinc-300">{seller.businessName}</span>. 
              Our verification team is auditing your credentials. Typically this takes 24-48 hours.
            </p>
          </div>

          {/* Details list */}
          <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-850 text-left space-y-2 max-w-md mx-auto text-xs text-zinc-500">
            <div className="flex justify-between"><span>Legal Name:</span> <span className="font-semibold text-zinc-800 dark:text-zinc-200">{seller.businessName}</span></div>
            <div className="flex justify-between"><span>Shop link:</span> <span className="font-semibold text-zinc-800 dark:text-zinc-200">cbs.com/stores/{seller.store?.slug || "pending"}</span></div>
            <div className="flex justify-between"><span>Bank account:</span> <span className="font-semibold text-zinc-800 dark:text-zinc-200">****{seller.bankAccounts?.[0]?.accountNumber.slice(-4) || "pending"}</span></div>
            <div className="flex justify-between"><span>Uploaded Docs:</span> <span className="font-semibold text-emerald-600 dark:text-emerald-400">{seller.verification?.documents.length || 0} files</span></div>
          </div>

          {/* Admin simulator panel */}
          <div className="border-t border-zinc-100 dark:border-zinc-850 pt-6 space-y-4 text-left">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin Simulation Panel (Demo Tool)</span>
            </div>
            
            {errorMsg && <div className="text-red-500 text-xs font-semibold">{errorMsg}</div>}
            {successMsg && <div className="text-emerald-500 text-xs font-semibold">{successMsg}</div>}

            <div className="space-y-1.5">
              <label className="block text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                Auditing Notes / Remarks
              </label>
              <input
                type="text"
                value={simRemarks}
                onChange={(e) => setSimRemarks(e.target.value)}
                placeholder="e.g. Approved after verifying GST details."
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAdminReview("APPROVED")}
                disabled={isVerifying}
                className="h-10 rounded-xl bg-emerald-600 text-white font-semibold text-xs cursor-pointer shadow-md hover:bg-emerald-700 disabled:opacity-50"
              >
                Approve Seller ✓
              </button>
              <button
                onClick={() => handleAdminReview("REJECTED")}
                disabled={isVerifying}
                className="h-10 rounded-xl bg-red-600 text-white font-semibold text-xs cursor-pointer shadow-md hover:bg-red-700 disabled:opacity-50"
              >
                Reject Application ✗
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 2. REJECTED SCREEN
  if (seller.status === "REJECTED") {
    return (
      <div className="flex min-h-screen bg-white dark:bg-zinc-950 flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl space-y-8 text-center relative overflow-hidden">
          
          <XCircle className="w-14 h-14 text-red-500 mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Application Rejected
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Unfortunately, your onboarding application was rejected during audit.
            </p>
          </div>

          {/* Remarks banner */}
          <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-left space-y-1">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest font-mono">
              Rejection remarks
            </span>
            <p className="text-xs text-red-700 dark:text-red-400 font-medium">
              &quot;{seller.verification?.remarks || "No remarks provided."}&quot;
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleEditDraft}
              className="flex h-11 items-center gap-2 justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white cursor-pointer hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4" /> Edit Details & Re-submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. APPROVED SCREEN (ACTUAL SELLER CENTRAL DASHBOARD)
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-300">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-900 transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg">
              C
            </div>
            <span className="text-md font-bold tracking-tight font-mono">
              CBS <span className="text-indigo-600 dark:text-indigo-400">Seller Hub</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-bold uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-zinc-500">
              User: <span className="text-zinc-900 dark:text-zinc-100">{userData?.user?.email}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Dashboard layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-lg text-left">
          <div className="relative z-10 space-y-2 max-w-xl">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Welcome back, {seller.businessName}!
            </h2>
            <p className="text-xs text-indigo-200">
              Your store <span className="font-bold underline text-white">cbs-market.com/stores/{seller.store?.slug}</span> is live. Start adding products to receive customer orders!
            </p>
          </div>
          <div className="absolute right-[-10%] top-[-50%] w-[50%] h-[200%] opacity-15 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 blur-3xl pointer-events-none"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Revenue", value: "$0.00", icon: DollarSign },
            { label: "Orders Pending", value: "0", icon: ShoppingCart },
            { label: "Active Products", value: "0", icon: Package },
            { label: "Store Rating", value: "5.0 ★", icon: Star },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 mb-4">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase font-bold tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Middle panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Store info preview */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
              Store Profile
            </h3>
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850">
                <Store className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-bold text-zinc-900 dark:text-white truncate">
                  {seller.store?.displayName}
                </span>
                <span className="block text-xs text-zinc-400 truncate">
                  slug: {seller.store?.slug}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
              &quot;{seller.store?.description || "No description provided yet."}&quot;
            </p>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2.5 text-xs text-zinc-500">
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 shrink-0 text-zinc-400 mt-0.5" />
                <span>Pickup: {seller.store?.address?.street1}, {seller.store?.address?.city}, {seller.store?.address?.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 shrink-0 text-zinc-400" />
                <span>Bank Account: ****{seller.bankAccounts?.[0]?.accountNumber.slice(-4)} ({seller.bankAccounts?.[0]?.bankName})</span>
              </div>
            </div>
          </div>

          {/* Catalog placeholder & sales */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono mb-4">
                Active Catalog
              </h3>
              <div className="text-center py-10 space-y-3">
                <Package className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Products Listed</h4>
                  <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                    Your seller account is approved! The next step is listing your inventory so customers can browse.
                  </p>
                </div>
              </div>
            </div>
            
            <button className="w-full flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-850 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 cursor-pointer">
              Add First Product
            </button>
          </div>
        </div>

        {/* Admin reset helper (so the user can test the flow back and forth) */}
        <div className="bg-white dark:bg-zinc-900 border border-red-500/20 rounded-3xl p-6 text-left space-y-4">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Admin Control Panel (Demo Reset Tool)</span>
          </div>

          {errorMsg && <div className="text-red-500 text-xs font-semibold">{errorMsg}</div>}
          {successMsg && <div className="text-emerald-500 text-xs font-semibold">{successMsg}</div>}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAdminReview("REJECTED")}
              disabled={isVerifying}
              className="h-10 px-5 rounded-xl bg-red-600 text-white font-semibold text-xs cursor-pointer shadow-md hover:bg-red-700 disabled:opacity-50"
            >
              Reject / Suspend Seller Account
            </button>
            <button
              onClick={async () => {
                router.push("/seller");
              }}
              className="h-10 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold text-xs cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Log Out
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
