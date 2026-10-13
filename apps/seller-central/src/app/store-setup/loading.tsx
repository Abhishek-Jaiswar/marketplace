"use client"

import React from "react"
import { Loader2 } from "lucide-react"

export default function StoreSetupLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-zinc-500 font-sans">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
      <span className="text-xs font-semibold">Loading Store Setup Portal...</span>
    </div>
  )
}
