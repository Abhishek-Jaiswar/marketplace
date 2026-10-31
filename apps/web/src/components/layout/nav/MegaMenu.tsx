"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Layers,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategoryTreeQuery, type CategoryTreeNode } from "@workspace/store";

const HOVER_CLOSE_DELAY = 180;
const SCROLL_STEP = 320;
const EDGE_THRESHOLD = 4;

export function MegaMenu() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  const rootRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pillRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const { data: treeResponse, isLoading, isError } = useGetCategoryTreeQuery();
  const categoryTree: CategoryTreeNode[] = Array.isArray(treeResponse?.data)
    ? treeResponse.data
    : [];

  const activeCategory = categoryTree.find((category) => category.id === activeId) ?? null;

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    if (activeId !== null) setActiveId(null);
  }

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openCategory = useCallback(
    (id: string) => {
      clearCloseTimer();
      setActiveId(id);
    },
    [clearCloseTimer]
  );

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setActiveId(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setActiveId(null), HOVER_CLOSE_DELAY);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeMenu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !activeId) return;
      const trigger = pillRefs.current.get(activeId);
      closeMenu();
      trigger?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeId, closeMenu]);

  const updateScrollState = useCallback(() => {
    const element = ribbonRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > EDGE_THRESHOLD);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - EDGE_THRESHOLD
    );
  }, []);

  useEffect(() => {
    updateScrollState();

    const element = ribbonRef.current;
    if (!element) return;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, categoryTree.length]);

  const scrollRibbon = (direction: "left" | "right") => {
    ribbonRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const focusFirstPanelLink = useCallback(() => {
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    });
  }, []);

  const handlePillKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number
  ) => {
    const category = categoryTree[index];
    if (!category) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      openCategory(category.id);
      focusFirstPanelLink();
      return;
    }

    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % categoryTree.length
        : (index - 1 + categoryTree.length) % categoryTree.length;
    const nextCategory = categoryTree[nextIndex];
    if (nextCategory) {
      pillRefs.current.get(nextCategory.id)?.focus();
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeMenu();
    }
  };

  const hasCategoryImage = Boolean(
    activeCategory?.image &&
      (activeCategory.image.startsWith("http") || activeCategory.image.startsWith("/"))
  );

  return (
    <div
      ref={rootRef}
      className="relative z-40 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur-md transition-colors"
      onMouseLeave={scheduleClose}
      onBlur={handleBlur}
    >
      <nav
        aria-label="Product categories"
        className="mx-auto flex max-w-7xl items-center gap-1 px-2 sm:px-4 lg:px-6"
      >
        <button
          type="button"
          onClick={() => scrollRibbon("left")}
          aria-label="Scroll categories left"
          className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-all hover:text-foreground sm:flex ${
            canScrollLeft ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 flex-1">
          <div
            ref={ribbonRef}
            className="scrollbar-none flex items-center gap-1.5 overflow-x-auto scroll-smooth py-2.5 sm:gap-2"
          >
            <Link
              href="/products?sort=popular"
              onClick={closeMenu}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/20 px-3.5 py-1.5 text-xs font-extrabold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 fill-accent" />
              <span>Popular Deals</span>
            </Link>

            {isLoading && categoryTree.length === 0 && (
              <div className="flex items-center gap-2" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-muted"
                  />
                ))}
              </div>
            )}

            {!isLoading &&
              categoryTree.map((category, index) => {
                const isActive = activeId === category.id;

                return (
                  <Link
                    key={category.id}
                    ref={(node) => {
                      if (node) {
                        pillRefs.current.set(category.id, node);
                      } else {
                        pillRefs.current.delete(category.id);
                      }
                    }}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    onMouseEnter={() => openCategory(category.id)}
                    onFocus={() => openCategory(category.id)}
                    onKeyDown={(event) => handlePillKeyDown(event, index)}
                    onClick={closeMenu}
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    aria-controls="megamenu-panel"
                    className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{category.name}</span>
                    <ChevronDown
                      className={`hidden h-3 w-3 shrink-0 transition-transform duration-200 sm:block ${
                        isActive ? "rotate-180 opacity-100" : "opacity-40"
                      }`}
                    />
                  </Link>
                );
              })}

            {!isLoading && categoryTree.length === 0 && (
              <Link
                href="/products"
                onClick={closeMenu}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:text-sm"
              >
                <Package className="h-3.5 w-3.5" />
                <span>{isError ? "Categories unavailable - browse all products" : "All Products"}</span>
              </Link>
            )}
          </div>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-background to-transparent transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <button
          type="button"
          onClick={() => scrollRibbon("right")}
          aria-label="Scroll categories right"
          className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-all hover:text-foreground sm:flex ${
            canScrollRight ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      <AnimatePresence>
        {activeCategory && (
          <motion.div
            key="megamenu-panel"
            id="megamenu-panel"
            ref={panelRef}
            role="region"
            aria-label={`${activeCategory.name} categories`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full z-50 border-b border-border bg-background/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-muted to-accent/10">
                    {hasCategoryImage ? (
                      <Image
                        src={activeCategory.image}
                        alt={activeCategory.altText || activeCategory.name}
                        fill
                        sizes="(min-width: 1024px) 260px, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Layers className="h-8 w-8 text-primary/70" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold tracking-tight text-foreground">
                      {activeCategory.name}
                    </h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {activeCategory.excerpt ||
                        "Explore verified products from trusted sellers in this category."}
                    </p>
                  </div>

                  <Link
                    href={`/products?category=${encodeURIComponent(activeCategory.slug)}`}
                    onClick={closeMenu}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:underline"
                  >
                    <span>View all in {activeCategory.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="min-w-0">
                  {activeCategory.children && activeCategory.children.length > 0 ? (
                    <div className="scrollbar-thin grid max-h-[22rem] grid-cols-1 gap-x-8 gap-y-6 overflow-y-auto overscroll-contain pr-2 sm:grid-cols-2 lg:grid-cols-3">
                      {activeCategory.children.map((subCategory) => (
                        <div key={subCategory.id} className="min-w-0">
                          <Link
                            href={`/products?category=${encodeURIComponent(subCategory.slug)}`}
                            onClick={closeMenu}
                            className="group flex items-center justify-between gap-2 border-b border-border/70 pb-1.5 text-[11px] font-black uppercase tracking-wider text-foreground/90 transition-colors hover:text-primary"
                          >
                            <span className="truncate">{subCategory.name}</span>
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                          </Link>

                          {subCategory.children && subCategory.children.length > 0 ? (
                            <ul className="mt-2 space-y-1.5">
                              {subCategory.children.map((item) => (
                                <li key={item.id}>
                                  <Link
                                    href={`/products?category=${encodeURIComponent(item.slug)}`}
                                    onClick={closeMenu}
                                    className="block truncate rounded-md px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-[11px] text-muted-foreground/80">
                              Browse all products
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-xs font-medium text-muted-foreground">
                        No subcategories yet. Browse everything in {activeCategory.name}.
                      </p>
                      <Link
                        href={`/products?category=${encodeURIComponent(activeCategory.slug)}`}
                        onClick={closeMenu}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <span>View all products</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MegaMenu;
