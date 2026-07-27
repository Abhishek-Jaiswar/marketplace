"use client"

import Image from "next/image"
import React from "react"

interface LogoProps {
  light?: boolean
  className?: string
  iconSize?: number
  subtitle?: string
}

const Logo = ({
  light = false,
  className = "",
  iconSize = 30,
  subtitle = "Seller Hub",
}: LogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center justify-center shrink-0">
        <Image
          src="/shopping.png"
          height={iconSize}
          width={iconSize}
          alt="CBS Logo"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span
          className={`text-base font-black tracking-tight ${
            light ? "text-white" : "text-zinc-900"
          }`}
        >
          CBS
        </span>
        {subtitle && (
          <span
            className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
              light ? "text-indigo-300" : "text-indigo-600"
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo

