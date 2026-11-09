"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useResetPasswordMutation } from "@workspace/store"
import {
  Loader2,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  Mail,
  CheckCircle,
} from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation()

  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [localSuccess, setLocalSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setLocalSuccess("")

    if (!otp || !newPassword || !confirmPassword) {
      setLocalError("Please fill in all fields.")
      return
    }

    if (otp.trim().length !== 6) {
      setLocalError("OTP code must be a valid 6-digit number.")
      return
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.")
      return
    }

    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap()

      setLocalSuccess(
        "Password has been reset successfully! Redirecting to login..."
      )
      setTimeout(() => {
        router.push("/login?reset=true")
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
          "Failed to reset password."
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
        <h2 className="text-2xl font-black text-foreground">
          Set New Password
        </h2>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-foreground">
            {email || "your email"}
          </span>{" "}
          and your new password
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
        {/* OTP Code Field */}
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

        {/* New Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            New Password
          </label>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || !!localSuccess}
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Confirm New Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Confirm New Password
          </label>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || !!localSuccess}
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
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
              <span>Updating password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>

      {/* Back Link */}
      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
