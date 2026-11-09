import React from "react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-900 px-6 py-12 text-zinc-400">
      <div className="mx-auto mb-8 grid max-w-7xl grid-cols-1 gap-8 text-left md:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
              C
            </div>
            <span className="text-sm leading-none font-extrabold tracking-tight text-white">
              CBS <span className="text-indigo-400">Seller Hub</span>
            </span>
          </div>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-500">
            Helping sellers grow their businesses online with secure weekly
            payouts, 24/7 support, and access to millions of customers.
          </p>
        </div>

        {/* Links 1 */}
        <div className="flex flex-col gap-2">
          <span className="mb-2 text-xs font-bold tracking-wider text-white uppercase">
            Sell
          </span>
          <Link
            href="/register"
            className="text-xs transition-colors hover:text-white"
          >
            Start Selling
          </Link>
          <Link
            href="/fees-and-commission"
            className="text-xs transition-colors hover:text-white"
          >
            Fees & Commission
          </Link>
          <Link
            href="/shipping-info"
            className="text-xs transition-colors hover:text-white"
          >
            Shipping & Delivery
          </Link>
        </div>

        {/* Links 2 */}
        <div className="flex flex-col gap-2">
          <span className="mb-2 text-xs font-bold tracking-wider text-white uppercase">
            Resources
          </span>
          <Link
            href="/learn"
            className="text-xs transition-colors hover:text-white"
          >
            Seller Academy
          </Link>
          <Link
            href="/faq"
            className="text-xs transition-colors hover:text-white"
          >
            FAQs
          </Link>
          <Link
            href="/support"
            className="text-xs transition-colors hover:text-white"
          >
            Seller Support
          </Link>
        </div>

        {/* Links 3 */}
        <div className="flex flex-col gap-2">
          <span className="mb-2 text-xs font-bold tracking-wider text-white uppercase">
            Policies
          </span>
          <Link
            href="/privacy"
            className="text-xs transition-colors hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs transition-colors hover:text-white"
          >
            Terms of Use
          </Link>
          <Link
            href="/policies"
            className="text-xs transition-colors hover:text-white"
          >
            Seller Policies
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-[11px] font-medium text-zinc-500 sm:flex-row">
        <span>© 2026 CBS Marketplace. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/cookies" className="hover:underline">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
