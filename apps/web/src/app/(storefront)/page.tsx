"use client";

import React, { useState } from "react";
import {
  TrustBadges,
  HeroSection,
  CategoryGrid,
  FlashDealsSection,
  FeaturedProductsGrid,
  TopVendorsSection,
  PromoBanners,
  SellerCtaBanner,
  TestimonialsSection,
} from "../../components/home";

export default function StorefrontPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [, setCart] = useState<string[]>([]);

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (id: string) => {
    setCart((prev) => [...prev, id]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. TRUST & VALUE PROPOSITIONS BAR */}
      <div className="mt-8">
        <TrustBadges />
      </div>

      {/* 3. CATEGORY EXPLORER */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. FLASH DEALS WITH LIVE COUNTDOWN */}
      <FlashDealsSection onAddToCart={handleAddToCart} />

      {/* 5. FEATURED PRODUCTS CATALOG GRID */}
      <FeaturedProductsGrid
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlist={wishlist}
      />

      {/* 6. CURATED PROMO BANNER CARDS */}
      <PromoBanners />

      {/* 7. FEATURED MULTI-VENDOR STORES */}
      <TopVendorsSection />

      {/* 8. MERCHANT ONBOARDING CTA */}
      <SellerCtaBanner />

      {/* 9. TESTIMONIALS & REVIEWS */}
      <TestimonialsSection />
    </div>
  );
}
