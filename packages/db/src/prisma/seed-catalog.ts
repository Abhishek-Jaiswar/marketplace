import { pathToFileURL } from "node:url"

import argon2 from "argon2"

import { and } from "@prisma/orm-postgres/orm-client"

import { db } from "./db.js"

/**
 * Demo sellers, products, offers and stock. Only ever adds rows and skips what
 * already exists, so it is safe to run against a database with real accounts.
 * Prices below are in rupees and stored as paise.
 */

const DEMO_PASSWORD = "SellerPassword123!"
const rupees = (amount: number) => amount * 100
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80`

interface DemoSeller {
  key: string
  email: string
  firstName: string
  businessName: string
  displayName: string
  storeSlug: string
  gstin: string
  description: string
  city: string
  state: string
  postalCode: string
  stateCode: string
}

const sellers: DemoSeller[] = [
  {
    key: "apex",
    email: "apex@demo.cbsmarketplace.com",
    firstName: "Rohan",
    businessName: "Apex Tech Gear Private Limited",
    displayName: "Apex Tech Gear",
    storeSlug: "apex-tech-gear",
    gstin: "27AABCA1234B1Z5",
    description:
      "Audio, wearables and desk gear, tested in our Pune workshop before dispatch.",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    stateCode: "27",
  },
  {
    key: "loom",
    email: "loom@demo.cbsmarketplace.com",
    firstName: "Meera",
    businessName: "Loom and Thread LLP",
    displayName: "Loom and Thread",
    storeSlug: "loom-and-thread",
    gstin: "08AACFL2345C1Z6",
    description:
      "Everyday clothing, footwear and bags from small workshops around Jaipur.",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302001",
    stateCode: "08",
  },
  {
    key: "ghar",
    email: "ghar@demo.cbsmarketplace.com",
    firstName: "Arjun",
    businessName: "Ghar Goods Private Limited",
    displayName: "Ghar Goods",
    storeSlug: "ghar-goods",
    gstin: "29AABCG3456D1Z7",
    description:
      "Kitchenware, lighting and furniture for Indian homes, shipped from Bengaluru.",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    stateCode: "29",
  },
  {
    key: "khel",
    email: "khel@demo.cbsmarketplace.com",
    firstName: "Isha",
    businessName: "Khel Corner",
    displayName: "Khel Corner",
    storeSlug: "khel-corner",
    gstin: "07AAJFK4567E1Z8",
    description:
      "Fitness kit, stationery and toys for the whole family, from Delhi.",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    stateCode: "07",
  },
]

interface DemoProduct {
  slug: string
  title: string
  brand: string
  category: string
  image: string
  seller: string
  mrp: number
  price: number
  stock: number
  description: string
  highlights: string[]
  hsnCode: string
  gstRateBps: number
  specifications?: Record<string, string>
  handlingTimeDays?: number
  variants?: { key: string; attributes: Record<string, string> }[]
  alsoSoldBy?: { seller: string; price: number; stock: number }
}

const products: DemoProduct[] = [
  {
    slug: "aurel-over-ear-wireless-headphones",
    title: "Aurel over-ear wireless headphones with 40 hour battery",
    brand: "Aurel",
    category: "audio-headphones",
    image: photo("1505740420928-5e560c06d30e"),
    seller: "apex",
    mrp: 15999,
    price: 12499,
    stock: 42,
    description:
      "Active noise cancelling headphones with soft memory-foam cups, a folding frame and a battery that lasts a working week.",
    highlights: [
      "40 hours of playback on one charge",
      "Active noise cancelling with three levels",
      "Connects to two devices at once",
    ],
    hsnCode: "85183000",
    gstRateBps: 1800,
    specifications: { Connectivity: "Bluetooth 5.3", Weight: "265 g" },
    variants: [
      { key: "black", attributes: { Colour: "Black" } },
      { key: "silver", attributes: { Colour: "Silver" } },
    ],
    alsoSoldBy: { seller: "khel", price: 12999, stock: 6 },
  },
  {
    slug: "aurel-studio-wired-headphones",
    title: "Aurel studio wired headphones",
    brand: "Aurel",
    category: "audio-headphones",
    image: photo("1583394838336-acd977736f90"),
    seller: "apex",
    mrp: 4999,
    price: 3299,
    stock: 18,
    description:
      "Closed-back wired headphones tuned flat for mixing, podcasts and long listening sessions.",
    highlights: [
      "50 mm drivers",
      "3 m detachable cable",
      "Folds flat for travel",
    ],
    hsnCode: "85183000",
    gstRateBps: 1800,
  },
  {
    slug: "tarang-true-wireless-earbuds",
    title: "Tarang true wireless earbuds with charging case",
    brand: "Tarang",
    category: "audio-headphones",
    image: photo("1590658268037-6bf12165a8df"),
    seller: "apex",
    mrp: 3999,
    price: 1899,
    stock: 120,
    description:
      "Light earbuds with a pocket charging case, clear calls and sweat resistance for daily commutes.",
    highlights: [
      "28 hours with the case",
      "IPX4 sweat resistance",
      "Touch controls",
    ],
    hsnCode: "85176290",
    gstRateBps: 1800,
  },
  {
    slug: "samay-round-dial-smartwatch",
    title: "Samay round dial smartwatch",
    brand: "Samay",
    category: "wearables-smartwatches",
    image: photo("1523275335684-37898b6baf30"),
    seller: "apex",
    mrp: 7999,
    price: 4599,
    stock: 64,
    description:
      "A slim metal smartwatch that tracks steps, sleep and heart rate, with a week of battery life.",
    highlights: [
      "Seven day battery",
      "Heart rate and sleep tracking",
      "5 ATM water resistance",
    ],
    hsnCode: "85176290",
    gstRateBps: 1800,
    variants: [
      { key: "white", attributes: { Strap: "White" } },
      { key: "graphite", attributes: { Strap: "Graphite" } },
    ],
  },
  {
    slug: "kosh-14-inch-thin-laptop",
    title: "Kosh 14 inch thin and light laptop, 16 GB, 512 GB SSD",
    brand: "Kosh",
    category: "laptops-computers",
    image: photo("1496181133206-80ce9b88a853"),
    seller: "apex",
    mrp: 74990,
    price: 58990,
    stock: 9,
    description:
      "A 1.3 kg aluminium laptop with a sharp 14 inch display, made for work and study on the move.",
    highlights: [
      "16 GB memory, 512 GB SSD",
      "Weighs 1.3 kg",
      "Up to 12 hours of battery",
    ],
    hsnCode: "84713010",
    gstRateBps: 1800,
    handlingTimeDays: 2,
  },
  {
    slug: "kosh-low-profile-wireless-keyboard",
    title: "Kosh low-profile wireless keyboard",
    brand: "Kosh",
    category: "computer-peripherals",
    image: photo("1587829741301-dc798b83add3"),
    seller: "apex",
    mrp: 3499,
    price: 2199,
    stock: 3,
    description:
      "A quiet full-size keyboard that pairs with three devices and runs for months on one charge.",
    highlights: [
      "Pairs with three devices",
      "Rechargeable over USB-C",
      "Quiet scissor switches",
    ],
    hsnCode: "84716060",
    gstRateBps: 1800,
  },
  {
    slug: "yatra-everyday-laptop-backpack",
    title: "Yatra everyday laptop backpack, 22 litres",
    brand: "Yatra",
    category: "fashion-watches-accessories",
    image: photo("1553062407-98eeb64c6a62"),
    seller: "loom",
    mrp: 2999,
    price: 1649,
    stock: 75,
    description:
      "A water-repellent backpack with a padded laptop sleeve and a hidden pocket for valuables.",
    highlights: [
      "Fits a 15.6 inch laptop",
      "Water-repellent fabric",
      "Luggage strap for trolleys",
    ],
    hsnCode: "42029210",
    gstRateBps: 1800,
  },
  {
    slug: "saral-organic-cotton-crew-tshirt",
    title: "Saral organic cotton crew neck T-shirt",
    brand: "Saral",
    category: "mens-tshirts-polos",
    image: photo("1521572163474-6864f9cf17ab"),
    seller: "loom",
    mrp: 999,
    price: 549,
    stock: 200,
    description:
      "A heavyweight organic cotton T-shirt that keeps its shape after repeated washing.",
    highlights: ["100% organic cotton", "180 GSM fabric", "Pre-shrunk"],
    hsnCode: "61091000",
    gstRateBps: 500,
    variants: [
      { key: "m", attributes: { Size: "M" } },
      { key: "l", attributes: { Size: "L" } },
      { key: "xl", attributes: { Size: "XL" } },
    ],
  },
  {
    slug: "gulmohar-flared-maxi-dress",
    title: "Gulmohar flared maxi dress",
    brand: "Gulmohar",
    category: "womens-dresses",
    image: photo("1595777457583-95e059d581b8"),
    seller: "loom",
    mrp: 3499,
    price: 2299,
    stock: 28,
    description:
      "A floor-length dress in soft georgette with a fitted waist and a full, flowing skirt.",
    highlights: [
      "Soft georgette",
      "Fitted waist with side zip",
      "Dry clean recommended",
    ],
    hsnCode: "62044300",
    gstRateBps: 1200,
  },
  {
    slug: "rangrez-top-handle-leather-bag",
    title: "Rangrez top handle leather bag",
    brand: "Rangrez",
    category: "fashion-watches-accessories",
    image: photo("1584917865442-de89df76afd3"),
    seller: "loom",
    mrp: 6999,
    price: 4499,
    stock: 11,
    description:
      "A structured leather bag with a metal clasp, a detachable strap and room for daily essentials.",
    highlights: [
      "Full-grain leather",
      "Detachable shoulder strap",
      "Three inner pockets",
    ],
    hsnCode: "42022110",
    gstRateBps: 1800,
  },
  {
    slug: "mochi-handmade-brogue-shoes",
    title: "Mochi handmade brogue shoes",
    brand: "Mochi Works",
    category: "footwear",
    image: photo("1560343090-f0409e92791a"),
    seller: "loom",
    mrp: 5499,
    price: 3799,
    stock: 22,
    description:
      "Hand-finished suede brogues with a stitched leather sole, made in small batches in Agra.",
    highlights: [
      "Suede upper",
      "Stitched leather sole",
      "Made in small batches",
    ],
    hsnCode: "64035190",
    gstRateBps: 1800,
    variants: [
      { key: "uk8", attributes: { Size: "UK 8" } },
      { key: "uk9", attributes: { Size: "UK 9" } },
    ],
  },
  {
    slug: "mochi-leather-lace-up-boots",
    title: "Mochi leather lace-up boots",
    brand: "Mochi Works",
    category: "footwear",
    image: photo("1608256246200-53e635b5b65f"),
    seller: "loom",
    mrp: 7499,
    price: 5299,
    stock: 0,
    description:
      "Oiled leather boots with a cushioned insole and a rubber sole built for monsoon streets.",
    highlights: [
      "Oiled full-grain leather",
      "Cushioned insole",
      "Grippy rubber sole",
    ],
    hsnCode: "64035190",
    gstRateBps: 1800,
  },
  {
    slug: "neem-tree-daily-body-lotion",
    title: "Neem Tree daily body lotion, 200 ml",
    brand: "Neem Tree",
    category: "skincare",
    image: photo("1620916566398-39f1143ab7be"),
    seller: "ghar",
    mrp: 599,
    price: 449,
    stock: 150,
    description:
      "A light, fast-absorbing lotion with aloe and shea butter for dry skin in every season.",
    highlights: [
      "Aloe and shea butter",
      "No added fragrance",
      "Dermatologically tested",
    ],
    hsnCode: "33049910",
    gstRateBps: 1800,
  },
  {
    slug: "mitti-ceramic-coffee-mug",
    title: "Mitti ceramic coffee mug, 350 ml",
    brand: "Mitti",
    category: "cookware-dining",
    image: photo("1514228742587-6b1558fcca3d"),
    seller: "ghar",
    mrp: 699,
    price: 399,
    stock: 90,
    description:
      "A hand-glazed stoneware mug with a wide handle, safe for the microwave and dishwasher.",
    highlights: [
      "Hand-glazed stoneware",
      "Microwave and dishwasher safe",
      "350 ml",
    ],
    hsnCode: "69120040",
    gstRateBps: 1200,
  },
  {
    slug: "roshni-adjustable-desk-lamp",
    title: "Roshni adjustable desk lamp",
    brand: "Roshni",
    category: "home-decor-lighting",
    image: photo("1507473885765-e6ed057f782c"),
    seller: "ghar",
    mrp: 2799,
    price: 1799,
    stock: 34,
    description:
      "A metal task lamp with a jointed arm and a warm LED that is easy on the eyes at night.",
    highlights: ["Jointed metal arm", "Warm LED, 3000 K", "Weighted base"],
    hsnCode: "94052010",
    gstRateBps: 1800,
  },
  {
    slug: "sheesham-solid-wood-dining-chair",
    title: "Sheesham solid wood dining chair",
    brand: "Sheesham House",
    category: "furniture",
    image: photo("1506439773649-6e0eb8cfb237"),
    seller: "ghar",
    mrp: 8999,
    price: 6499,
    stock: 14,
    description:
      "A sturdy solid-wood chair with a natural oil finish, assembled and checked by hand.",
    highlights: [
      "Solid sheesham wood",
      "Natural oil finish",
      "Holds up to 120 kg",
    ],
    hsnCode: "94016100",
    gstRateBps: 1800,
    handlingTimeDays: 4,
  },
  {
    slug: "jal-insulated-steel-bottle",
    title: "Jal insulated steel bottle, 750 ml",
    brand: "Jal",
    category: "outdoor-camping",
    image: photo("1602143407151-7111542de6e8"),
    seller: "khel",
    mrp: 1299,
    price: 799,
    stock: 180,
    description:
      "A double-walled steel bottle that keeps water cold through a full day outdoors.",
    highlights: ["Cold for 24 hours", "Leak-proof lid", "Food-grade steel"],
    hsnCode: "73239390",
    gstRateBps: 1800,
    alsoSoldBy: { seller: "ghar", price: 849, stock: 40 },
  },
  {
    slug: "swaad-personal-blender",
    title: "Swaad personal blender with travel jar",
    brand: "Swaad",
    category: "blenders-juicers",
    image: photo("1585515320310-259814833e62"),
    seller: "ghar",
    mrp: 3999,
    price: 2499,
    stock: 26,
    description:
      "A compact blender for smoothies and chutneys, with a jar that doubles as a travel bottle.",
    highlights: ["400 W motor", "600 ml travel jar", "One-touch operation"],
    hsnCode: "85094010",
    gstRateBps: 1800,
  },
  {
    slug: "kaapi-drip-coffee-maker",
    title: "Kaapi drip coffee maker, 10 cups",
    brand: "Kaapi",
    category: "coffee-makers-espresso",
    image: photo("1570222094114-d054a817e56b"),
    seller: "ghar",
    mrp: 7499,
    price: 5499,
    stock: 8,
    description:
      "A programmable drip brewer with a glass carafe and a reusable filter for fresh filter coffee.",
    highlights: ["Brews 10 cups", "Programmable timer", "Reusable filter"],
    hsnCode: "85167100",
    gstRateBps: 1800,
  },
  {
    slug: "asana-non-slip-yoga-mat",
    title: "Asana non-slip yoga mat, 6 mm",
    brand: "Asana",
    category: "fitness-equipment",
    image: photo("1601925260368-ae2f83cf8b7f"),
    seller: "khel",
    mrp: 1999,
    price: 1099,
    stock: 95,
    description:
      "A cushioned 6 mm mat with a textured surface that grips well even during sweaty sessions.",
    highlights: [
      "6 mm cushioning",
      "Textured non-slip surface",
      "Carry strap included",
    ],
    hsnCode: "39181090",
    gstRateBps: 1800,
  },
  {
    slug: "bal-hex-rubber-dumbbells",
    title: "Bal hex rubber dumbbells, pair of 5 kg",
    brand: "Bal Fitness",
    category: "fitness-equipment",
    image: photo("1638536532686-d610adfc8e5c"),
    seller: "khel",
    mrp: 3499,
    price: 2399,
    stock: 37,
    description:
      "Rubber-coated hexagonal dumbbells that stay put on the floor and protect it from knocks.",
    highlights: ["Pair of 5 kg", "Rubber-coated heads", "Knurled steel handle"],
    hsnCode: "95069190",
    gstRateBps: 1800,
  },
  {
    slug: "lekh-spiral-notebook-set",
    title: "Lekh spiral notebook set of 3, A5",
    brand: "Lekh",
    category: "office-school-supplies",
    image: photo("1531346878377-a5be20888e57"),
    seller: "khel",
    mrp: 599,
    price: 349,
    stock: 240,
    description:
      "Three ruled notebooks on thick 100 GSM paper that does not let ink bleed through.",
    highlights: ["Three A5 notebooks", "100 GSM paper", "Ruled pages"],
    hsnCode: "48201010",
    gstRateBps: 1800,
  },
  {
    slug: "chaupar-strategy-board-game",
    title: "Chaupar strategy board game",
    brand: "Chaupar",
    category: "toys-board-games",
    image: photo("1610890716171-6b1bb98ffd09"),
    seller: "khel",
    mrp: 2499,
    price: 1599,
    stock: 48,
    description:
      "A map-based strategy game for two to six players, with a new layout on every play.",
    highlights: ["Two to six players", "60 minute games", "Ages 10 and up"],
    hsnCode: "95044000",
    gstRateBps: 1800,
  },
  {
    slug: "khilona-colour-building-bricks",
    title: "Khilona colour building bricks, 500 pieces",
    brand: "Khilona",
    category: "toys-board-games",
    image: photo("1587654780291-39c9404d746b"),
    seller: "khel",
    mrp: 1799,
    price: 1199,
    stock: 66,
    description:
      "A big box of interlocking bricks in bright colours for open-ended building at home.",
    highlights: ["500 pieces", "Non-toxic plastic", "Ages 4 and up"],
    hsnCode: "95030030",
    gstRateBps: 1200,
  },
  {
    slug: "khilona-wooden-train-set",
    title: "Khilona wooden train set",
    brand: "Khilona",
    category: "toys-board-games",
    image: photo("1596461404969-9ae70f2830c1"),
    seller: "khel",
    mrp: 3299,
    price: 2199,
    stock: 19,
    description:
      "A painted wooden railway with a station, signals and magnetic carriages for young children.",
    highlights: ["Magnetic carriages", "Water-based paints", "Ages 3 and up"],
    hsnCode: "95030030",
    gstRateBps: 1200,
  },
]

async function ensureSeller(demo: DemoSeller, passwordHash: string) {
  const existing = await db.orm.public.User.where({ email: demo.email }).first()
  if (existing) {
    const seller = await db.orm.public.Seller.where({
      ownerUserId: existing.id,
    }).first()
    const location = await db.orm.public.InventoryLocation.where({
      code: `${demo.key.toUpperCase()}-MAIN`,
    }).first()
    if (!seller || !location) {
      throw new Error(`Demo seller ${demo.email} is incomplete`)
    }
    return { userId: existing.id, sellerId: seller.id, locationId: location.id }
  }

  return await db.transaction(async (tx) => {
    const user = await tx.orm.public.User.create({
      firstName: demo.firstName,
      email: demo.email,
      status: "ACTIVE",
      emailVerified: true,
      roles: ["SELLER", "CUSTOMER"],
    })
    await tx.orm.public.Credential.create({
      userId: user.id,
      provider: "CREDENTIALS",
      passwordHash,
    })
    const seller = await tx.orm.public.Seller.create({
      ownerUserId: user.id,
      businessName: demo.businessName,
      businessType: "PRIVATE_LIMITED",
      status: "APPROVED",
      gstin: demo.gstin,
      contactEmail: demo.email,
      approvedAt: new Date().toISOString(),
    })
    const address = await tx.orm.public.Address.create({
      street1: `${demo.displayName} warehouse`,
      city: demo.city,
      state: demo.state,
      stateCode: demo.stateCode,
      postalCode: demo.postalCode,
      country: "India",
    })
    await tx.orm.public.Store.create({
      sellerId: seller.id,
      displayName: demo.displayName,
      slug: demo.storeSlug,
      description: demo.description,
      addressId: address.id,
    })
    const location = await tx.orm.public.InventoryLocation.create({
      sellerId: seller.id,
      name: `${demo.city} warehouse`,
      code: `${demo.key.toUpperCase()}-MAIN`,
      isPrimary: true,
    })
    return { userId: user.id, sellerId: seller.id, locationId: location.id }
  })
}

type SellerRefs = Awaited<ReturnType<typeof ensureSeller>>

async function ensureBrand(name: string) {
  const slug = name.toLowerCase().replaceAll(" ", "-")
  const existing = await db.orm.public.Brand.where({ slug }).first()
  return (
    existing ??
    (await db.orm.public.Brand.create({ name, slug, isVerified: true }))
  )
}

async function createOffer(
  variantId: string,
  sku: string,
  seller: SellerRefs,
  demo: { mrp: number; price: number; stock: number; handlingTimeDays: number }
) {
  const listing = await db.orm.public.SellerListing.create({
    sellerId: seller.sellerId,
    variantId,
    sellerSku: `${sku}-${seller.sellerId.slice(-4).toUpperCase()}`,
    mrpPrice: rupees(demo.mrp),
    sellingPrice: rupees(demo.price),
    handlingTimeDays: demo.handlingTimeDays,
  })
  const item = await db.orm.public.InventoryItem.create({
    sellerListingId: listing.id,
    locationId: seller.locationId,
    onHand: demo.stock,
    lowStockThreshold: 5,
  })
  if (demo.stock > 0) {
    await db.orm.public.InventoryLedger.create({
      inventoryItemId: item.id,
      quantityDelta: demo.stock,
      balanceAfter: demo.stock,
      reason: "RESTOCK",
      note: "Opening stock",
      performedById: seller.userId,
    })
  }
}

async function createProduct(
  demo: DemoProduct,
  sellersByKey: Map<string, SellerRefs>
) {
  const category = await db.orm.public.Category.where({
    slug: demo.category,
  }).first()
  if (!category) throw new Error(`Unknown category ${demo.category}`)

  const brand = await ensureBrand(demo.brand)
  const product = await db.orm.public.Product.create({
    title: demo.title,
    slug: demo.slug,
    description: demo.description,
    highlights: demo.highlights,
    specifications: demo.specifications ?? null,
    categoryId: category.id,
    brandId: brand.id,
    status: "APPROVED",
    approvedAt: new Date().toISOString(),
    hsnCode: demo.hsnCode,
    gstRateBps: demo.gstRateBps,
    countryOfOrigin: "India",
    manufacturerInfo: `${demo.brand}, India`,
  })

  const media = await db.orm.public.Media.create({
    fileName: `${demo.slug}.jpg`,
    originalName: `${demo.slug}.jpg`,
    mimeType: "image/jpeg",
    size: 0,
    mediaType: "IMAGE",
    provider: "LOCAL",
    storageKey: `seed/${demo.slug}.jpg`,
    url: demo.image,
  })
  await db.orm.public.ProductMedia.create({
    productId: product.id,
    mediaId: media.id,
    isPrimary: true,
  })

  const seller = sellersByKey.get(demo.seller)
  if (!seller) throw new Error(`Unknown seller ${demo.seller}`)
  const handlingTimeDays = demo.handlingTimeDays ?? 1

  for (const variant of demo.variants ?? [
    { key: "std", attributes: {} as Record<string, string> },
  ]) {
    const sku = `${demo.slug.slice(0, 40)}-${variant.key}`.toUpperCase()
    const created = await db.orm.public.ProductVariant.create({
      productId: product.id,
      sku,
      attributes: variant.attributes,
    })

    await createOffer(created.id, sku, seller, {
      mrp: demo.mrp,
      price: demo.price,
      stock: demo.stock,
      handlingTimeDays,
    })

    if (demo.alsoSoldBy) {
      const other = sellersByKey.get(demo.alsoSoldBy.seller)
      if (!other) throw new Error(`Unknown seller ${demo.alsoSoldBy.seller}`)
      await createOffer(created.id, sku, other, {
        mrp: demo.mrp,
        price: demo.alsoSoldBy.price,
        stock: demo.alsoSoldBy.stock,
        handlingTimeDays,
      })
    }
  }
}

export async function seedCatalog(): Promise<void> {
  const passwordHash = await argon2.hash(DEMO_PASSWORD)
  const sellersByKey = new Map<string, SellerRefs>()
  for (const seller of sellers) {
    sellersByKey.set(seller.key, await ensureSeller(seller, passwordHash))
  }

  let created = 0
  for (const product of products) {
    const existing = await db.orm.public.Product.where({
      slug: product.slug,
    }).first()
    if (!existing) {
      await createProduct(product, sellersByKey)
      created += 1
    }
  }

  const platformRule = await db.orm.public.CommissionRule.where((rule) =>
    and(rule.sellerId.isNull(), rule.categoryId.isNull())
  ).first()
  if (!platformRule) {
    await db.orm.public.CommissionRule.create({ rateBps: 1000 })
  }

  await db.orm.public.Category.where({ slug: "toys-games-baby" }).update({
    image: photo("1596461404969-9ae70f2830c1"),
    altText: "Wooden toy train and station",
  })

  console.log(
    `Catalog ready: ${created} products added, ${products.length - created} already present.`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  seedCatalog()
    .catch((error) => {
      console.error("Catalog seeding failed:", error)
      process.exitCode = 1
    })
    .finally(async () => {
      await db.close()
    })
}
