"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown, ArrowRight, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const categories = [
  "All Departments",
  "Electronics",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Books & Stationeries",
  "Sports & Outdoors",
  "Beauty & Wellness",
]
const trendingSearches = [
  "wireless noise-canceling headphones",
  "ergonomic mechanical keyboard",
  "minimalist leather wallet",
  "stainless steel water bottle",
]

export function NavbarSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [isFocused, setIsFocused] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
        setShowCatMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (searchTerm?: string) => {
    const termToSearch = searchTerm !== undefined ? searchTerm : query
    setIsFocused(false)
    setShowCatMenu(false)

    const params = new URLSearchParams()
    if (termToSearch.trim()) {
      params.set("q", termToSearch.trim())
    }
    if (category && category !== "All" && category !== "All Departments") {
      params.set("category", category)
    }

    const queryString = params.toString()
    router.push(`/products${queryString ? `?${queryString}` : ""}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  return (
    <div ref={searchRef} className="relative z-40 max-w-2xl flex-1">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSearchSubmit()
        }}
        className="flex h-10 w-full overflow-hidden rounded-xl border border-border bg-muted/30 transition-all duration-300 focus-within:border-primary/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/10 hover:border-border/80 dark:bg-white/[0.03]"
      >
        {/* Category selector button */}
        <div className="relative flex h-full items-center">
          <button
            type="button"
            onClick={() => setShowCatMenu(!showCatMenu)}
            className="flex h-full cursor-pointer items-center gap-1.5 border-r border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="max-w-[100px] truncate">{category}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {/* Category Dropdown Menu */}
          <AnimatePresence>
            {showCatMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-11 left-0 z-50 w-48 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat === "All Departments" ? "All" : cat)
                      setShowCatMenu(false)
                    }}
                    className="w-full truncate rounded-lg px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground"
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
          onKeyDown={handleKeyDown}
          placeholder="Search for products, brands and categories..."
          className="h-full flex-1 bg-transparent px-4 text-sm text-foreground placeholder-muted-foreground outline-none"
        />

        {/* Search Action Button */}
        <button
          type="submit"
          className="flex h-full w-11 cursor-pointer items-center justify-center border-l border-border transition-all hover:bg-secondary hover:text-secondary-foreground"
          aria-label="Submit Search"
        >
          <Search className="h-4.5 w-4.5" />
        </button>
      </form>

      {/* Suggestion panel */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute top-full left-0 z-40 w-full overflow-hidden rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-2xl"
          >
            {query.trim().length === 0 ? (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                    <span>Trending Searches</span>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term)
                          handleSearchSubmit(term)
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                      >
                        <span>{term}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Execute Search Query</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-xs font-semibold text-foreground transition-colors hover:bg-secondary/10 hover:text-secondary"
                >
                  <Search className="h-4 w-4 text-primary" />
                  <span>
                    Search for{" "}
                    <strong className="font-extrabold text-primary">
                      &ldquo;{query}&rdquo;
                    </strong>{" "}
                    in {category}
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NavbarSearch
