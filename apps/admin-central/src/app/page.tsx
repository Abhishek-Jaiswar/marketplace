"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useGetMeQuery, useLoginMutation } from "@workspace/store";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Activity,
  Server,
  LockKeyhole,
} from "lucide-react";

import Logo from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user: cachedUser } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const currentUser = userData?.user || cachedUser;

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-redirect if already logged in as ADMIN
  useEffect(() => {
    if (!isUserLoading && currentUser && Array.isArray(currentUser.roles) && currentUser.roles.includes("ADMIN")) {
      router.push("/dashboard");
    }
  }, [currentUser, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please provide both email address and password.");
      return;
    }

    try {
      const result = await login({
        email: email.trim(),
        password,
      }).unwrap();

      // Ensure the logged in account has ADMIN role
      if (result.user && Array.isArray(result.user.roles)) {
        if (!result.user.roles.includes("ADMIN")) {
          setErrorMsg("Access Denied: Administrator privileges required.");
          return;
        }
      }

      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Invalid administrator credentials.";
      setErrorMsg(msg);
    }
  };

  if (isUserLoading && currentUser && Array.isArray(currentUser.roles) && currentUser.roles.includes("ADMIN")) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 flex flex-col items-center justify-center p-6 text-zinc-500 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-mono font-semibold">Redirecting to Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row text-left font-sans select-none text-zinc-900">
      {/* LEFT COLUMN: Admin Security Overview & System Stats */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-4/12 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 xl:p-12 flex-col justify-between relative">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Logo */}
          <Logo light iconSize={32} subtitle="System Operations" />

          {/* Security & Monitoring Hero Card */}
          <div className="space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-indigo-200">
              <LockKeyhole className="w-3.5 h-3.5" /> Restricted Admin Portal
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              CBS Central Management & Control
            </h2>
            <p className="text-xs text-indigo-200/80 font-medium leading-relaxed">
              Secure infrastructure operations for managing sellers, platform audit logs, payouts, and system analytics.
            </p>
          </div>

          {/* Real-time System Badges */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">
                  Real-time Seller KYC Pipeline
                </span>
                <span className="text-[11px] text-indigo-200/70 font-medium leading-normal">
                  Automated verification & merchant document inspection
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                <Server className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">
                  Microservices Health & Audit
                </span>
                <span className="text-[11px] text-indigo-200/70 font-medium leading-normal">
                  24/7 API telemetry, settlement logs & security monitoring
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-md">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">
                  End-to-End Encryption
                </span>
                <span className="text-[11px] text-indigo-200/70 font-medium leading-normal">
                  Role-based access control with token session management
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-indigo-300 font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Unauthorized access attempts are logged and monitored.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Admin Authentication Form (Light Mode) */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white min-h-screen">
        {/* Top Header Logo for mobile */}
        <div className="flex items-center justify-between max-w-md mx-auto w-full mb-8 lg:hidden">
          <Logo iconSize={30} />
        </div>

        {/* Main Form Container */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600">
              <ShieldCheck className="w-4 h-4" /> Admin Console Sign In
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Administrator Login
            </h1>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Enter your admin credentials to access the central operations control center.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2 text-left">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Email Address Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cbsmarketplace.com"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
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
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-11 pr-11 py-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Session */}
            <div className="flex items-center justify-between py-1 text-xs select-none">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-zinc-600 group-hover:text-zinc-900 font-medium">
                  Keep admin session active
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-3"
            >
              {isLoginLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Authenticate Admin Portal</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Support Info */}
        <div className="max-w-md w-full mx-auto text-center text-xs text-zinc-500 pt-6 border-t border-zinc-100 flex items-center justify-between">
          <span>CBS Operations Control v2.4</span>
          <span className="font-mono text-[11px] text-zinc-400">
            Internal Systems Only
          </span>
        </div>
      </div>
    </div>
  );
}
