"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  useAppSelector,
  useGetMeQuery,
  useLoginMutation,
} from "@workspace/store"
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Activity,
  Server,
  LockKeyhole,
} from "lucide-react"

import Logo from "@/components/logo"

export default function AdminLoginPage() {
  const router = useRouter()
  const { user: cachedUser } = useAppSelector((state) => state.auth)
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery()
  const [login, { isLoading: isLoginLoading }] = useLoginMutation()

  const currentUser = userData?.user || cachedUser

  // Form States
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Auto-redirect if already logged in as ADMIN
  useEffect(() => {
    if (
      !isUserLoading &&
      currentUser &&
      Array.isArray(currentUser.roles) &&
      currentUser.roles.includes("ADMIN")
    ) {
      router.push("/dashboard")
    }
  }, [currentUser, isUserLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!email || !password) {
      setErrorMsg("Please provide both email address and password.")
      return
    }

    try {
      const result = await login({
        email: email.trim(),
        password,
      }).unwrap()

      // Ensure the logged in account has ADMIN role
      if (result.user && Array.isArray(result.user.roles)) {
        if (!result.user.roles.includes("ADMIN")) {
          setErrorMsg("Access Denied: Administrator privileges required.")
          return
        }
      }

      router.push("/dashboard")
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Invalid administrator credentials."
      setErrorMsg(msg)
    }
  }

  if (
    isUserLoading &&
    currentUser &&
    Array.isArray(currentUser.roles) &&
    currentUser.roles.includes("ADMIN")
  ) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 p-6 font-sans text-zinc-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="font-mono text-xs font-semibold">
            Redirecting to Dashboard...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-left font-sans text-zinc-900 select-none lg:flex-row">
      {/* LEFT COLUMN: Admin Security Overview & System Stats */}
      <div className="relative hidden flex-col justify-between bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 p-8 text-white lg:flex lg:w-5/12 xl:w-4/12 xl:p-12">
        {/* Ambient Glow Effects */}
        <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl filter" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl filter" />

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <Logo light iconSize={32} subtitle="System Operations" />

          {/* Security & Monitoring Hero Card */}
          <div className="space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-indigo-200">
              <LockKeyhole className="h-3.5 w-3.5" /> Restricted Admin Portal
            </div>

            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-white">
              CBS Central Management & Control
            </h2>
            <p className="text-xs leading-relaxed font-medium text-indigo-200/80">
              Secure infrastructure operations for managing sellers, platform
              audit logs, payouts, and system analytics.
            </p>
          </div>

          {/* Real-time System Badges */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/20 text-indigo-300">
                <Activity className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">
                  Real-time Seller KYC Pipeline
                </span>
                <span className="text-[11px] leading-normal font-medium text-indigo-200/70">
                  Automated verification & merchant document inspection
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-500/20 text-purple-300">
                <Server className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">
                  Microservices Health & Audit
                </span>
                <span className="text-[11px] leading-normal font-medium text-indigo-200/70">
                  24/7 API telemetry, settlement logs & security monitoring
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">
                  End-to-End Encryption
                </span>
                <span className="text-[11px] leading-normal font-medium text-indigo-200/70">
                  Role-based access control with token session management
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning Footer */}
        <div className="relative z-10 flex items-center gap-2 border-t border-white/10 pt-6 text-[11px] font-medium text-indigo-300">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
          <span>Unauthorized access attempts are logged and monitored.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Admin Authentication Form (Light Mode) */}
      <div className="flex min-h-screen flex-1 flex-col justify-between bg-white p-8 sm:p-12 lg:p-16">
        {/* Top Header Logo for mobile */}
        <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-between lg:hidden">
          <Logo iconSize={30} />
        </div>

        {/* Main Form Container */}
        <div className="mx-auto my-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
              <ShieldCheck className="h-4 w-4" /> Admin Console Sign In
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              Administrator Login
            </h1>
            <p className="text-xs leading-relaxed font-medium text-zinc-500">
              Enter your admin credentials to access the central operations
              control center.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-left text-xs font-semibold text-red-700">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Email Address Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cbsmarketplace.com"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pr-4 pl-11 font-mono text-sm font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
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
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pr-11 pl-11 font-mono text-sm font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/15 focus:outline-none"
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

            {/* Remember Session */}
            <div className="flex items-center justify-between py-1 text-xs select-none">
              <label className="group flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900">
                  Keep admin session active
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoginLoading}
              className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold tracking-wide text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60"
            >
              {isLoginLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Authenticate Admin Portal</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Support Info */}
        <div className="mx-auto flex w-full max-w-md items-center justify-between border-t border-zinc-100 pt-6 text-center text-xs text-zinc-500">
          <span>CBS Operations Control v2.4</span>
          <span className="font-mono text-[11px] text-zinc-400">
            Internal Systems Only
          </span>
        </div>
      </div>
    </div>
  )
}
