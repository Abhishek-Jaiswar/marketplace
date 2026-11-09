"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLoginMutation } from "@workspace/store"
import {
  Loader2,
  KeyRound,
  Mail,
  AlertCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVerified = searchParams.get("verified") === "true"
  const isReset = searchParams.get("reset") === "true"

  const [login, { isLoading, error }] = useLoginMutation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password) {
      setLocalError("Please fill in all fields.")
      return
    }

    try {
      await login({ email: email.trim(), password }).unwrap()
      // Redirect to home page on success
      router.push("/")
    } catch (err: unknown) {
      const errorPayload = err as {
        data?: { message?: string; error?: { message?: string } }
        message?: string
      }
      const msg =
        errorPayload.data?.error?.message ||
        errorPayload.data?.message ||
        errorPayload.message ||
        ""
      if (
        msg.toLowerCase().includes("not verified") ||
        msg.toLowerCase().includes("verify your email")
      ) {
        router.push(
          `/verify-otp?email=${encodeURIComponent(email.trim())}&purpose=REGISTER`
        )
      } else {
        setLocalError(msg || "Invalid email or password.")
      }
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
        <h2 className="text-2xl font-black text-foreground">Sign In</h2>
        <p className="text-xs text-muted-foreground">
          Access your CBS Marketplace account
        </p>
      </div>

      {/* Success Banner from verified or reset redirect */}
      {isVerified && !errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 transition-all duration-200 dark:text-emerald-400">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">
            Your email has been verified. Please sign in below.
          </span>
        </div>
      )}

      {isReset && !errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 transition-all duration-200 dark:text-emerald-400">
          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">
            Your password has been reset successfully. Please sign in below.
          </span>
        </div>
      )}

      {/* Error Banner displayed above top fields */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive transition-all duration-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
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
              disabled={isLoading}
              className="dark:focus:border-zinc-650 w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase hover:text-foreground"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="dark:focus:border-zinc-650 w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-bold text-zinc-50 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="pt-2 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-zinc-800 hover:underline dark:text-zinc-200"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
