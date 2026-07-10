"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@workspace/store";
import { Loader2, KeyRound, AlertCircle, ArrowLeft, Mail, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess("");

    if (!otp || !newPassword || !confirmPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (otp.trim().length !== 6) {
      setLocalError("OTP code must be a valid 6-digit number.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();

      setLocalSuccess("Password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?reset=true");
      }, 2000);
    } catch (err: unknown) {
      const errorPayload = err as { data?: { message?: string }; message?: string };
      setLocalError(errorPayload.data?.message || errorPayload.message || "Failed to reset password.");
    }
  };

  const errorPayload = error as { data?: { message?: string }; message?: string } | undefined;
  const errorMessage = localError || (errorPayload?.data?.message || (errorPayload ? "Something went wrong." : ""));

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1.5">
        <h2 className="text-2xl font-black text-foreground">Set New Password</h2>
        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-semibold text-foreground">{email || "your email"}</span> and your new password
        </p>
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
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{localSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Code Field */}
        <div className="space-y-1">
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Verification Code (6-digit)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              disabled={isLoading || !!localSuccess}
              className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-center tracking-[0.5em] font-mono font-bold text-foreground placeholder-muted-foreground/30 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || !!localSuccess}
              className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Confirm New Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Confirm New Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || !!localSuccess}
              className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isLoading || !!localSuccess}
          className="w-full h-11 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Updating password...</span>
            </>
          ) : (
            <span>Update Password</span>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
