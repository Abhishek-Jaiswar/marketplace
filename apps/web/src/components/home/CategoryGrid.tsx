"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
import { mockCategories, Category } from "../../utils/mockData"

interface CategoryGridProps {
  selectedCategory?: string
  onSelectCategory?: (categoryName: string) => void
}

export function CategoryGrid({
  selectedCategory = "All",
  onSelectCategory,
}: CategoryGridProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
            <Layers className="h-3.5 w-3.5" />
            Curated Catalog
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Explore Popular Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline sm:text-sm dark:text-blue-400"
        >
          View All Categories
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {mockCategories.map((cat: Category) => {
          const isSelected = selectedCategory === cat.name
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`group flex flex-col items-center rounded-2xl border p-5 text-center transition-all duration-300 hover:-translate-y-1 ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 shadow-lg ring-2 shadow-blue-500/10 ring-blue-500/20"
                  : "border-border bg-card hover:border-zinc-400/50 hover:bg-card/80 hover:shadow-xl"
              }`}
            >
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${cat.gradient} mb-3 flex items-center justify-center text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                {cat.image}
              </div>
              <h3 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {cat.name}
              </h3>
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                {cat.itemCount.toLocaleString()} Products
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryGrid
