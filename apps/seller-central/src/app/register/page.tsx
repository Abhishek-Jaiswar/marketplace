"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterSellerMutation } from "@workspace/store";
import {
  User,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Settings,
  Shield,
  Loader2,
  ShoppingBag,
  ArrowRight,
  Phone,
} from "lucide-react";

import Logo from "@/components/logo";

export default function RegisterPage() {
  const router = useRouter();
  const [registerSeller, { isLoading }] = useRegisterSellerMutation();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agreed) {
      setErrorMsg("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (mobileNumber.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || undefined;

    try {
      await registerSeller({
        firstName,
        lastName,
        email,
        password,
        businessName: `${fullName}'s Store`,
        businessType: "INDIVIDUAL",
      }).unwrap();

      // Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row text-left font-sans select-none">
      {/* LEFT COLUMN: Sidebar Benefits & Hero Image */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-4/12 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 xl:p-12 flex-col justify-between relative">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <Logo light iconSize={36} />

          {/* Hero Image Section */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-3 shadow-2xl">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900">
              <img
                src="/login-side-img.png"
                alt="CBS Seller Central Dashboard"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4">
            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  Grow Your Business
                </span>
                <span className="text-xs text-indigo-200/70 font-medium leading-normal">
                  Reach millions of active buyers across India
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  0% Commission Models
                </span>
                <span className="text-xs text-indigo-200/70 font-medium leading-normal">
                  Competitive rates and transparent fee structures
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-white">
                  Fast 7-Day Settlements
                </span>
                <span className="text-xs text-indigo-200/70 font-medium leading-normal">
                  Quick payouts directly into your bank account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-indigo-300 font-medium">
            Join 100,000+ registered sellers
          </span>
          <div className="flex -space-x-2 overflow-hidden">
            {[
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop",
            ].map((src, idx) => (
              <img
                key={idx}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-indigo-900 object-cover"
                src={src}
                alt="Seller avatar"
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Signup Form */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white min-h-screen">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between max-w-xl mx-auto w-full mb-6">
          <div className="lg:hidden">
            <Logo iconSize={32} />
          </div>

          <div className="text-sm font-medium text-zinc-500 ml-auto">
            Already have a seller account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline ml-1"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-xl w-full mx-auto space-y-6 my-auto">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600">
              <ShieldCheck className="w-4 h-4" /> Start Selling on CBS
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Create your seller account
            </h1>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              Join thousands of thriving businesses and sell to millions of customers.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all"
                />
              </div>
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Smartphone className="absolute left-3.5 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                  <span className="pl-11 pr-2 text-xs font-bold text-zinc-500 border-r border-zinc-200 select-none font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit number"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-3 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-11 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-11 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-1 text-left select-none group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-600 font-medium">
                I agree to the{" "}
                <Link href="/terms" className="text-indigo-600 hover:underline font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-indigo-600 hover:underline font-semibold">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Support Info */}
        <div className="max-w-xl w-full mx-auto text-center text-xs text-zinc-500 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Need help during registration?</span>
          <div className="flex items-center gap-3 font-semibold text-zinc-700">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> 1800-123-4455
            </span>
            <span className="h-3 w-[1px] bg-zinc-200" />
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> support@cbs.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
