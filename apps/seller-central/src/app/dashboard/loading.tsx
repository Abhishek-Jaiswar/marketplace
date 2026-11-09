"use client"

import React from "react"
import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-6 p-2">
      {/* Top Banner Skeleton */}
      <div className="h-16 w-full rounded-2xl bg-slate-200/70" />

      {/* Metric Cards Skeleton Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-xs"
          >
            <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
            <div className="h-8 w-3/4 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex h-72 flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/60 p-6 md:col-span-2">
          <div className="h-6 w-1/3 rounded bg-slate-200" />
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Loading Seller Metrics...</span>
          </div>
          <div className="h-4 w-full rounded bg-slate-200" />
        </div>
        <div className="h-72 rounded-2xl border border-slate-200/80 bg-white/60 p-6">
          <div className="mb-4 h-6 w-1/2 rounded bg-slate-200" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-10 w-full rounded bg-slate-200/60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
