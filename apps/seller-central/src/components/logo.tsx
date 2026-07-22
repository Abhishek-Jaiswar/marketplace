"use client"

import Image from "next/image"
import React from "react"

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center">
        <Image
          src={"/shopping.png"}
          height={30}
          width={30}
          alt="Shopease Logo"
        />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span className="text-base font-bold text-zinc-800">ShopEase</span>
        <span className="text-[10px] font-semibold text-indigo-600 uppercase">
          Seller Hub
        </span>
      </div>
    </div>
  )
}

export default Logo
