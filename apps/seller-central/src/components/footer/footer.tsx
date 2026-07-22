import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-900 text-zinc-400 py-12 px-6 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-sm">
              C
            </div>
            <span className="text-sm font-extrabold tracking-tight text-white leading-none">
              CBS <span className="text-indigo-400">Seller Hub</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 max-w-xs leading-relaxed mt-2">
            Helping sellers grow their businesses online with secure weekly payouts, 24/7 support, and access to millions of customers.
          </p>
        </div>

        {/* Links 1 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider mb-2">Sell</span>
          <Link href="/register" className="text-xs hover:text-white transition-colors">Start Selling</Link>
          <Link href="/fees-and-commission" className="text-xs hover:text-white transition-colors">Fees & Commission</Link>
          <Link href="/shipping-info" className="text-xs hover:text-white transition-colors">Shipping & Delivery</Link>
        </div>

        {/* Links 2 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider mb-2">Resources</span>
          <Link href="/learn" className="text-xs hover:text-white transition-colors">Seller Academy</Link>
          <Link href="/faq" className="text-xs hover:text-white transition-colors">FAQs</Link>
          <Link href="/support" className="text-xs hover:text-white transition-colors">Seller Support</Link>
        </div>

        {/* Links 3 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider mb-2">Policies</span>
          <Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-xs hover:text-white transition-colors">Terms of Use</Link>
          <Link href="/policies" className="text-xs hover:text-white transition-colors">Seller Policies</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-zinc-500">
        <span>© 2026 CBS Marketplace. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/cookies" className="hover:underline">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer