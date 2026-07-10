import React from "react";
import Link from "next/link";
import { ShoppingBag, MapPin } from "lucide-react";

export function NavbarLogo() {
  return (
    <div className="flex items-center gap-6">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 flex items-center justify-center shadow-lg shadow-zinc-500/10 group-hover:scale-105 transition-transform duration-300">
          <ShoppingBag className="w-5.5 h-5.5 text-zinc-50 dark:text-zinc-950" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            CBS
          </span>
          <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold tracking-widest uppercase -mt-1 font-mono">
            Market
          </span>
        </div>
      </Link>

      {/* Location Picker Mock */}
      <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted border border-transparent hover:border-border text-left transition-all duration-200 group">
        <MapPin className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:animate-bounce transition-all duration-300" />
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-medium">Deliver to</span>
          <span className="text-xs font-semibold text-foreground tracking-wide">Select Address</span>
        </div>
      </button>
    </div>
  );
}
export default NavbarLogo;
