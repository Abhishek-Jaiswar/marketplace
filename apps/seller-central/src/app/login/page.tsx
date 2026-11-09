"use client"
import { brand } from "@workspace/ui/lib/brand"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLoginMutation, useLazyGetSellerMeQuery } from "@workspace/store"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Settings,
  Shield,
  Loader2,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react"

import { Logo } from "@workspace/ui/components/logo"
import { getSellerOnboardingRedirect } from "@/lib/onboarding"

export default function LoginPage() {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  const [getSellerMe] = useLazyGetSellerMeQuery()

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  // States
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!emailOrPhone || !password) {
      setErrorMsg("Please enter both email/phone and password.")
      return
    }

    try {
      await login({ email: emailOrPhone.trim(), password }).unwrap()

      // Fetch seller profile to determine correct redirect target
      try {
        const sellerRes = await getSellerMe(undefined).unwrap()
        const seller = sellerRes?.seller
        const redirectTarget = getSellerOnboardingRedirect(seller)
        if (redirectTarget) {
          router.push(redirectTarget)
          return
        }
        router.push("/dashboard")
        return
      } catch {
        // Seller profile fetch failed or doesn't exist yet
      }

      router.push("/onboard")
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Invalid credentials."
      if (msg.toLowerCase().includes("not verified")) {
        router.push(
          `/verify-otp?email=${encodeURIComponent(emailOrPhone.trim())}`
        )
      } else {
        setErrorMsg(msg)
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white text-left font-sans select-none lg:flex-row">
      {/* LEFT COLUMN: Sidebar Benefits & Hero Image */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 p-8 text-white lg:flex lg:w-5/12 xl:w-4/12 xl:p-12">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl filter" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl filter" />

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <Logo size="lg" tone="inverse" descriptor="Seller Central" />

          {/* Hero Image Section */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900">
              <Image
                src="/login-side-img.png"
                alt={`${brand.name} Seller Central Dashboard`}
                fill
                className="object-cover object-top transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/20 text-indigo-300">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  Grow Your Business
                </span>
                <span className="text-xs leading-normal font-medium text-indigo-200/70">
                  Reach millions of active buyers across India
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/20 text-indigo-300">
                <Settings className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  Easy Onboarding
                </span>
                <span className="text-xs leading-normal font-medium text-indigo-200/70">
                  Quick account setup & automated catalog management
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/20 text-indigo-300">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  Secure & Timely Payouts
                </span>
                <span className="text-xs leading-normal font-medium text-indigo-200/70">
                  Protected payments directly to your bank account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-xs font-medium text-indigo-300">
            Trusted by 100,000+ sellers
          </span>
          <div className="flex -space-x-2 overflow-hidden">
            {[
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop",
            ].map((src, idx) => (
              <Image
                key={idx}
                className="inline-block h-7 w-7 rounded-full object-cover ring-2 ring-indigo-900"
                src={src}
                alt="Seller avatar"
                width={28}
                height={28}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Signin Form */}
      <div className="flex min-h-screen flex-1 flex-col justify-between bg-white p-8 sm:p-12 lg:p-16">
        {/* Top Header Navigation */}
        <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-between">
          <div className="lg:hidden">
            <Logo size="lg" descriptor="Seller Central" />
          </div>

          <div className="ml-auto text-sm font-medium text-zinc-500">
            New to {brand.name} Seller Hub?{" "}
            <Link
              href="/register"
              className="ml-1 font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Main Form Box */}
        <div className="mx-auto my-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
              <ShieldCheck className="h-4 w-4" /> Official Seller Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Welcome back!
            </h1>
            <p className="text-sm leading-relaxed font-medium text-zinc-500">
              Log in to access your seller dashboard, manage orders & inventory.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
                Mobile Number or Email Address
              </label>
              <div className="relative flex items-center">
                <User className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Enter email or mobile number"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pr-4 pl-11 text-sm font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pr-11 pl-11 text-sm font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 rounded-md p-1 text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between py-1 text-xs select-none">
              <label className="group flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Seller Hub</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Support Info */}
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-500">
          <span>Need seller assistance?</span>
          <div className="flex items-center gap-3 font-semibold text-zinc-700">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-indigo-600" /> 1800-123-4455
            </span>
            <span className="h-3 w-[1px] bg-zinc-200" />
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-indigo-600" /> support@cbs.com
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
