"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "@workspace/store";
import { Loader2, KeyRound, Mail, AlertCircle, ArrowRight, CheckCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const isReset = searchParams.get("reset") === "true";

  const [login, { isLoading, error }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    try {
      await login({ email: email.trim(), password }).unwrap();
      // Redirect to home page on success
      router.push("/");
    } catch (err: unknown) {
      const errorPayload = err as { data?: { message?: string }; message?: string };
      const msg = errorPayload.data?.message || errorPayload.message || "";
      if (msg.toLowerCase().includes("not verified") || msg.toLowerCase().includes("verify your email")) {
        router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}&purpose=REGISTER`);
      } else {
        setLocalError(msg || "Invalid email or password.");
      }
    }
  };

  const errorPayload = error as { data?: { message?: string }; message?: string } | undefined;
  const errorMessage = localError || (errorPayload?.data?.message || (errorPayload ? "Something went wrong." : ""));

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1.5">
        <h2 className="text-2xl font-black text-foreground">Sign In</h2>
        <p className="text-xs text-muted-foreground">Access your CBS Marketplace account</p>
      </div>

      {/* Success Banner from verified or reset redirect */}
      {isVerified && !errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs transition-all duration-200">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">Your email has been verified. Please sign in below.</span>
        </div>
      )}

      {isReset && !errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs transition-all duration-200">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">Your password has been reset successfully. Please sign in below.</span>
        </div>
      )}

      {/* Error Banner displayed above top fields */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs transition-all duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              disabled={isLoading}
              className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] text-zinc-500 hover:text-foreground font-semibold uppercase tracking-wider"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-zinc-800 dark:text-zinc-200 font-bold hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
