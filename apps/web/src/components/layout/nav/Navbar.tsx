import React from "react";
import Link from "next/link";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarActions } from "./NavbarActions";
import { MobileMenu } from "./MobileMenu";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 transition-colors duration-200">
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

      {/* Secondary Ribbon Navigation (Amazon/Flipkart inspired) */}
      <div className="w-full bg-muted/40 border-b border-border/50 overflow-x-auto scrollbar-none transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center gap-6 text-[11px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">
          {/* All Categories shortcut */}
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer py-1 text-foreground">
            <Menu className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">All Categories</span>
          </button>
          
          <Link href="/deals" className="hover:text-foreground transition-colors py-1">
            Today&apos;s Deals
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_SELLER_CENTRAL_URL || "http://localhost:3001"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors py-1"
          >
            Sell on CBS
          </a>
          <Link href="/registry" className="hover:text-foreground transition-colors py-1">
            Registry
          </Link>
          <Link href="/customer-service" className="hover:text-foreground transition-colors py-1">
            Customer Service
          </Link>
          <Link href="/gift-cards" className="hover:text-foreground transition-colors py-1">
            Gift Cards
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
