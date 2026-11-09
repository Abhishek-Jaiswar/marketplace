import { Logo } from "@workspace/ui/components/logo"
import React from "react"
import Link from "next/link"
import { MapPin } from "lucide-react"

export function NavbarLogo() {
  return (
    <div className="flex items-center gap-6">
      {/* Brand Logo */}
      <Link href="/" aria-label="Home">
        <Logo size="md" />
      </Link>

      {/* Location Picker Mock */}
      <button className="group hidden items-center gap-2 rounded-xl border border-transparent px-3 py-1.5 text-left transition-all duration-200 hover:border-border hover:bg-muted lg:flex">
        <MapPin className="h-5 w-5 text-zinc-600 transition-all duration-300 group-hover:animate-bounce" />
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
