"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@workspace/store";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  Settings,
  Shield,
  Headset,
  Loader2,
  ShoppingBag,
  Phone,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone || !password) {
      setErrorMsg("Please enter both email/phone and password.");
      return;
    }

    try {
      const response = await login({ email: emailOrPhone.trim(), password }).unwrap();
      const user = response.user;

      // If the user has a SELLER role, we proceed to dashboard/status. Otherwise, onboard them.
      if (user.roles.includes("SELLER")) {
        router.push("/dashboard");
      } else {
        router.push("/onboard");
      }
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Invalid credentials.";
      if (msg.toLowerCase().includes("not verified")) {
        router.push(`/verify-otp?email=${encodeURIComponent(emailOrPhone.trim())}`);
      } else {
        setErrorMsg(msg);
      }
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-white flex grid grid-cols-1 lg:grid-cols-12 text-left font-sans select-none">
      {/* LEFT COLUMN: Sidebar Benefits (30% width / col-span-4) */}
      <div className="hidden lg:flex lg:col-span-4 bg-indigo-50/40 border-r border-zinc-150 p-8 flex-col justify-between select-none">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-md font-extrabold text-zinc-900 tracking-tight">
              ShopEase
            </span>
            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
              Seller Hub
            </span>
          </div>
        </div>

        {/* Vector SVG Mock illustration */}
        <div className="my-8 flex justify-center">
          <svg
            viewBox="0 0 150 150"
            fill="none"
            className="w-48 h-48 drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Store base */}
            <rect x="25" y="80" width="100" height="48" rx="8" fill="#ffffff" stroke="#e4e4e7" strokeWidth="2" />
            {/* Store roof canopy */}
            <path d="M15,80 L135,80 L120,50 L30,50 Z" fill="#818cf8" />
            <path d="M30,80 C37,80 37,70 44,70 C51,70 51,80 58,80 C65,80 65,70 72,70 C79,70 79,80 86,80 C93,80 93,70 100,70 C107,70 107,80 114,80" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
            {/* Shopping Cart */}
            <circle cx="50" cy="118" r="5" fill="#a1a1aa" />
            <circle cx="90" cy="118" r="5" fill="#a1a1aa" />
            <path d="M35,95 L110,95 L100,113 L45,113 Z" fill="#e4e4e7" />
            {/* Floating Coins */}
            <circle cx="75" cy="30" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <circle cx="75" cy="30" r="6" fill="#f59e0b" />
            <circle cx="110" cy="40" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          </svg>
        </div>

        {/* Features Checklist */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-white border border-zinc-150 flex items-center justify-center text-indigo-600 shadow-sm">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5 leading-snug">
              <span className="text-xs font-black text-zinc-800">
                Grow Your Business
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">
                Reach crores of customers across India
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-white border border-zinc-150 flex items-center justify-center text-indigo-600 shadow-sm">
              <Settings className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5 leading-snug">
              <span className="text-xs font-black text-zinc-800">
                Easy to Start
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">
                Simple onboarding and quick account setup
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-white border border-zinc-150 flex items-center justify-center text-indigo-600 shadow-sm">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5 leading-snug">
              <span className="text-xs font-black text-zinc-800">
                Secure & Reliable
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">
                Safe payments and data protection
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-white border border-zinc-150 flex items-center justify-center text-indigo-600 shadow-sm">
              <Headset className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5 leading-snug">
              <span className="text-xs font-black text-zinc-800">
                24/7 Support
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">
                We're here to help you succeed
              </span>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
            Trusted by 1L+ sellers across India
          </span>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {[
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop",
              ].map((src, idx) => (
                <img
                  key={idx}
                  className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white"
                  src={src}
                  alt="Seller avatar"
                />
              ))}
              <div className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-[8px] font-extrabold text-indigo-600 ring-2 ring-white">
                +50K
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Signin Form (70% width / col-span-8) */}
      <div className="col-span-1 lg:col-span-8 p-8 sm:p-12 md:p-16 flex flex-col justify-between">
        {/* Top Header Row */}
        <div className="flex justify-between items-center pb-4">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShoppingBag className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-extrabold text-zinc-950">ShopEase</span>
          </div>
          <div className="text-xs font-bold text-zinc-400 ml-auto select-none">
            New to ShopEase?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-black hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-[460px] w-full mx-auto space-y-6 pt-4">
          {/* Logo Title */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 tracking-wide uppercase leading-none">
            <ShoppingBag className="w-3.5 h-3.5" /> ShopEase Seller Hub
          </div>

          <div className="space-y-1.5 text-left">
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              Welcome back!
            </h2>
            <p className="text-xs text-zinc-450 font-bold leading-normal">
              Login to your seller account and manage your business
            </p>
          </div>

          {/* Errors */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-550/10 text-red-600 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Main Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Phone Field */}
            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
                Mobile Number or Email Address
              </label>
              <div className="relative border border-zinc-200 focus-within:border-indigo-500 rounded-xl p-1 bg-zinc-50/10 flex items-center gap-2.5">
                <User className="absolute left-3 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Enter mobile number or email"
                  required
                  className="w-full bg-transparent border-none text-xs font-bold px-9 py-2.5 focus:outline-none placeholder-zinc-405 text-zinc-805"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-[10px] text-zinc-400 font-extrabold uppercase tracking-wide">
                Password
              </label>
              <div className="relative border border-zinc-200 focus-within:border-indigo-500 rounded-xl p-1 bg-zinc-50/10 flex items-center gap-2">
                <Lock className="absolute left-3 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent border-none text-xs font-bold px-9 py-2.5 focus:outline-none placeholder-zinc-405 text-zinc-805"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-650 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between py-1 text-xs select-none">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-zinc-250 text-indigo-650 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 font-bold">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-bold text-indigo-650 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md shadow-indigo-550/15 cursor-pointer disabled:opacity-55 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center select-none">
            <div className="flex-grow border-t border-zinc-150"></div>
            <span className="flex-shrink mx-3.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
              or
            </span>
            <div className="flex-grow border-t border-zinc-150"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex h-11 items-center justify-center gap-2 border border-zinc-200 hover:bg-zinc-50 bg-white text-zinc-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer select-none"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Secure Login Info Alert */}
          <div className="flex gap-2.5 p-3.5 bg-indigo-50/45 border border-indigo-100 rounded-xl text-left select-none">
            <ShieldCheck className="w-5 h-5 text-indigo-650 shrink-0" />
            <div className="space-y-0.5 leading-snug">
              <span className="text-[10px] font-black text-indigo-950 block">
                Secure Login
              </span>
              <span className="text-[9px] text-zinc-400 font-bold">
                We use industry-standard security to keep your account safe.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="text-center text-[10px] font-semibold text-zinc-400 mt-6 select-none leading-relaxed flex flex-col items-center gap-2">
          <span>Need help? Contact Seller Support</span>
          <div className="flex items-center gap-4 text-zinc-505 font-bold">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-indigo-650" /> 1800-123-4455
            </span>
            <span className="h-2 w-[1px] bg-zinc-200"></span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-indigo-650" /> seller.support@shopease.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
