"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All Departments", "Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"];
const trendingSearches = [
  "wireless noise-canceling headphones",
  "ergonomic mechanical keyboard",
  "minimalist leather wallet",
  "stainless steel water bottle",
];

export function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [isFocused, setIsFocused] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowCatMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="flex-1 max-w-2xl relative z-40">
      <div className="flex h-10 w-full rounded-xl bg-muted/30 dark:bg-white/[0.03] border border-border hover:border-border/80 focus-within:border-zinc-500/50 focus-within:ring-2 focus-within:ring-zinc-500/10 focus-within:bg-background transition-all duration-300 overflow-hidden">
        {/* Category selector button */}
        <div className="relative flex items-center h-full">
          <button
            type="button"
            onClick={() => setShowCatMenu(!showCatMenu)}
            className="flex items-center gap-1.5 px-3 h-full border-r border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium cursor-pointer"
          >
            <span>{category}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Category Dropdown Menu */}
          <AnimatePresence>
            {showCatMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-11 left-0 w-44 rounded-xl border border-border bg-popover shadow-2xl p-1.5 z-50 text-popover-foreground"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat === "All Departments" ? "All" : cat);
                      setShowCatMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150 font-medium"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={`Search for products, brands and categories...`}
          className="flex-1 bg-transparent px-4 h-full outline-none text-sm text-foreground placeholder-muted-foreground"
        />

        {/* Search Action Button */}
        <button className="flex items-center justify-center w-11 h-full hover:bg-muted text-muted-foreground hover:text-foreground border-l border-border transition-all cursor-pointer">
          <Search className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Suggestion panel */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute top-full left-0 w-full rounded-2xl border border-border bg-popover shadow-2xl p-4 z-40 overflow-hidden text-popover-foreground"
          >
            {query.trim().length === 0 ? (
              <div className="space-y-4">
                {/* Trending section */}
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 animate-pulse" />
                    <span>Trending Searches</span>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="w-full flex items-center justify-between text-left py-2 px-2.5 rounded-xl hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <span>{term}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-zinc-500 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 font-mono">
                  <Search className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Matching Suggestions</span>
                </div>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 py-2.5 px-2.5 rounded-xl hover:bg-muted text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span>Search for <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">{query}</strong> in {category}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default NavbarSearch;
