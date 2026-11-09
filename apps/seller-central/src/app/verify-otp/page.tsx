"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useVerifyOtpMutation, useResendOtpMutation } from "@workspace/store"
import {
  Loader2,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"

function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  const [otp, setOtp] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!email) {
      setErrorMsg("Email is missing. Please go back and register again.")
      return
    }

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setErrorMsg("Please enter a valid 6-digit OTP.")
      return
    }

    try {
      await verifyOtp({ email, otp }).unwrap()
      setSuccessMsg("Email verified successfully! Redirecting to sign in...")
      setTimeout(() => {
        router.push("/login?verified=true")
      }, 2000)
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "OTP verification failed."
      setErrorMsg(msg)
    }
  }

  const handleResend = async () => {
    setErrorMsg("")
    setSuccessMsg("")

    if (!email) {
      setErrorMsg("Email is missing.")
      return
    }

    try {
      await resendOtp({ email }).unwrap()
      setSuccessMsg("A new verification code has been sent to your email.")
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to resend OTP."
      setErrorMsg(msg)
    }
  }

  return (
    <div className="border-zinc-150 relative w-full max-w-md space-y-6 overflow-hidden rounded-3xl border bg-white p-8 shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900">
      {/* Floating gradient glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"></div>

      {/* Back Link */}
      <Link
        href="/register"
        className="hover:text-zinc-805 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition-colors dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Register
      </Link>

      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Verify Email
        </h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {email}
          </span>
        </p>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Verification Code (OTP)
          </label>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              disabled={isVerifying}
              className="border-zinc-250 w-full rounded-xl border bg-zinc-50 py-2.5 pr-4 pl-10 text-center font-mono text-sm font-bold tracking-widest placeholder-zinc-400 transition-all focus:border-indigo-500 focus:outline-none dark:border-zinc-800/80 dark:bg-zinc-950 dark:focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying || !email}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 disabled:opacity-50"
        >
          {isVerifying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Verify & Continue"
          )}
        </button>
      </form>

      {/* Resend OTP */}
      <div className="text-center text-xs text-zinc-500">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending || !email}
          className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </div>
    </div>
  )
}

export default function SellerVerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6 transition-colors dark:bg-zinc-950">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        }
      >
        <VerifyOtpContent />
      </Suspense>
    </div>
  )
}
