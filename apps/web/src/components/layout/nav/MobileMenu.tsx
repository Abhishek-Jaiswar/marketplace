"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Menu,
  ShoppingBag,
  Home,
  Package,
  Heart,
  LogIn,
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronDown,
  Layers,
} from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  useAppSelector,
  useLogoutMutation,
  useGetCategoryTreeQuery,
} from "@workspace/store"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [logout] = useLogoutMutation()

  const { data: treeResponse } = useGetCategoryTreeQuery()
  const categoryTree = treeResponse?.data || []

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      setOpen(false)
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const toggleCategory = (catId: string) => {
    setExpandedCatId((prev) => (prev === catId ? null : catId))
  }

  return (
    <div className="md:hidden">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="-ml-2 cursor-pointer rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
          <Menu className="h-6 w-6" />
        </DialogTrigger>
        <DialogContent
          className="fixed top-0 bottom-0 left-0 z-50 flex h-full w-80 flex-col justify-between overflow-y-auto border-r border-border bg-background/98 p-6 text-foreground shadow-2xl backdrop-blur-xl"
          style={{ animationDuration: "250ms" }}
        >
          <div>
            <DialogHeader className="mb-6 flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-lg dark:from-zinc-100 dark:to-zinc-300">
                  <ShoppingBag className="h-4.5 w-4.5 text-zinc-50 dark:text-zinc-950" />
                </div>
                <span className="text-md bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text font-extrabold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
                  CBS Market
                </span>
              </DialogTitle>
            </DialogHeader>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Home className="h-4.5 w-4.5 text-muted-foreground" />
                <span>Home</span>
              </Link>

              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Package className="h-4.5 w-4.5 text-muted-foreground" />
                <span>My Orders</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Heart className="h-4.5 w-4.5 text-muted-foreground" />
                <span>Wishlist</span>
              </Link>

              {/* Dynamic Categories Accordion Section */}
              {categoryTree.length > 0 && (
                <div className="mt-3 border-t border-border/50 pt-3">
                  <span className="mb-2 block px-3 font-mono text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
                    Browse Categories
                  </span>
                  <div className="space-y-1">
                    {categoryTree.map((cat) => {
                      const isExpanded = expandedCatId === cat.id
                      const hasChildren =
                        cat.children && cat.children.length > 0

                      return (
                        <div
                          key={cat.id}
                          className="overflow-hidden rounded-xl"
                        >
                          <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted">
                            <Link
                              href={`/products?category=${encodeURIComponent(cat.slug)}`}
                              onClick={() => setOpen(false)}
                              className="flex min-w-0 flex-1 items-center gap-2.5"
                            >
                              <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
                              <span className="truncate">{cat.name}</span>
                            </Link>
                            {hasChildren && (
                              <button
                                onClick={() => toggleCategory(cat.id)}
                                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                                aria-label="Toggle subcategories"
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Accordion Subcategories */}
                          {hasChildren && isExpanded && (
                            <div className="my-1 space-y-1 rounded-lg bg-muted/30 py-1 pr-3 pl-8">
                              {cat.children?.map((subCat) => (
                                <Link
                                  key={subCat.id}
                                  href={`/products?category=${encodeURIComponent(subCat.slug)}`}
                                  onClick={() => setOpen(false)}
                                  className="block truncate py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                                >
                                  {subCat.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Conditional Seller Central */}
              {isAuthenticated && user?.roles.includes("SELLER") && (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_SELLER_CENTRAL_URL ||
                    "http://localhost:3001"
                  }
                  target="_blank"
                  className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <LayoutDashboard className="h-4.5 w-4.5 text-muted-foreground" />
                  <span>Seller Central</span>
                </Link>
              )}

              {/* Conditional Admin Central */}
              {isAuthenticated && user?.roles.includes("ADMIN") && (
                <Link
                  href={
                    process.env.NEXT_PUBLIC_ADMIN_CENTRAL_URL ||
                    "http://localhost:3002"
                  }
                  target="_blank"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <Shield className="h-4.5 w-4.5 text-muted-foreground" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Account Footer Action */}
          <div className="mt-6 border-t border-border/50 pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted font-mono font-bold text-foreground">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {`${user.firstName} ${user.lastName || ""}`}
                    </span>
                    <span className="truncate font-mono text-[10px] text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-destructive/10 py-3 text-sm font-semibold text-destructive transition-all hover:bg-destructive/20"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <LogIn className="h-4.5 w-4.5 text-muted-foreground" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MobileMenu
