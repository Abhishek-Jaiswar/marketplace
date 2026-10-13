"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Layers, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategoryTreeQuery, type CategoryTreeNode } from "@workspace/store";

export function MegaMenu() {
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch live Category Tree from backend API via RTK Query
  const { data: treeResponse, isLoading, isError } = useGetCategoryTreeQuery();
  const categoryTree: CategoryTreeNode[] = treeResponse?.data || [];

  // Currently active root category node
  const activeCategory = categoryTree.find((c) => c.id === activeCatId);

  // Debounced mouse enter to prevent flickering dropdown on fast cursor sweeps
  const handleMouseEnter = (catId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCatId(catId);
    }, 80);
  };

  // Delayed mouse leave so user can comfortably move cursor into dropdown panel
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCatId(null);
    }, 200);
  };

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCatId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative w-full bg-background/95 border-b border-border shadow-sm z-40 transition-colors"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
        {/* Left Scroll Chevron Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 z-10 p-1.5 rounded-full bg-background/90 border border-border shadow-md text-muted-foreground hover:text-foreground hidden sm:flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Horizontal Category Ribbon Bar */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-2.5 px-2 sm:px-6 text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap scroll-smooth w-full"
        >
          {/* Static Popular Deals Pill */}
          <Link
            href="/products?sort=popular"
            className="shrink-0 px-3.5 py-1.5 rounded-full text-rose-600 dark:text-rose-400 font-extrabold hover:bg-rose-500/10 inline-flex items-center gap-1.5 transition-all duration-150 border border-rose-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Popular Deals</span>
          </Link>

          {/* Skeleton Loader during Initial Fetch */}
          {isLoading && (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-8 w-24 rounded-full bg-muted animate-pulse shrink-0"
                />
              ))}
            </div>
          )}

          {/* Render Root Categories from Backend */}
          {!isLoading &&
            categoryTree.map((cat) => {
              const isActive = activeCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  className="relative shrink-0"
                >
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.slug)}`}
                    className={`px-4 py-1.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${
                      isActive
                        ? "bg-primary text-primary-foreground font-bold shadow-md scale-[1.02]"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </Link>
                </div>
              );
            })}
        </div>

        {/* Right Scroll Chevron Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 z-10 p-1.5 rounded-full bg-background/90 border border-border shadow-md text-muted-foreground hover:text-foreground hidden sm:flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mega Menu Dropdown Panel */}
      <AnimatePresence>
        {activeCatId && activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl z-50 text-foreground overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Category Header Section */}
              <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-11 h-11 rounded-xl bg-muted overflow-hidden flex items-center justify-center shrink-0 border border-border/60 shadow-sm">
                    {activeCategory.image && activeCategory.image.startsWith("http") ? (
                      <Image
                        src={activeCategory.image}
                        alt={activeCategory.altText || activeCategory.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                        unoptimized
                      />
                    ) : (
                      <Layers className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-2">
                      <span>{activeCategory.name}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
                      {activeCategory.excerpt || "Explore verified marketplace products in this category."}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/products?category=${encodeURIComponent(activeCategory.slug)}`}
                  onClick={() => setActiveCatId(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <span>View All In {activeCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Subcategories Grid (Level 1 & Level 2) */}
              {activeCategory.children && activeCategory.children.length > 0 ? (
                <div className="max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {activeCategory.children.map((subCat) => (
                      <div key={subCat.id} className="space-y-3">
                        {/* Level 1 Subcategory Header */}
                        <Link
                          href={`/products?category=${encodeURIComponent(subCat.slug)}`}
                          onClick={() => setActiveCatId(null)}
                          className="block group"
                        >
                          <h4 className="text-xs font-black uppercase tracking-wider text-foreground/90 font-mono border-b border-border/60 pb-1.5 group-hover:text-primary transition-colors flex items-center justify-between">
                            <span>{subCat.name}</span>
                          </h4>
                        </Link>

                        {/* Level 2 Children List */}
                        {subCat.children && subCat.children.length > 0 && (
                          <ul className="space-y-2">
                            {subCat.children.map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={`/products?category=${encodeURIComponent(item.slug)}`}
                                  onClick={() => setActiveCatId(null)}
                                  className="text-xs font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all duration-150"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Package className="w-8 h-8 opacity-40" />
                  <p className="text-xs font-medium">Browse all items directly in {activeCategory.name}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MegaMenu;
