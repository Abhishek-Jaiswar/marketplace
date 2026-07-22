import React from "react";
import Link from "next/link";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarActions } from "./NavbarActions";
import { MobileMenu } from "./MobileMenu";
import { MegaMenu } from "./MegaMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-background/90 backdrop-blur-md border-b border-border z-50 transition-colors duration-200">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Left Side: Mobile Menu & Branding */}
        <div className="flex items-center gap-2">
          <MobileMenu />
          <NavbarLogo />
        </div>

        {/* Center: Search Bar (Desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavbarSearch />
        </div>

        {/* Right Side: Quick Action Items */}
        <NavbarActions />
      </div>

      {/* Mobile Search Row (visible on small viewports only) */}
      <div className="md:hidden px-4 pb-3 pt-1 border-b border-border/50">
        <NavbarSearch />
      </div>

      {/* MegaMenu Horizontal Category Ribbon */}
      <MegaMenu />
    </header>
  );
}

export default Navbar;
