"use client"
import { brand } from "@workspace/ui/lib/brand"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRegisterMutation } from "@workspace/store"
import {
  Loader2,
  KeyRound,
  Mail,
  AlertCircle,
  ArrowRight,
  User,
} from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [register, { isLoading, error }] = useRegisterMutation()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [isNavigating, setIsNavigating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!firstName || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all required fields.")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.")
      return
    }

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        password,
      }).unwrap()

      setIsNavigating(true)
      // Redirect to OTP verification page on success
      router.push(
        `/verify-otp?email=${encodeURIComponent(email.trim())}&purpose=REGISTER`
      )
    } catch (err: unknown) {
      setIsNavigating(false)
      const errorPayload = err as {
        data?: { message?: string; error?: { message?: string } }
        message?: string
      }
      setLocalError(
        errorPayload.data?.error?.message ||
          errorPayload.data?.message ||
          errorPayload.message ||
          "Failed to create account."
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
        <h2 className="text-2xl font-black text-foreground">Create Account</h2>
        <p className="text-xs text-muted-foreground">
          Join the {brand.marketplaceName} community
        </p>
      </div>

      {/* Error Banner displayed above top fields */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive transition-all duration-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Email Address *
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
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Password *
          </label>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            Confirm Password *
          </label>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pr-4 pl-10 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isNavigating}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-bold text-zinc-50 transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading || isNavigating ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              <span>
                {isNavigating
                  ? "Redirecting to verification..."
                  : "Registering account..."}
              </span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="pt-2 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-zinc-800 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
