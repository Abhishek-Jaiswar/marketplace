"use client"

import Link from "next/link"
import React from "react"
import {
  ChevronDown,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  LogOut,
  Settings,
} from "lucide-react"
import Logo from "../logo"
import { getSellerOnboardingRedirect } from "@/lib/onboarding"
import {
  useAppSelector,
  useGetMeQuery,
  useGetSellerMeQuery,
  useLogoutMutation,
} from "@workspace/store"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Header() {
  const { isAuthenticated, user: cachedUser } = useAppSelector(
    (state) => state.auth
  )
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery(undefined)
  const user = userData?.user || cachedUser

  const { data: sellerData, isLoading: isSellerLoading } = useGetSellerMeQuery(
    undefined,
    {
      skip: !user,
    }
  )

  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation()
  const router = useRouter()

  const hasSellerProfile = Boolean(sellerData?.seller)
  const redirectTarget = getSellerOnboardingRedirect(sellerData?.seller)

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getInitials = () => {
    if (!user) return "S"
    if (user.firstName) {
      return `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ""}`.toUpperCase()
    }
    return user.email.charAt(0).toUpperCase()
  }

  // Prevent UI flickering while auth or seller data is resolving on initial load
  const isResolvingAuth = (isUserLoading && !user) || (Boolean(user) && isSellerLoading && !sellerData)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Benefits
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Pricing
          </Link>
          <Link
            href="#success"
            className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
          >
            Success Stories
          </Link>
          <div className="group relative cursor-pointer py-1">
            <span className="flex items-center gap-1 text-sm font-semibold text-zinc-700 transition-colors group-hover:text-indigo-600">
              Resources{" "}
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform group-hover:rotate-180 group-hover:text-indigo-600" />
            </span>
            {/* Dropdown Menu */}
            <div className="pointer-events-none absolute top-full left-0 z-50 mt-1 w-44 rounded-xl border border-zinc-100 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <Link
                href="/help"
                className="block rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-zinc-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-zinc-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                FAQs
              </Link>
            </div>
          </div>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {isResolvingAuth ? (
            <div className="h-9 w-32 animate-pulse rounded-xl bg-zinc-150/70" />
          ) : user ? (
            hasSellerProfile ? (
              <div className="flex items-center justify-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none ring-offset-background transition-all hover:opacity-90 focus-visible:outline-none cursor-pointer">
                    <Avatar className="h-9 w-9 border border-zinc-200">
                      <AvatarImage
                        src={"https://placehold.net/avatar-5.png"}
                        alt={user.email}
                      />
                      <AvatarFallback className="bg-indigo-100 text-xs font-bold text-indigo-700">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 mt-1.5 p-1.5 shadow-xl border border-zinc-150 rounded-xl">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-2 py-1.5">
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-zinc-900 truncate">
                            {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Seller Account"}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-500 truncate font-mono">
                            {user.email}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push(redirectTarget || "/dashboard")}
                        className="cursor-pointer text-xs font-medium gap-2 py-2"
                      >
                        <LayoutDashboard className="h-4 w-4 text-zinc-500" />
                        <span>{redirectTarget ? "Complete Onboarding" : "Dashboard"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard/settings")}
                        className="cursor-pointer text-xs font-medium gap-2 py-2"
                      >
                        <Settings className="h-4 w-4 text-zinc-500" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        disabled={isLogoutLoading}
                        onClick={handleLogout}
                        className="cursor-pointer text-xs font-medium gap-2 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href={redirectTarget || "/onboard"}
                className="inline-flex animate-pulse items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
              >
                <Sparkles className="h-4 w-4" />
                <span>Complete Onboarding</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-700 transition-colors hover:text-indigo-600"
              >
                Login
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Start Selling
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

