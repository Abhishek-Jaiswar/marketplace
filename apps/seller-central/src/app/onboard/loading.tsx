"use client"

import React from "react"
import { Loader2 } from "lucide-react"

export default function OnboardLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 font-sans text-zinc-500">
      <Loader2 className="mb-2 h-8 w-8 animate-spin text-indigo-600" />
      <span className="text-xs font-semibold">
        Loading Seller Onboarding...
      </span>
    </div>
  )
}
