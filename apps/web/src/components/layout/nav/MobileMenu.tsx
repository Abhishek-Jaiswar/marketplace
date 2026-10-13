"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  useAppSelector,
  useLogoutMutation,
  useGetCategoryTreeQuery,
} from "@workspace/store";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

  const { data: treeResponse } = useGetCategoryTreeQuery();
  const categoryTree = treeResponse?.data || [];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      setOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleCategory = (catId: string) => {
    setExpandedCatId((prev) => (prev === catId ? null : catId));
  };

  return (
    <div className="md:hidden">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer">
          <Menu className="w-6 h-6" />
        </DialogTrigger>
        <DialogContent
          className="fixed top-0 left-0 bottom-0 w-80 h-full border-r border-border bg-background/98 backdrop-blur-xl p-6 shadow-2xl z-50 text-foreground overflow-y-auto flex flex-col justify-between"
          style={{ animationDuration: "250ms" }}
        >
          <div>
            <DialogHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 mb-6">
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 dark:from-zinc-100 dark:to-zinc-300 flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-4.5 h-4.5 text-zinc-50 dark:text-zinc-950" />
                </div>
                <span className="text-md font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                  CBS Market
                </span>
              </DialogTitle>
            </DialogHeader>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all font-medium"
              >
                <Home className="w-4.5 h-4.5 text-muted-foreground" />
                <span>Home</span>
              </Link>

              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all font-medium"
              >
                <Package className="w-4.5 h-4.5 text-muted-foreground" />
                <span>My Orders</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all font-medium"
              >
                <Heart className="w-4.5 h-4.5 text-muted-foreground" />
                <span>Wishlist</span>
              </Link>

              {/* Dynamic Categories Accordion Section */}
              {categoryTree.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground font-mono px-3 mb-2 block">
                    Browse Categories
                  </span>
                  <div className="space-y-1">
                    {categoryTree.map((cat) => {
                      const isExpanded = expandedCatId === cat.id;
                      const hasChildren = cat.children && cat.children.length > 0;

                      return (
                        <div key={cat.id} className="rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition-all">
                            <Link
                              href={`/products?category=${encodeURIComponent(cat.slug)}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-2.5 flex-1 min-w-0"
                            >
                              <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
                              <span className="truncate">{cat.name}</span>
                            </Link>
                            {hasChildren && (
                              <button
                                onClick={() => toggleCategory(cat.id)}
                                className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                                aria-label="Toggle subcategories"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Accordion Subcategories */}
                          {hasChildren && isExpanded && (
                            <div className="pl-8 pr-3 py-1 space-y-1 bg-muted/30 rounded-lg my-1">
                              {cat.children?.map((subCat) => (
                                <Link
                                  key={subCat.id}
                                  href={`/products?category=${encodeURIComponent(subCat.slug)}`}
                                  onClick={() => setOpen(false)}
                                  className="block py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                                >
                                  {subCat.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conditional Seller Central */}
              {isAuthenticated && user?.roles.includes("SELLER") && (
                <Link
                  href="http://localhost:3001"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all font-medium mt-2"
                >
                  <LayoutDashboard className="w-4.5 h-4.5 text-muted-foreground" />
                  <span>Seller Central</span>
                </Link>
              )}

              {/* Conditional Admin Central */}
              {isAuthenticated && user?.roles.includes("ADMIN") && (
                <Link
                  href="http://localhost:3002"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all font-medium"
                >
                  <Shield className="w-4.5 h-4.5 text-muted-foreground" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Account Footer Action */}
          <div className="border-t border-border/50 pt-4 mt-6">
            {isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center font-bold font-mono border border-border">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {`${user.firstName} ${user.lastName || ""}`}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate font-mono">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-sm font-semibold transition-all cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all"
              >
                <LogIn className="w-4.5 h-4.5 text-muted-foreground" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MobileMenu;
