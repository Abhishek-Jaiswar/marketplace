"use client"

import React from "react"
import Link from "next/link"
import {
  ShoppingCart,
  Heart,
  LogIn,
  LayoutDashboard,
  Shield,
  LogOut,
  Package,
} from "lucide-react"
import {
  useAppSelector,
  useGetMeQuery,
  useLogoutMutation,
} from "@workspace/store"
import { ThemeToggle } from "./ThemeToggle"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"

export function NavbarActions() {
  const { isAuthenticated, user: cachedUser } = useAppSelector(
    (state) => state.auth
  )

  const { data: userData, isLoading } = useGetMeQuery(undefined)

  const [logout] = useLogoutMutation()

  const user = userData?.user || cachedUser

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const getInitials = () => {
    if (!user?.firstName) return "U"
    return `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ""}`.toUpperCase()
  }

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Wishlist Link */}
      <Link
        href="/wishlist"
        className="hidden items-center justify-center rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:flex"
        title="Wishlist"
      >
        <Heart className="h-5.5 w-5.5" />
      </Link>

      {/* Account Info Dropdown */}
      {isLoading ? (
        <div className="h-8 w-8 animate-pulse rounded-lg border border-border bg-muted/60 dark:bg-zinc-800" />
      ) : isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex cursor-pointer items-center gap-2 rounded-xl border border-transparent p-1.5 pr-3 transition-all outline-none hover:border-border hover:bg-muted">
            <Avatar className="dark:group-hover:border-zinc-650 h-8 w-8 rounded-lg border border-border transition-colors group-hover:border-zinc-400">
              <AvatarFallback className="rounded-lg bg-muted font-mono text-xs font-bold text-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col text-left sm:flex">
              <span className="text-[10px] leading-none font-medium text-muted-foreground">
                Hello,
              </span>
              <span className="mt-0.5 text-xs leading-none font-semibold tracking-wide text-foreground">
                {user.firstName}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-50 mt-2 w-56 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-2 font-mono text-xs font-medium text-muted-foreground">
                Account Information
              </DropdownMenuLabel>
              <div className="px-2 py-1.5">
                <p className="truncate text-xs font-semibold text-foreground">{`${user.firstName} ${user.lastName || ""}`}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1 bg-border/50" />

            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs transition-colors focus:bg-muted">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>My Orders</span>
            </DropdownMenuItem>

            {/* Seller Central shortcut if role exists */}
            {user.roles.includes("SELLER") && (
              <DropdownMenuItem
                render={
                  <Link
                    href={
                      process.env.NEXT_PUBLIC_SELLER_CENTRAL_URL ||
                      "http://localhost:3001"
                    }
                    target="_blank"
                  />
                }
                className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs transition-colors focus:bg-muted"
              >
                <LayoutDashboard className="h-4 w-4 text-foreground" />
                <span>Seller Central</span>
              </DropdownMenuItem>
            )}

            {/* Admin Dashboard shortcut if role exists */}
            {user.roles.includes("ADMIN") && (
              <DropdownMenuItem
                render={
                  <Link
                    href={
                      process.env.NEXT_PUBLIC_ADMIN_CENTRAL_URL ||
                      "http://localhost:3002"
                    }
                    target="_blank"
                  />
                }
                className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs transition-colors focus:bg-muted"
              >
                <Shield className="h-4 w-4 text-foreground" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="my-1 bg-border/50" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs transition-colors focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4 text-destructive" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2 text-xs font-semibold text-foreground transition-all duration-300 hover:border-border/80 hover:bg-muted"
        >
          <LogIn className="h-4 w-4 text-muted-foreground" />
          <span>Sign In</span>
        </Link>
      )}

      {/* Cart Indicator */}
      <Link
        href="/cart"
        className="group relative flex items-center gap-2 rounded-xl border border-transparent p-2 text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
      >
        <ShoppingCart className="h-5.5 w-5.5 text-muted-foreground transition-colors group-hover:text-foreground" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-zinc-950 text-[10px] font-extrabold text-zinc-50 transition-transform group-hover:scale-110 dark:bg-zinc-50 dark:text-zinc-950">
          0
        </span>
      </Link>
    </div>
  )
}
export default NavbarActions
