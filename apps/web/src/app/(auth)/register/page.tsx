"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@workspace/store";
import { Loader2, KeyRound, Mail, AlertCircle, ArrowRight, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!firstName || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim(),
        password,
      }).unwrap();
      
      // Redirect to OTP verification page on success
      router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}&purpose=REGISTER`);
    } catch (err: unknown) {
      const errorPayload = err as { data?: { message?: string }; message?: string };
      setLocalError(errorPayload.data?.message || errorPayload.message || "Failed to create account.");
    }
  };

  const errorPayload = error as { data?: { message?: string }; message?: string } | undefined;
  const errorMessage = localError || (errorPayload?.data?.message || (errorPayload ? "Something went wrong." : ""));

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1.5">
        <h2 className="text-2xl font-black text-foreground">Create Account</h2>
        <p className="text-xs text-muted-foreground">Join the CBS Marketplace community</p>
      </div>

      {/* Error Banner displayed above top fields */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs transition-all duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                disabled={isLoading}
                className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={isLoading}
                className="w-full bg-muted/40 border border-border focus:border-zinc-400 dark:focus:border-zinc-650 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Email Address *
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
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Password *
          </label>
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

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            Confirm Password *
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Registering account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-zinc-800 dark:text-zinc-200 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
