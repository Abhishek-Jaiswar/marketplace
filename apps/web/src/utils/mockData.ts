export interface SubCategoryGroup {
  title: string;
  items: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  gradient: string;
  description?: string;
  slug: string;
  isPopular?: boolean;
  subCategoryGroups?: SubCategoryGroup[];
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
  vendorId?: string;
  vendorName?: string;
  inStock?: boolean;
  features?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  bannerGradient: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  verified: boolean;
  category: string;
  description: string;
  joinDate: string;
}

export interface FlashDeal {
  id: string;
  productId: string;
  product: Product;
  discountPercentage: number;
  totalStock: number;
  soldCount: number;
  endTime: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  bgGradient: string;
  tag: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  userName: string;
  userRole: string;
  avatar: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  productName?: string;
}

export const mockCategories: Category[] = [
  {
    id: "cat-popular",
    name: "Popular Deals",
    slug: "popular",
    image: "🔥",
    itemCount: 5200,
    gradient: "from-amber-500/10 to-rose-500/10",
    isPopular: true,
    subCategoryGroups: [
      {
        title: "Trending Today",
        items: ["Wireless Earbuds", "Smart Watches", "Kurtis & Tunics", "Running Shoes", "Air Fryers"],
      },
      {
        title: "Top Rated Sellers",
        items: ["Apex Electronics", "Nordic Atelier", "Urban Thread Co.", "Aura Botanicals"],
      },
      {
        title: "Budget Bestsellers",
        items: ["Under $15 Deals", "Under $25 Fashion", "Home Essentials", "Buy 1 Get 1 Free"],
      },
    ],
  },
  {
    id: "cat-1",
    name: "Kurti, Saree & Lehenga",
    slug: "ethnic-wear",
    image: "🥻",
    itemCount: 4120,
    gradient: "from-rose-500/10 via-pink-500/10 to-amber-500/10",
    subCategoryGroups: [
      {
        title: "All Kurtis",
        items: ["Anarkali Kurtis", "Rayon Kurtis", "Cotton Kurtis", "Printed Kurtis", "Short Kurtis", "Kurta Sets"],
      },
      {
        title: "Sarees & Blouses",
        items: ["Silk Sarees", "Cotton Sarees", "Georgette Sarees", "Chiffon Sarees", "Designer Blouses", "Petticoats"],
      },
      {
        title: "Lehengas & Suits",
        items: ["Bridal Lehengas", "Partywear Lehengas", "Palazzo Suits", "Sharara Sets", "Ethnic Gowns"],
      },
      {
        title: "Dupattas & Accessories",
        items: ["Phulkari Dupattas", "Banarasi Dupattas", "Ethnic Jackets", "Potli Bags"],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Women Western",
    slug: "women-western",
    image: "👗",
    itemCount: 3890,
    gradient: "from-pink-500/10 to-purple-500/10",
    subCategoryGroups: [
      {
        title: "Tops & Tees",
        items: ["Casual Tops", "Graphic T-Shirts", "Crop Tops", "Shirts & Blouses", "Tank Tops"],
      },
      {
        title: "Dresses & Jumpsuits",
        items: ["Maxi Dresses", "Bodycon Dresses", "Floral Sundresses", "Casual Jumpsuits", "Party Dresses"],
      },
      {
        title: "Bottom Wear",
        items: ["High-Waist Jeans", "Trousers & Pants", "Shorts & Skirts", "Leggings & Jeggings"],
      },
      {
        title: "Winter & Outerwear",
        items: ["Jackets & Coats", "Sweaters & Cardigans", "Hoodies & Sweatshirts"],
      },
    ],
  },
  {
    id: "cat-3",
    name: "Lingerie & Innerwear",
    slug: "lingerie",
    image: "👙",
    itemCount: 1850,
    gradient: "from-fuchsia-500/10 to-rose-500/10",
    subCategoryGroups: [
      {
        title: "Bras & Sets",
        items: ["Padded Bras", "Non-Padded Bras", "Sports Bras", "Bralettes", "T-Shirt Bras"],
      },
      {
        title: "Sleep & Loungewear",
        items: ["Night Suits", "Nightgowns", "Pajama Sets", "Robes & Slips"],
      },
      {
        title: "Shapewear",
        items: ["Tummy Tuckers", "Body Suits", "Thigh Shapers"],
      },
    ],
  },
  {
    id: "cat-4",
    name: "Men Fashion",
    slug: "men-fashion",
    image: "👕",
    itemCount: 4500,
    gradient: "from-blue-500/10 to-indigo-500/10",
    subCategoryGroups: [
      {
        title: "Top Wear",
        items: ["Polo T-Shirts", "Casual Shirts", "Formal Shirts", "Oversized Tees", "Sweatshirts"],
      },
      {
        title: "Bottom Wear",
        items: ["Slim Fit Jeans", "Chinos & Trousers", "Cargo Pants", "Track Pants", "Shorts"],
      },
      {
        title: "Ethnic Wear",
        items: ["Men Kurtas", "Nehru Jackets", "Sherwanis", "Pyjama Sets"],
      },
      {
        title: "Innerwear",
        items: ["Briefs & Trunks", "Boxers", "Vests"],
      },
    ],
  },
  {
    id: "cat-5",
    name: "Kids & Toys",
    slug: "kids-toys",
    image: "🧸",
    itemCount: 2900,
    gradient: "from-amber-500/10 to-yellow-500/10",
    subCategoryGroups: [
      {
        title: "Boys Clothing",
        items: ["T-Shirts & Sets", "Jeans & Shorts", "Party Wear", "Nightwear"],
      },
      {
        title: "Girls Clothing",
        items: ["Frocks & Dresses", "Tops & Skirts", "Ethnic Wear", "Lehenga Sets"],
      },
      {
        title: "Toys & Games",
        items: ["Soft Toys", "Educational Games", "Remote Control Cars", "Puzzles & Board Games", "Building Blocks"],
      },
      {
        title: "Baby Care",
        items: ["Diapers & Wipes", "Baby Strollers", "Feeding Bottles", "Baby Skincare"],
      },
    ],
  },
  {
    id: "cat-6",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "🍳",
    itemCount: 3400,
    gradient: "from-emerald-500/10 to-teal-500/10",
    subCategoryGroups: [
      {
        title: "Kitchen & Dining",
        items: ["Cookware Sets", "Non-Stick Pans", "Dinnerware & Cutlery", "Storage Containers", "Coffee Makers"],
      },
      {
        title: "Home Decor",
        items: ["Wall Art & Clocks", "Curtains & Blinds", "Cushion Covers", "Vases & Figurines", "Lighting & Lamps"],
      },
      {
        title: "Bed & Bath",
        items: ["Bedsheets & Pillowcases", "Blankets & Comforters", "Bath Towels", "Bath Mats"],
      },
      {
        title: "Home Appliances",
        items: ["Air Fryers", "Electric Kettles", "Vacuum Cleaners", "Water Purifiers"],
      },
    ],
  },
  {
    id: "cat-7",
    name: "Beauty & Health",
    slug: "beauty-health",
    image: "💄",
    itemCount: 2750,
    gradient: "from-pink-500/10 to-rose-500/10",
    subCategoryGroups: [
      {
        title: "Makeup",
        items: ["Lipsticks & Lip Gloss", "Foundations & Concealers", "Eyeliners & Mascara", "Makeup Palettes"],
      },
      {
        title: "Skincare",
        items: ["Facial Serums", "Moisturizers", "Sunscreens", "Face Washes & Scrubs"],
      },
      {
        title: "Haircare",
        items: ["Shampoos & Conditioners", "Hair Oils & Serums", "Hair Dryers & Straighteners"],
      },
      {
        title: "Personal Care",
        items: ["Perfumes & Deodorants", "Grooming Trimmers", "Oral Care", "Sanitizers"],
      },
    ],
  },
  {
    id: "cat-8",
    name: "Jewellery & Accessories",
    slug: "jewellery",
    image: "💍",
    itemCount: 2200,
    gradient: "from-yellow-500/10 to-amber-500/10",
    subCategoryGroups: [
      {
        title: "Fashion Jewellery",
        items: ["Earrings & Studs", "Necklace Sets", "Bangles & Bracelets", "Rings", "Anklets"],
      },
      {
        title: "Silver & Gold Plated",
        items: ["Sterling Silver Rings", "Temple Jewellery", "Kundans & Pearls"],
      },
      {
        title: "Accessories",
        items: ["Hair Pins & Bands", "Sunglasses", "Belts & Wallets", "Scarves"],
      },
    ],
  },
  {
    id: "cat-9",
    name: "Bags & Footwear",
    slug: "bags-footwear",
    image: "👠",
    itemCount: 3100,
    gradient: "from-purple-500/10 to-indigo-500/10",
    subCategoryGroups: [
      {
        title: "Women Footwear",
        items: ["Heels & Pumps", "Flats & Sandals", "Sneakers", "Ethnic Juttis"],
      },
      {
        title: "Men Footwear",
        items: ["Casual Sneakers", "Formal Shoes", "Loafers", "Sports Shoes", "Sandals & Slippers"],
      },
      {
        title: "Bags & Purses",
        items: ["Handbags & Totes", "Sling Bags", "Backpacks", "Clutches & Wallets"],
      },
    ],
  },
  {
    id: "cat-10",
    name: "Electronics & Gadgets",
    slug: "electronics",
    image: "📱",
    itemCount: 4800,
    gradient: "from-blue-500/10 to-sky-500/10",
    subCategoryGroups: [
      {
        title: "Audio Gear",
        items: ["Noise Canceling Headphones", "Wireless Earbuds", "Bluetooth Speakers", "Soundbars"],
      },
      {
        title: "Mobile Accessories",
        items: ["Power Banks", "Fast Chargers", "Phone Cases", "Screen Protectors"],
      },
      {
        title: "Computer Peripherals",
        items: ["Mechanical Keyboards", "Ergonomic Mice", "Gaming Monitors", "USB Hubs"],
      },
      {
        title: "Wearable Tech",
        items: ["Smartwatches", "Fitness Bands", "VR Headsets"],
      },
    ],
  },
  {
    id: "cat-11",
    name: "Watches",
    slug: "watches",
    image: "⌚",
    itemCount: 1600,
    gradient: "from-slate-500/10 to-zinc-500/10",
    subCategoryGroups: [
      {
        title: "Men Watches",
        items: ["Analog Watches", "Chronograph Watches", "Leather Strap Watches", "Stainless Steel Watches"],
      },
      {
        title: "Women Watches",
        items: ["Designer Rose Gold", "Minimalist Mesh Strap", "Bracelet Watches"],
      },
      {
        title: "Smart Watches",
        items: ["AMOLED Display Watches", "Calling Smartwatches", "Sports Trackers"],
      },
    ],
  },
  {
    id: "cat-12",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    image: "⚽",
    itemCount: 1400,
    gradient: "from-green-500/10 to-emerald-500/10",
    subCategoryGroups: [
      {
        title: "Fitness Equipment",
        items: ["Resistance Bands", "Dumbbells & Barbells", "Yoga Mats", "Ab Rollers"],
      },
      {
        title: "Sports Gear",
        items: ["Badminton Rackets", "Cricket Bats", "Football & Basketball", "Cycling Helmets"],
      },
    ],
  },
  {
    id: "cat-13",
    name: "Automotive Accessories",
    slug: "automotive",
    image: "🚗",
    itemCount: 1100,
    gradient: "from-red-500/10 to-orange-500/10",
    subCategoryGroups: [
      {
        title: "Car Accessories",
        items: ["Car Phone Mounts", "Car Air Fresheners", "Seat Covers", "Car Vacuum Cleaners"],
      },
      {
        title: "Bike Accessories",
        items: ["Riding Gloves", "Rider Helmets", "Bike Mobile Holders", "Chain Cleaners"],
      },
    ],
  },
  {
    id: "cat-14",
    name: "Books & Stationery",
    slug: "books-stationery",
    image: "📚",
    itemCount: 3600,
    gradient: "from-cyan-500/10 to-blue-500/10",
    subCategoryGroups: [
      {
        title: "Fiction & Non-Fiction",
        items: ["Bestselling Novels", "Self-Help & Business", "Biographies", "Comics & Manga"],
      },
      {
        title: "Stationery",
        items: ["Journals & Planners", "Fountain Pens", "Art & Craft Supplies", "Desk Organizers"],
      },
    ],
  },
  {
    id: "cat-15",
    name: "Artisanal & Handloom",
    slug: "artisanal",
    image: "🧵",
    itemCount: 950,
    gradient: "from-amber-600/10 to-orange-600/10",
    subCategoryGroups: [
      {
        title: "Handmade Crafts",
        items: ["Terracotta Pottery", "Brass Idols", "Handwoven Carpets", "Handpainted Coasters"],
      },
      {
        title: "Organic Textiles",
        items: ["Handloom Sarees", "Organic Cotton Dupattas", "Kalamkari Fabric"],
      },
    ],
  },
  {
    id: "cat-16",
    name: "Groceries & Essentials",
    slug: "groceries",
    image: "🛒",
    itemCount: 5100,
    gradient: "from-emerald-500/10 to-lime-500/10",
    subCategoryGroups: [
      {
        title: "Pantry Staples",
        items: ["Rice & Flour", "Pulses & Dal", "Cooking Oils", "Spices & Herbs"],
      },
      {
        title: "Snacks & Beverages",
        items: ["Gourmet Coffees", "Herbal Teas", "Nuts & Dried Fruits", "Chocolates & Biscuits"],
      },
    ],
  },
  {
    id: "cat-17",
    name: "Pet Care",
    slug: "pet-care",
    image: "🐾",
    itemCount: 880,
    gradient: "from-teal-500/10 to-cyan-500/10",
    subCategoryGroups: [
      {
        title: "Dog Supplies",
        items: ["Dog Food & Treats", "Leashes & Harnesses", "Grooming Shampoos", "Chew Toys"],
      },
      {
        title: "Cat Supplies",
        items: ["Cat Food", "Cat Litter", "Scratching Posts", "Interactive Toys"],
      },
    ],
  },
  {
    id: "cat-18",
    name: "Office Supplies",
    slug: "office-supplies",
    image: "🏢",
    itemCount: 1250,
    gradient: "from-slate-500/10 to-gray-500/10",
    subCategoryGroups: [
      {
        title: "Desk Setup",
        items: ["Monitor Risers", "Cable Management", "Desk Mats & Pads", "Paper Shredders"],
      },
      {
        title: "Filing & Paper",
        items: ["Printing Paper", "Folder Binders", "Sticky Notes & Markers"],
      },
    ],
  },
  {
    id: "cat-19",
    name: "Luggage & Travel",
    slug: "luggage",
    image: "🧳",
    itemCount: 1350,
    gradient: "from-indigo-500/10 to-violet-500/10",
    subCategoryGroups: [
      {
        title: "Travel Bags",
        items: ["Hard Shell Trolley Bags", "Duffel Bags", "Laptop Travel Backpacks", "Passport Covers"],
      },
      {
        title: "Travel Comfort",
        items: ["Neck Pillows", "Packing Cubes", "Luggage Locks"],
      },
    ],
  },
];

export const mockHeroBanners: HeroBanner[] = [
  {
    id: "hero-1",
    title: "Next-Gen Audio Experience",
    subtitle: "Immersive active noise cancellation, 40-hour battery life, and crystal-clear high fidelity sound.",
    buttonText: "Shop Audio Pro",
    link: "/products/prod-1",
    bgGradient: "from-blue-900/90 via-indigo-950 to-zinc-950 text-white",
    tag: "TECH EXCLUSIVE",
    image: "🎧",
  },
  {
    id: "hero-2",
    title: "Elevate Your Workspace",
    subtitle: "Ergonomic designs, custom mechanical keyboards, and minimalist desk setups built for peak productivity.",
    buttonText: "Explore Keyboards",
    link: "/products/prod-2",
    bgGradient: "from-purple-900/90 via-slate-950 to-zinc-950 text-white",
    tag: "CREATOR STUDIO",
    image: "⌨️",
  },
  {
    id: "hero-3",
    title: "Summer Collection 2026",
    subtitle: "Eco-friendly premium apparel designed for effortless style and breathable everyday comfort.",
    buttonText: "Browse Fashion",
    link: "/products?category=Fashion+%26+Apparel",
    bgGradient: "from-amber-900/90 via-orange-950 to-zinc-950 text-white",
    tag: "FASHION SPOTLIGHT",
    image: "👕",
  },
];

export const mockVendors: Vendor[] = [
  {
    id: "v-1",
    name: "Apex Electronics",
    slug: "apex-electronics",
    logo: "⚡",
    bannerGradient: "from-blue-600 to-indigo-800",
    rating: 4.9,
    reviewCount: 1420,
    productCount: 86,
    verified: true,
    category: "Electronics",
    description: "Premium audio, keyboards, and high-performance workstation gadgets.",
    joinDate: "Member since 2024",
  },
  {
    id: "v-2",
    name: "Nordic Atelier",
    slug: "nordic-atelier",
    logo: "🌿",
    bannerGradient: "from-emerald-600 to-teal-800",
    rating: 4.8,
    reviewCount: 890,
    productCount: 142,
    verified: true,
    category: "Home & Kitchen",
    description: "Minimalist Scandinavian home decor, handcrafted ceramics, and ergonomic furniture.",
    joinDate: "Member since 2023",
  },
  {
    id: "v-3",
    name: "Urban Thread Co.",
    slug: "urban-thread",
    logo: "🧵",
    bannerGradient: "from-rose-600 to-amber-700",
    rating: 4.7,
    reviewCount: 650,
    productCount: 210,
    verified: true,
    category: "Fashion & Apparel",
    description: "Sustainable streetwear and handcrafted full-grain leather accessories.",
    joinDate: "Member since 2025",
  },
  {
    id: "v-4",
    name: "Aura Botanicals",
    slug: "aura-botanicals",
    logo: "🌸",
    bannerGradient: "from-purple-600 to-pink-700",
    rating: 4.9,
    reviewCount: 430,
    productCount: 54,
    verified: true,
    category: "Beauty & Wellness",
    description: "Cruelty-free organic skincare and essential oil formulations.",
    joinDate: "Member since 2024",
  },
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "AeroSound Pro Noise-Canceling Headphones",
    price: 189.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 312,
    image: "🎧",
    category: "Electronics & Gadgets",
    tag: "24% OFF",
    vendorId: "v-1",
    vendorName: "Apex Electronics",
    inStock: true,
    description: "Hybrid active noise canceling, high-resolution wireless audio, 40-hour long playback, and ultra-comfortable memory foam earcups.",
    features: ["Active Noise Cancellation", "40H Battery Life", "Bluetooth 5.3 & AUX", "Fast USB-C Charging"],
  },
  {
    id: "prod-2",
    name: "KeyCraft Custom Mechanical Keyboard",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviewCount: 184,
    image: "⌨️",
    category: "Electronics & Gadgets",
    tag: "Best Seller",
    vendorId: "v-1",
    vendorName: "Apex Electronics",
    inStock: true,
    description: "Hot-swappable tactile mechanical switches, CNC aluminum casing, per-key RGB backlighting, and dual wireless mode.",
    features: ["Hot-Swappable Switches", "Aluminum Chassis", "RGB Backlit Keys", "2.4GHz / BT / USB-C"],
  },
  {
    id: "prod-3",
    name: "Minimalist Full-Grain Leather Wallet",
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.7,
    reviewCount: 142,
    image: "👛",
    category: "Women Western",
    tag: "16% OFF",
    vendorId: "v-3",
    vendorName: "Urban Thread Co.",
    inStock: true,
    description: "RFID blocking slim card wallet made from authentic top grain leather with quick pull tab mechanism.",
    features: ["100% Genuine Leather", "RFID Protection", "Holds up to 10 cards", "Slim Pocket Design"],
  },
  {
    id: "prod-4",
    name: "Thermal Insulated Stainless Flask (1L)",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.6,
    reviewCount: 420,
    image: "🥛",
    category: "Home & Kitchen",
    tag: "Popular",
    vendorId: "v-2",
    vendorName: "Nordic Atelier",
    inStock: true,
    description: "Double-walled vacuum insulation keeps beverages ice cold for 24 hours or steaming hot for 12 hours.",
    features: ["BPA Free", "24H Cold / 12H Hot", "Leakproof Lid", "Sweat-proof Powder Coating"],
  },
  {
    id: "prod-5",
    name: "CoreErgo 3D Mesh Lumbar Desk Chair",
    price: 349.99,
    originalPrice: 420.00,
    rating: 4.8,
    reviewCount: 95,
    image: "💺",
    category: "Home & Kitchen",
    tag: "Free Shipping",
    vendorId: "v-2",
    vendorName: "Nordic Atelier",
    inStock: true,
    description: "Fully adjustable dynamic lumbar support, 3D armrests, breathable cooling mesh backrest, and heavy-duty steel base.",
    features: ["Dynamic Lumbar Support", "3D Adjustable Armrests", "Breathable Mesh", "135° Recline System"],
  },
  {
    id: "prod-6",
    name: "ProStrength Fitness Resistance Band Kit",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviewCount: 512,
    image: "🎗️",
    category: "Sports & Fitness",
    tag: "Hot Deal",
    vendorId: "v-3",
    vendorName: "Urban Thread Co.",
    inStock: true,
    description: "Includes 5 stackable workout latex bands, cushioned handles, heavy-duty door anchor, and carrying pouch.",
    features: ["5 Resistance Levels", "Natural Latex", "Padded Ankle Straps", "Portable Travel Pouch"],
  },
  {
    id: "prod-7",
    name: "Aura Glow Hydrating Facial Serum",
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.9,
    reviewCount: 230,
    image: "🧪",
    category: "Beauty & Health",
    tag: "Top Rated",
    vendorId: "v-4",
    vendorName: "Aura Botanicals",
    inStock: true,
    description: "Hyaluronic acid and vitamin C complex for intense skin moisture barrier restoration and radiant complexion.",
    features: ["100% Vegan & Cruelty Free", "Deep Hydration", "Vitamin C & Niacinamide", "Dermatologist Tested"],
  },
  {
    id: "prod-8",
    name: "Ultra-Clean Smart Ceramic Electric Kettle",
    price: 64.50,
    originalPrice: 79.99,
    rating: 4.7,
    reviewCount: 168,
    image: "🫖",
    category: "Home & Kitchen",
    tag: "New Arrival",
    vendorId: "v-2",
    vendorName: "Nordic Atelier",
    inStock: true,
    description: "Precision temperature control kettle with gooseneck spout for perfect pour-over coffee and tea brewing.",
    features: ["Precision Temp Control", "Quick Boil 1200W", "Keep-Warm Mode", "Auto Shut-Off Safety"],
  },
];

export const mockFlashDeals: FlashDeal[] = [
  {
    id: "fd-1",
    productId: "prod-1",
    product: mockProducts[0]!,
    discountPercentage: 24,
    totalStock: 50,
    soldCount: 38,
    endTime: "2026-07-22T23:59:59",
  },
  {
    id: "fd-2",
    productId: "prod-2",
    product: mockProducts[1]!,
    discountPercentage: 19,
    totalStock: 30,
    soldCount: 24,
    endTime: "2026-07-22T23:59:59",
  },
  {
    id: "fd-3",
    productId: "prod-5",
    product: mockProducts[4]!,
    discountPercentage: 17,
    totalStock: 20,
    soldCount: 15,
    endTime: "2026-07-22T23:59:59",
  },
  {
    id: "fd-4",
    productId: "prod-7",
    product: mockProducts[6]!,
    discountPercentage: 20,
    totalStock: 40,
    soldCount: 29,
    endTime: "2026-07-22T23:59:59",
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "t-1",
    userName: "Alexander Wright",
    userRole: "Software Engineer & Creator",
    avatar: "👨‍💻",
    rating: 5,
    comment: "The KeyCraft keyboard from Apex Electronics on CBS Marketplace arrived within 2 days! Incredible quality and seamless checkout experience.",
    verifiedPurchase: true,
    productName: "KeyCraft Custom Mechanical Keyboard",
  },
  {
    id: "t-2",
    userName: "Elena Rostova",
    userRole: "Interior Designer",
    avatar: "👩‍🎨",
    rating: 5,
    comment: "Nordic Atelier's products on this marketplace are top tier. Loved buying directly from verified independent vendors with buyer protection.",
    verifiedPurchase: true,
    productName: "CoreErgo 3D Mesh Lumbar Desk Chair",
  },
  {
    id: "t-3",
    userName: "Marcus Chen",
    userRole: "Audio Enthusiast",
    avatar: "🎧",
    rating: 5,
    comment: "Best pricing on AeroSound Pro. The flash deal countdown saved me over $60. Highly recommend CBS Marketplace!",
    verifiedPurchase: true,
    productName: "AeroSound Pro Headphones",
  },
];
