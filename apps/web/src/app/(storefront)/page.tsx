"use client"

import React, { useState } from "react"
import {
  CategoryGrid,
  FeaturedProductsGrid,
  SellerCtaBanner,
} from "../../components/home"

export default function StorefrontPage() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [, setCart] = useState<string[]>([])

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleAddToCart = (id: string) => {
    setCart((prev) => [...prev, id])
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CategoryGrid />
      <FeaturedProductsGrid
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
      />
      <SellerCtaBanner />
    </div>
  )
}
