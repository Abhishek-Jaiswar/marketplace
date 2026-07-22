"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { mockCategories, Category } from "../../utils/mockData";

interface CategoryGridProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryName: string) => void;
}

export function CategoryGrid({ selectedCategory = "All", onSelectCategory }: CategoryGridProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" />
            Curated Catalog
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Explore Popular Categories
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline group"
        >
          View All Categories
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockCategories.map((cat: Category) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 group hover:-translate-y-1 ${
                isSelected
                  ? "bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "bg-card hover:bg-card/80 border-border hover:border-zinc-400/50 hover:shadow-xl"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl mb-3 transition-transform duration-300 group-hover:scale-110 shadow-sm`}
              >
                {cat.image}
              </div>
              <h3 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] font-medium text-muted-foreground mt-1">
                {cat.itemCount.toLocaleString()} Products
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryGrid;
