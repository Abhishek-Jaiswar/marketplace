"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockCategories, Category } from "../../../utils/mockData";

export function MegaMenu() {
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeCategory: Category | undefined = mockCategories.find(
    (c) => c.id === activeCatId
  );

  const handleMouseEnter = (catId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCatId(catId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCatId(null);
    }, 200);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative w-full bg-background border-b border-border shadow-sm z-40 transition-colors"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-1 z-10 p-1.5 rounded-full bg-background/90 border border-border shadow-md text-muted-foreground hover:text-foreground hidden sm:flex items-center justify-center cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Horizontal Category Ribbon Bar */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2.5 px-2 sm:px-6 text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap scroll-smooth w-full"
        >
          {mockCategories.map((cat) => {
            const isActive = activeCatId === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                className="relative shrink-0"
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 inline-flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : cat.isPopular
                      ? "text-rose-600 dark:text-rose-400 font-extrabold hover:bg-rose-500/10"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.isPopular && <Sparkles className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />}
                  <span>{cat.name}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 z-10 p-1.5 rounded-full bg-background/90 border border-border shadow-md text-muted-foreground hover:text-foreground hidden sm:flex items-center justify-center cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* MegaMenu Dropdown Panel */}
      <AnimatePresence>
        {activeCatId && activeCategory && activeCategory.subCategoryGroups && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full left-0 w-full bg-popover/95 backdrop-blur-xl border-b border-border shadow-2xl z-50 text-popover-foreground overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Category Header Bar */}
              <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeCategory.image}</span>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground tracking-tight">
                      {activeCategory.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Explore over {activeCategory.itemCount.toLocaleString()} verified marketplace products
                    </p>
                  </div>
                </div>

                <Link
                  href={`/products?category=${encodeURIComponent(activeCategory.name)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group"
                >
                  <span>View All In {activeCategory.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Subcategories Grid (Scrollable columns) */}
              <div className="max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                  {activeCategory.subCategoryGroups.map((group, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground font-mono border-b border-border/60 pb-1.5">
                        {group.title}
                      </h4>
                      <ul className="space-y-1.5">
                        {group.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={`/products?category=${encodeURIComponent(activeCategory.name)}&q=${encodeURIComponent(item)}`}
                              onClick={() => setActiveCatId(null)}
                              className="text-xs font-medium text-foreground/80 hover:text-primary hover:translate-x-1 inline-block transition-all duration-150"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
