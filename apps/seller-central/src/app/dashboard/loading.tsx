"use client"

import React from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 animate-pulse p-2">
      {/* Top Banner Skeleton */}
      <div className="h-16 w-full rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />

      {/* Metric Cards Skeleton Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/60"
          >
            <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 mb-4" />
            <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 h-72 rounded-2xl border border-slate-200/80 bg-white/60 p-6 dark:border-slate-800/80 dark:bg-slate-900/60 flex flex-col justify-between">
          <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center justify-center text-slate-400 gap-2 text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading Seller Metrics...</span>
          </div>
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-72 rounded-2xl border border-slate-200/80 bg-white/60 p-6 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="h-6 w-1/2 rounded bg-slate-200 dark:bg-slate-800 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-10 w-full rounded bg-slate-200/60 dark:bg-slate-800/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
