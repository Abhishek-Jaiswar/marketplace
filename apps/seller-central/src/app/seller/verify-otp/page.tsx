"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtpMutation, useResendOtpMutation } from "@workspace/store";
import { Loader2, KeyRound, Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Email is missing. Please go back and register again.");
      return;
    }

    if (otp.length !== 6 || isNaN(Number(otp))) {
      setErrorMsg("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyOtp({ email, otp }).unwrap();
      setSuccessMsg("Email verified successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/seller/login?verified=true");
      }, 2000);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "OTP verification failed.";
      setErrorMsg(msg);
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Email is missing.");
      return;
    }

    try {
      await resendOtp({ email }).unwrap();
      setSuccessMsg("A new verification code has been sent to your email.");
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to resend OTP.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl space-y-6 relative overflow-hidden">
      
      {/* Floating gradient glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

      {/* Back Link */}
      <Link
        href="/seller/register"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Register
      </Link>

      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Verify Email
        </h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Enter the 6-digit code sent to <span className="font-semibold text-zinc-700 dark:text-zinc-300">{email}</span>
        </p>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
            Verification Code (OTP)
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              disabled={isVerifying}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 focus:border-indigo-500 dark:border-zinc-800/80 dark:focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm tracking-widest font-mono text-center focus:outline-none transition-all placeholder-zinc-400 font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying || !email}
          className="w-full flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/35 disabled:opacity-50 cursor-pointer"
        >
          {isVerifying ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
          className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 cursor-pointer"
        >
          {isResending ? "Sending..." : "Resend Code"}
        </button>
      </div>
    </div>
  );
}

export default function SellerVerifyOtpPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 items-center justify-center p-6 transition-colors">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }>
        <VerifyOtpContent />
      </Suspense>
    </div>
  );
}
