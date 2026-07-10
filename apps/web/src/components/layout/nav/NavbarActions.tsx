"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Heart, LogIn, LayoutDashboard, Shield, LogOut, Package } from "lucide-react";
import {
  useAppSelector,
  useGetMeQuery,
  useLogoutMutation,
} from "@workspace/store";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";

export function NavbarActions() {
  const { isAuthenticated, user: cachedUser } = useAppSelector((state) => state.auth);
  
  // Triggers silent refresh / me fetch using the shared httpOnly cookie automatically
  const { data: userData } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [logout] = useLogoutMutation();

  const user = userData?.user || cachedUser;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getInitials = () => {
    if (!user?.firstName) return "U";
    return `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ""}`.toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Wishlist Link */}
      <Link
        href="/wishlist"
        className="hidden md:flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        title="Wishlist"
      >
        <Heart className="w-5.5 h-5.5" />
      </Link>

      {/* Account Info Dropdown */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-muted border border-transparent hover:border-border transition-all cursor-pointer group outline-none">
            <Avatar className="w-8 h-8 rounded-lg border border-border group-hover:border-zinc-400 dark:group-hover:border-zinc-650 transition-colors">
              <AvatarFallback className="bg-muted text-foreground text-xs font-bold rounded-lg font-mono">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-muted-foreground font-medium leading-none">Hello,</span>
              <span className="text-xs font-semibold text-foreground tracking-wide mt-0.5 leading-none">
                {user.firstName}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 border border-border bg-popover shadow-2xl p-1.5 rounded-2xl z-50 text-popover-foreground"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-2 text-xs font-medium text-muted-foreground font-mono">
                Account Information
              </DropdownMenuLabel>
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-foreground truncate">{`${user.firstName} ${user.lastName || ""}`}</p>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-mono">{user.email}</p>
              </div>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-border/50 my-1" />

            <DropdownMenuItem className="focus:bg-muted rounded-lg p-2 transition-colors cursor-pointer text-xs flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span>My Orders</span>
            </DropdownMenuItem>

            {/* Seller Central shortcut if role exists */}
            {user.roles.includes("SELLER") && (
              <DropdownMenuItem
                render={<Link href="http://localhost:3001" target="_blank" />}
                className="focus:bg-muted rounded-lg p-2 transition-colors cursor-pointer text-xs flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-foreground" />
                <span>Seller Central</span>
              </DropdownMenuItem>
            )}

            {/* Admin Dashboard shortcut if role exists */}
            {user.roles.includes("ADMIN") && (
              <DropdownMenuItem
                render={<Link href="http://localhost:3002" target="_blank" />}
                className="focus:bg-muted rounded-lg p-2 transition-colors cursor-pointer text-xs flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-foreground" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="bg-border/50 my-1" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="focus:bg-destructive/10 focus:text-destructive rounded-lg p-2 transition-colors cursor-pointer text-xs flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-destructive" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border hover:border-border/80 text-xs font-semibold text-foreground hover:bg-muted transition-all duration-300"
        >
          <LogIn className="w-4 h-4 text-muted-foreground" />
          <span>Sign In</span>
        </Link>
      )}

      {/* Cart Indicator */}
      <Link
        href="/cart"
        className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all relative group"
      >
        <ShoppingCart className="w-5.5 h-5.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-background group-hover:scale-110 transition-transform">
          0
        </span>
      </Link>
    </div>
  );
}
export default NavbarActions;
