"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Tag, Zap, Compass } from "lucide-react";

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
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((promo, idx) => {
          const Icon = promo.icon;
          return (
            <div
              key={idx}
              className={`relative rounded-3xl overflow-hidden p-8 bg-gradient-to-br ${promo.gradient} text-white border border-white/10 shadow-xl flex flex-col justify-between h-[280px] group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* Background Emoji Decorative Visual */}
              <div className="absolute right-4 bottom-4 text-8xl opacity-20 pointer-events-none group-hover:scale-110 group-hover:opacity-30 transition-all duration-300">
                {promo.emoji}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-white/15 backdrop-blur-md border border-white/20 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-amber-400" />
                    {promo.tag}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                  {promo.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed max-w-[240px]">
                  {promo.subtitle}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <span className="text-xs font-black text-amber-300 font-mono">
                  {promo.discount}
                </span>
                <Link
                  href={promo.link}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-100 transition-colors shadow-md group/btn"
                >
                  Shop Deal
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PromoBanners;
