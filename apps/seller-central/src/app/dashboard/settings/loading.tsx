"use client"

import React from "react"
import { Loader2 } from "lucide-react"

export default function SettingsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 animate-pulse p-2">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-72 rounded bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
        <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-2 md:col-span-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
          ))}
        </div>

        <div className="md:col-span-3 space-y-6 rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading Seller Settings...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
