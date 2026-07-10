export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  gradient: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  tag?: string;
  description: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  bgGradient: string;
  tag: string;
}

export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    image: "📺",
    itemCount: 1240,
    gradient: "from-zinc-500/5 to-zinc-500/5 dark:from-zinc-500/10 dark:to-zinc-500/10",
  },
  {
    id: "cat-2",
    name: "Fashion & Apparel",
    image: "👕",
    itemCount: 3120,
    gradient: "from-zinc-500/5 to-zinc-500/5 dark:from-zinc-500/10 dark:to-zinc-500/10",
  },
  {
    id: "cat-3",
    name: "Home & Kitchen",
    image: "🍳",
    itemCount: 840,
    gradient: "from-zinc-500/5 to-zinc-500/5 dark:from-zinc-500/10 dark:to-zinc-500/10",
  },
  {
    id: "cat-4",
    name: "Books & Media",
    image: "📚",
    itemCount: 4200,
    gradient: "from-zinc-500/5 to-zinc-500/5 dark:from-zinc-500/10 dark:to-zinc-500/10",
  },
  {
    id: "cat-5",
    name: "Sports & Outdoors",
    image: "⚽",
    itemCount: 650,
    gradient: "from-zinc-500/5 to-zinc-500/5 dark:from-zinc-500/10 dark:to-zinc-500/10",
  },
  {
    id: "cat-6",
    name: "Beauty & Personal Care",
    image: "💄",
    itemCount: 1560,
    gradient: "from-zinc-500/5 to-zinc-500/5 dark:from-zinc-500/10 dark:to-zinc-500/10",
  },
];

export const mockHeroBanners: HeroBanner[] = [
  {
    id: "hero-1",
    title: "Next-Gen Audio Experience",
    subtitle: "Immersive noise cancellation, 40-hour battery life, and crystal-clear high fidelity sound.",
    buttonText: "Shop Wireless Pro",
    link: "/products/wireless-pro",
    bgGradient: "from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900",
    tag: "TECH EXCLUSIVE",
  },
  {
    id: "hero-2",
    title: "Elevate Your Workspace",
    subtitle: "Ergonomic designs, mechanical keyboards, and minimalist desk setups crafted for creators.",
    buttonText: "Explore Desk Setup",
    link: "/deals/workspace",
    bgGradient: "from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900",
    tag: "CREATOR STUDIO",
  },
  {
    id: "hero-3",
    title: "Summer Collection 2026",
    subtitle: "Eco-friendly premium linen apparel designed for natural cooling and casual comfort.",
    buttonText: "Browse Collection",
    link: "/categories/fashion",
    bgGradient: "from-zinc-100 via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900",
    tag: "FASHION SPOTLIGHT",
  },
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "AeroSound Pro Wireless Headphones",
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 312,
    image: "🎧",
    category: "Electronics",
    tag: "24% OFF",
    description: "Hybrid active noise canceling, high-resolution wireless audio, smart assistant integrations.",
  },
  {
    id: "prod-2",
    name: "KeyCraft Mechanical Keyboard",
    price: 129.99,
    rating: 4.9,
    reviewCount: 84,
    image: "⌨️",
    category: "Electronics",
    tag: "Best Seller",
    description: "Hot-swappable tactile brown switches, solid aluminum frame, dual-mode Bluetooth/wired connection.",
  },
  {
    id: "prod-3",
    name: "Minimalist Full-Grain Leather Wallet",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviewCount: 142,
    image: "👛",
    category: "Fashion & Apparel",
    tag: "16% OFF",
    description: "RFID blocking slim card wallet made from authentic top grain leather with convenient pull tab.",
  },
  {
    id: "prod-4",
    name: "Insulated Stainless Steel Flask (1L)",
    price: 29.99,
    rating: 4.6,
    reviewCount: 420,
    image: "🥛",
    category: "Home & Kitchen",
    tag: "Popular",
    description: "Double-walled vacuum insulation keeps beverages ice cold for 24 hours or steaming hot for 12 hours.",
  },
  {
    id: "prod-5",
    name: "CoreStrength Ergonomic Office Chair",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 95,
    image: "💺",
    category: "Home & Kitchen",
    tag: "Free Shipping",
    description: "Fully adjustable lumbar support, 3D armrests, breathable cooling mesh back, and sturdy base.",
  },
  {
    id: "prod-6",
    name: "Ultimate Fitness Resistance Band Set",
    price: 19.99,
    rating: 4.4,
    reviewCount: 512,
    image: "🎗️",
    category: "Sports & Outdoors",
    description: "Includes 5 stackable workout bands, foam handles, door anchor, ankle straps, and storage pouch.",
  },
];
