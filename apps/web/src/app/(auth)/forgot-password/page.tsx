"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@workspace/store";
import { Loader2, Mail, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess("");

    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }

    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setLocalSuccess("A password reset code has been sent to your email.");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 2000);
    } catch (err: unknown) {
      const errorPayload = err as { data?: { message?: string }; message?: string };
      setLocalError(errorPayload.data?.message || errorPayload.message || "Failed to initiate password reset.");
    }
  };

  const errorPayload = error as { data?: { message?: string }; message?: string } | undefined;
  const errorMessage = localError || (errorPayload?.data?.message || (errorPayload ? "Something went wrong." : ""));

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1.5">
        <h2 className="text-2xl font-black text-foreground">Reset Password</h2>
        <p className="text-xs text-muted-foreground">Enter your email and we&apos;ll send you a verification code to reset your password</p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs transition-all duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Success Banner */}
      {localSuccess && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs transition-all duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 rotate-180" />
          <span className="leading-relaxed font-medium">{localSuccess}</span>
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
              disabled={isLoading || !!localSuccess}
              className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !!localSuccess}
          className="w-full h-11 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Sending code...</span>
            </>
          ) : (
            <>
              <span>Send Code</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Back Link */}
      <div className="text-center pt-2">
        <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
