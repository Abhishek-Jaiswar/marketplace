"use client"

import Link from "next/link"
import React from "react"
import { ChevronDown } from "lucide-react"
import Logo from "../logo"
import { buttonVariants } from "@workspace/ui/components/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Benefits
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Pricing
          </Link>
          <Link
            href="#success"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Success Stories
          </Link>
          <div className="group relative cursor-pointer py-1">
            <span className="flex items-center gap-1 text-sm font-semibold text-zinc-700 transition-colors group-hover:text-indigo-600">
              Resources{" "}
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:rotate-180 group-hover:text-indigo-600" />
            </span>
            {/* Dropdown Menu */}
            <div className="pointer-events-none absolute top-full left-0 z-50 mt-1 w-44 rounded-xl border border-zinc-100 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <Link
                href="/help"
                className="block rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-zinc-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-zinc-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                FAQs
              </Link>
            </div>
          </div>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Login
          </Link>
          <Link href="/register" className={buttonVariants()}>
            Start Selling
          </Link>
        </div>
      </div>
    </header>
  )
}
