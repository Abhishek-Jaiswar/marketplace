"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterSellerMutation } from "@workspace/store";
import { Loader2, User, Mail, Lock, Building, AlertCircle, ArrowLeft } from "lucide-react";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [registerSeller, { isLoading }] = useRegisterSellerMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("INDIVIDUAL");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName || !email || !password || !businessName || !businessType) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      await registerSeller({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        password,
        businessName: businessName.trim(),
        businessType: businessType as any,
      }).unwrap();

      // Redirect to OTP verification page
      router.push(`/seller/verify-otp?email=${encodeURIComponent(email.trim())}`);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Registration failed.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Floating gradient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        {/* Back Link */}
        <Link
          href="/seller"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Create Seller Account
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Register to sell on CBS Marketplace
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  disabled={isLoading}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  disabled={isLoading}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@company.com"
                required
                disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
              />
            </div>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 my-4 pt-4"></div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              Company/Legal Business Name *
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Corporation Pvt Ltd"
                required
                disabled={isLoading}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-all placeholder-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              Business Type *
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              disabled={isLoading}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none transition-all text-zinc-700 dark:text-zinc-300"
            >
              <option value="INDIVIDUAL">Individual / Proprietorship</option>
              <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="LLP">Limited Liability Partnership (LLP)</option>
              <option value="PRIVATE_LIMITED">Private Limited Company</option>
              <option value="PUBLIC_LIMITED">Public Limited Company</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Create Seller Account"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href="/seller/login" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
