import Link from "next/link"
import React from "react"
import { ChevronDown } from "lucide-react"

const navlinks = [
  {
    id: 1,
    title: "Sell Online",
    href: "/seller",
    childrens: [
      {
        id: 1,
        title: "Create Account",
        href: "/seller/register",
      },
      {
        id: 2,
        title: "List Products",
        href: "/seller/dashboard",
      },
      {
        id: 3,
        title: "Storage & Shipping",
        href: "/seller/dashboard",
      },
      {
        id: 4,
        title: "Receive Payments",
        href: "/seller/dashboard",
      },
    ],
  },
  {
    id: 2,
    title: "Fees & Commissions",
    href: "/fees-and-commission",
    childrens: [
      {
        id: 1,
        title: "Pricing Structure",
        href: "/fees-and-commission",
      },
      {
        id: 2,
        title: "Payment Cycle",
        href: "/fees-and-commission",
      },
    ],
  },
  {
    id: 3,
    title: "Grow",
    href: "/grow",
  },
  {
    id: 4,
    title: "Learn",
    href: "/learn",
  },
  {
    id: 5,
    title: "Shopsy",
    href: "/shopsy",
  },
]

const Header = () => {
  return (
    <div className="w-full flex flex-col bg-white border-b border-zinc-100">
      {/* Top Banner Bar */}
      <div className="w-full bg-zinc-50 border-b border-zinc-150 py-1.5 px-6 text-[11px] font-medium text-zinc-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>
            Existing Seller?{" "}
            <a href="/seller/login" className="text-indigo-600 hover:underline font-semibold ml-1">
              Explore our product recommendations with Dhamaka Selection
            </a>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full h-16 px-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/seller" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-base shadow-sm">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-zinc-900 leading-none">
                CBS <span className="text-indigo-600">Marketplace</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                Seller Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navlinks.map((item) => (
            <div key={item.id} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-indigo-600 py-5 transition-colors"
              >
                {item.title}
                {item.childrens && (
                  <ChevronDown className="h-3 w-3 text-zinc-400 group-hover:text-indigo-600 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {/* Dropdown Menu */}
              {item.childrens && (
                <div className="absolute top-[80%] left-0 mt-1 w-52 rounded-xl bg-white border border-zinc-100 p-1.5 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  {item.childrens.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className="block px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <Link
            href="/seller/login"
            className="text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/seller/register"
            className="flex h-10 items-center justify-center rounded-sm bg-[#FFE11B] px-6 text-xs font-bold uppercase tracking-wider text-zinc-900 shadow-sm transition-all hover:bg-[#F2D000]"
          >
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
