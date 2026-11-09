"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForgotPasswordMutation } from "@workspace/store"
import { Loader2, Mail, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation()

  const [email, setEmail] = useState("")
  const [localError, setLocalError] = useState("")
  const [localSuccess, setLocalSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setLocalSuccess("")

    if (!email) {
      setLocalError("Please enter your email address.")
      return
    }

    try {
      await forgotPassword({ email: email.trim() }).unwrap()
      setLocalSuccess("A password reset code has been sent to your email.")
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`)
      }, 2000)
    } catch (err: unknown) {
      const errorPayload = err as {
        data?: { message?: string }
        message?: string
      }
      setLocalError(
        errorPayload.data?.message ||
          errorPayload.message ||
          "Failed to initiate password reset."
      )
    }
  }

  const errorPayload = error as
    { data?: { message?: string }; message?: string } | undefined
  const errorMessage =
    localError ||
    errorPayload?.data?.message ||
    (errorPayload ? "Something went wrong." : "")

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl font-black text-foreground">Reset Password</h2>
        <p className="text-xs text-muted-foreground">
          Enter your email and we&apos;ll send you a verification code to reset
          your password
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
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 transition-all duration-200 dark:text-emerald-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 rotate-180" />
          <span className="leading-relaxed font-medium">{localSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={isLoading || !!localSuccess}
              className="dark:focus:border-zinc-650 w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !!localSuccess}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-bold text-zinc-50 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Sending code...</span>
            </>
          ) : (
            <>
              <span>Send Code</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </>
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
