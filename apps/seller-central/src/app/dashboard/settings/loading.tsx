"use client"

import React from "react"
import { Loader2 } from "lucide-react"

export default function SettingsLoading() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-6 p-2">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-200/60" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-slate-200" />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-2 md:col-span-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full rounded-xl bg-slate-200/70" />
          ))}
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-xs md:col-span-3">
          <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading Seller Settings...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
