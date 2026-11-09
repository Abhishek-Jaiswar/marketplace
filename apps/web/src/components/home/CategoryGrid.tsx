"use client"

import Image from "next/image"
import Link from "next/link"
import { useGetCategoryTreeQuery } from "@workspace/store"

export function CategoryGrid() {
  const { data, isError, refetch } = useGetCategoryTreeQuery()
  const categories = data?.data ?? []

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold type-display">
        Shop by category
      </h2>

      {isError ? (
        <div className="flex items-center gap-4 text-muted-foreground">
          <p>Categories could not be loaded.</p>
          <button
            onClick={() => refetch()}
            className="font-semibold text-foreground underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <span className="relative block aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={category.image}
                    alt={category.altText}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 16vw, 50vw"
                    className="object-cover"
                  />
                </span>
                <span className="mt-2 block font-medium group-hover:underline">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CategoryGrid
