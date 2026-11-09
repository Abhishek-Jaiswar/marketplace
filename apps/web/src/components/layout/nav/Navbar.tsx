import React from "react"
import { NavbarLogo } from "./NavbarLogo"
import { NavbarSearch } from "./NavbarSearch"
import { NavbarActions } from "./NavbarActions"
import { MobileMenu } from "./MobileMenu"
import { MegaMenu } from "./MegaMenu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-200">
      {/* Primary Top Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:gap-8 lg:px-8">
        {/* Left Side: Mobile Menu & Branding */}
        <div className="flex items-center gap-2">
          <MobileMenu />
          <NavbarLogo />
        </div>

        {/* Center: Search Bar (Desktop only) */}
        <div className="hidden flex-1 justify-center md:flex">
          <NavbarSearch />
        </div>

        {/* Right Side: Quick Action Items */}
        <NavbarActions />
      </div>

      {/* Mobile Search Row (visible on small viewports only) */}
      <div className="border-b border-border/50 px-4 pt-1 pb-3 md:hidden">
        <NavbarSearch />
      </div>

      {/* MegaMenu Horizontal Category Ribbon */}
      <MegaMenu />
    </header>
  )
}

export default Navbar
