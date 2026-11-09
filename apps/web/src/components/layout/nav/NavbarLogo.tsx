import React from "react"
import Link from "next/link"
import { ShoppingBag, MapPin } from "lucide-react"

export function NavbarLogo() {
  return (
    <div className="flex items-center gap-6">
      {/* Brand Logo */}
      <Link href="/" className="group flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-lg shadow-zinc-500/10 transition-transform duration-300 group-hover:scale-105 dark:from-zinc-100 dark:to-zinc-300">
          <ShoppingBag className="h-5.5 w-5.5 text-zinc-50 dark:text-zinc-950" />
        </div>
        <div className="flex flex-col">
          <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent transition-opacity group-hover:opacity-90 dark:from-white dark:via-zinc-100 dark:to-zinc-400">
            CBS
          </span>
          <span className="-mt-1 font-mono text-[10px] font-bold tracking-widest text-zinc-600 uppercase dark:text-zinc-400">
            Market
          </span>
        </div>
      </Link>

      {/* Location Picker Mock */}
      <button className="group hidden items-center gap-2 rounded-xl border border-transparent px-3 py-1.5 text-left transition-all duration-200 hover:border-border hover:bg-muted lg:flex">
        <MapPin className="h-5 w-5 text-zinc-600 transition-all duration-300 group-hover:animate-bounce dark:text-zinc-400" />
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-muted-foreground">
            Deliver to
          </span>
          <span className="text-xs font-semibold tracking-wide text-foreground">
            Select Address
          </span>
        </div>
      </button>
    </div>
  )
}
export default NavbarLogo
