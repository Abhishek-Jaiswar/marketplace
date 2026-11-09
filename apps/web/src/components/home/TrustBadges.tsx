"use client"

import React from "react"
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      subtitle: "On orders over $50",
      color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      icon: ShieldCheck,
      title: "Verified Vendors",
      subtitle: "100% Buyer Protection",
      color: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      icon: RotateCcw,
      title: "30-Day Easy Returns",
      subtitle: "Money back guarantee",
      color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      icon: Headphones,
      title: "24/7 Dedicated Support",
      subtitle: "Instant concierge assistance",
      color: "text-purple-500 bg-purple-500/10 dark:bg-purple-500/20",
    },
  ]

  return (
    <section className="w-full border-y border-border/80 bg-card/60 py-5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon
            return (
              <div
                key={idx}
                className="group flex items-center space-x-4 rounded-2xl p-3 transition-all duration-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60"
              >
                <div
                  className={`rounded-xl p-3 ${badge.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                    {badge.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
