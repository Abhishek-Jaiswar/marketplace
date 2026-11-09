"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Tag, Zap, Compass } from "lucide-react"

export function PromoBanners() {
  const promos = [
    {
      title: "Workstation Refresh",
      subtitle: "Ergonomic chairs, mechanical keycaps & desk mats.",
      discount: "Up to 35% OFF",
      link: "/products?category=Electronics",
      gradient: "from-blue-600/90 via-indigo-900 to-zinc-950",
      tag: "TECH STUDIO",
      icon: Zap,
      emoji: "💻",
    },
    {
      title: "Sustainable Linen Edit",
      subtitle: "Natural organic apparel handcrafted by top artisans.",
      discount: "Flat 25% OFF",
      link: "/products?category=Fashion+%26+Apparel",
      gradient: "from-amber-700/90 via-rose-900 to-zinc-950",
      tag: "FASHION ESSENTIALS",
      icon: Compass,
      emoji: "👔",
    },
    {
      title: "Smart Home Appliances",
      subtitle: "Precision electric kettles & coffee brewers.",
      discount: "Special Bundle Deal",
      link: "/products?category=Home+%26+Kitchen",
      gradient: "from-emerald-700/90 via-teal-950 to-zinc-950",
      tag: "HOME UPGRADES",
      icon: Tag,
      emoji: "☕",
    },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {promos.map((promo, idx) => {
          const Icon = promo.icon
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 ${promo.gradient} group flex h-[280px] flex-col justify-between border border-white/10 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* Background Emoji Decorative Visual */}
              <div className="pointer-events-none absolute right-4 bottom-4 text-8xl opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:opacity-30">
                {promo.emoji}
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 font-mono text-[10px] font-extrabold tracking-widest uppercase backdrop-blur-md">
                    <Icon className="h-3 w-3 text-amber-400" />
                    {promo.tag}
                  </span>
                </div>
                <h3 className="text-xl leading-snug font-black tracking-tight sm:text-2xl">
                  {promo.title}
                </h3>
                <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-zinc-300">
                  {promo.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="font-mono text-xs font-black text-amber-300">
                  {promo.discount}
                </span>
                <Link
                  href={promo.link}
                  className="group/btn inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-950 shadow-md transition-colors hover:bg-zinc-100"
                >
                  Shop Deal
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PromoBanners
