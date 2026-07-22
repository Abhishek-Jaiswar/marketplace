"use client";

import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones, Sparkles } from "lucide-react";

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
  ];

  return (
    <section className="w-full bg-card/60 border-y border-border/80 py-5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-4 p-3 rounded-2xl transition-all duration-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60 group"
              >
                <div className={`p-3 rounded-xl ${badge.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;
