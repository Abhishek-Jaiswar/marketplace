"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useVerifyOtpMutation, useResendOtpMutation } from "@workspace/store"
import {
  Loader2,
  Mail,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  const [otp, setOtp] = useState("")
  const [localError, setLocalError] = useState("")
  const [localSuccess, setLocalSuccess] = useState("")
  const [cooldown, setCooldown] = useState(60)

  // Timer cooldown count
  useEffect(() => {
    if (cooldown <= 0) return
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setLocalSuccess("")

    if (!otp || otp.trim().length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP code.")
      return
    }

    try {
      await verifyOtp({ email, otp: otp.trim() }).unwrap()
      setLocalSuccess("Email verified successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/login?verified=true")
      }, 2000)
    } catch (err: unknown) {
      const errorPayload = err as {
        data?: { message?: string; error?: { message?: string } }
        message?: string
      }
      setLocalError(
        errorPayload.data?.error?.message ||
          errorPayload.data?.message ||
          errorPayload.message ||
          "Invalid or expired OTP code."
      )
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return
    setLocalError("")
    setLocalSuccess("")

    try {
      await resendOtp({ email }).unwrap()
      setLocalSuccess("A new OTP code has been sent to your email.")
      setCooldown(60) // reset cooldown
    } catch (err: unknown) {
      const errorPayload = err as {
        data?: { message?: string; error?: { message?: string } }
        message?: string
      }
      setLocalError(
        errorPayload.data?.error?.message ||
          errorPayload.data?.message ||
          errorPayload.message ||
          "Failed to resend OTP."
      )
    }
  }

  const errorPayload = error as
    | {
        data?: { message?: string; error?: { message?: string } }
        message?: string
      }
    | undefined
  const errorMessage =
    localError ||
    errorPayload?.data?.error?.message ||
    errorPayload?.data?.message ||
    (errorPayload ? "Something went wrong." : "")

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl font-black text-foreground">Verify Email</h2>
        <p className="text-xs text-muted-foreground">
          We sent a verification code to{" "}
          <span className="font-semibold text-foreground">
            {email || "your email"}
          </span>
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive transition-all duration-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Success Banner */}
      {localSuccess && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 transition-all duration-200">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">{localSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Input Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Verification Code (6-digit)
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              disabled={isLoading || !!localSuccess}
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-center font-mono text-sm font-bold tracking-[0.5em] text-foreground placeholder-muted-foreground/30 transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading || !!localSuccess}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-bold text-zinc-50 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Verifying code...</span>
            </>
          ) : (
            <span>Verify Code</span>
          )}
        </button>
      </form>

      {/* Resend Action */}
      <div className="pt-2 text-center text-xs text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        {cooldown > 0 ? (
          <span className="font-semibold text-zinc-500">
            Resend in {cooldown}s
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex cursor-pointer items-center gap-1 font-bold text-zinc-800 hover:underline disabled:opacity-50"
          >
            {isResending && <RefreshCw className="h-3 w-3 animate-spin" />}
            <span>Resend OTP</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  )
}
