import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import dotenv from 'dotenv';
import path from 'path';
import argon2 from 'argon2';

// Load .env from workspace root
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedCategory {
  name: string;
  slug: string;
  excerpt: string;
  image: string;
  storageKey: string;
  altText: string;
  isActive?: boolean;
  children?: SeedCategory[];
}

const categoriesData: SeedCategory[] = [
  {
    name: 'Electronics',
    slug: 'electronics',
    excerpt: 'Explore top gadgets, smartphones, laptops, audio equipment, and photography tools.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    storageKey: 'categories/electronics.jpg',
    altText: 'Electronics catalog image',
    isActive: true,
    children: [
      {
        name: 'Smartphones & Accessories',
        slug: 'smartphones-accessories',
        excerpt: 'Latest smartphones, protective cases, screen guards, and high-speed chargers.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        storageKey: 'categories/smartphones-accessories.jpg',
        altText: 'Smartphones and mobile accessories',
        isActive: true,
        children: [
          {
            name: 'Mobile Phone Cases & Covers',
            slug: 'mobile-phone-cases-covers',
            excerpt: 'Durable silicone, leather, and rugged protective mobile cases.',
            image: 'https://images.unsplash.com/photo-1541877944-ac82a091518a?w=800',
            storageKey: 'categories/mobile-cases.jpg',
            altText: 'Mobile phone cases',
            isActive: true,
          },
          {
            name: 'Screen Protectors',
            slug: 'screen-protectors',
            excerpt: 'Tempered glass and anti-glare screen protectors for smartphones.',
            image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
            storageKey: 'categories/screen-protectors.jpg',
            altText: 'Screen protectors',
            isActive: true,
          },
          {
            name: 'Power Banks & Chargers',
            slug: 'power-banks-chargers',
            excerpt: 'Fast charging power banks, wireless pads, and Type-C adapters.',
            image: 'https://images.unsplash.com/photo-1609592424074-123497d3910c?w=800',
            storageKey: 'categories/power-banks.jpg',
            altText: 'Power banks and chargers',
            isActive: true,
          },
        ],
      },
      {
        name: 'Laptops & Computers',
        slug: 'laptops-computers',
        excerpt: 'High-performance ultrabooks, gaming laptops, desktops, and PC components.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        storageKey: 'categories/laptops-computers.jpg',
        altText: 'Laptops and personal computers',
        isActive: true,
        children: [
          {
            name: 'Gaming Laptops',
            slug: 'gaming-laptops',
            excerpt: 'High refresh rate displays with dedicated graphics processing units.',
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
            storageKey: 'categories/gaming-laptops.jpg',
            altText: 'Gaming laptops',
            isActive: true,
          },
          {
            name: 'Computer Peripherals',
            slug: 'computer-peripherals',
            excerpt: 'Mechanical keyboards, ergonomic mice, webcams, and USB docks.',
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
            storageKey: 'categories/computer-peripherals.jpg',
            altText: 'Computer peripherals',
            isActive: true,
          },
        ],
      },
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        excerpt: 'Active noise cancelling headphones, wireless earbuds, and Bluetooth speakers.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        storageKey: 'categories/audio-headphones.jpg',
        altText: 'Audio and headphones',
        isActive: true,
      },
      {
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        excerpt: 'DSLR, mirrorless cameras, lenses, tripods, and studio lighting.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        storageKey: 'categories/cameras-photography.jpg',
        altText: 'Cameras and photography equipment',
        isActive: true,
      },
      {
        name: 'Wearables & Smartwatches',
        slug: 'wearables-smartwatches',
        excerpt: 'Fitness trackers, AMOLED smartwatches, and health tracking bands.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        storageKey: 'categories/wearables.jpg',
        altText: 'Wearable tech and smartwatches',
        isActive: true,
      },
    ],
  },
  {
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    excerpt: 'Trendy clothing, footwear, accessories, and jewelry for all seasons.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    storageKey: 'categories/fashion-apparel.jpg',
    altText: 'Fashion catalog cover',
    isActive: true,
    children: [
      {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        excerpt: "Men's shirts, t-shirts, jeans, trousers, suits, and ethnic wear.",
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
        storageKey: 'categories/mens-clothing.jpg',
        altText: "Men's clothing collection",
        isActive: true,
        children: [
          {
            name: "Men's T-Shirts & Polos",
            slug: 'mens-tshirts-polos',
            excerpt: 'Casual cotton t-shirts, oversized tees, and collared polo shirts.',
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
            storageKey: 'categories/mens-tshirts.jpg',
            altText: "Men's t-shirts",
            isActive: true,
          },
          {
            name: "Men's Formal Shirts",
            slug: 'mens-formal-shirts',
            excerpt: 'Crisp button-up formal shirts for office and executive events.',
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
            storageKey: 'categories/mens-formal-shirts.jpg',
            altText: "Men's formal shirts",
            isActive: true,
          },
          {
            name: "Men's Jeans & Trousers",
            slug: 'mens-jeans-trousers',
            excerpt: 'Slim fit denim jeans, chinos, and tailored formal trousers.',
            image: 'https://images.unsplash.com/photo-1542272604-780c36856842?w=800',
            storageKey: 'categories/mens-jeans.jpg',
            altText: "Men's jeans",
            isActive: true,
          },
        ],
      },
      {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        excerpt: 'Dresses, ethnic kurtis, sarees, tops, skirts, and western wear.',
        image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800',
        storageKey: 'categories/womens-clothing.jpg',
        altText: "Women's fashion collection",
        isActive: true,
        children: [
          {
            name: "Women's Dresses",
            slug: 'womens-dresses',
            excerpt: 'Summer dresses, cocktail gowns, and casual maxi dresses.',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
            storageKey: 'categories/womens-dresses.jpg',
            altText: "Women's dresses",
            isActive: true,
          },
          {
            name: "Women's Tops & Tees",
            slug: 'womens-tops-tees',
            excerpt: 'Stylish crop tops, floral blouses, and casual daily tees.',
            image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
            storageKey: 'categories/womens-tops.jpg',
            altText: "Women's tops",
            isActive: true,
          },
        ],
      },
      {
        name: 'Footwear',
        slug: 'footwear',
        excerpt: 'Sneakers, formal leather shoes, sandals, boots, and heels.',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
        storageKey: 'categories/footwear.jpg',
        altText: 'Footwear selection',
        isActive: true,
      },
      {
        name: 'Watches & Accessories',
        slug: 'fashion-watches-accessories',
        excerpt: 'Analog watches, leather belts, wallets, and sunglasses.',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
        storageKey: 'categories/watches-accessories.jpg',
        altText: 'Watches and accessories',
        isActive: true,
      },
      {
        name: 'Jewelry & Ornaments',
        slug: 'jewelry-ornaments',
        excerpt: 'Necklaces, earrings, bracelets, and fashion jewelry.',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
        storageKey: 'categories/jewelry.jpg',
        altText: 'Jewelry items',
        isActive: true,
      },
    ],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    excerpt: 'Furniture, kitchen appliances, home decor, cookware, and bedding essentials.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
    storageKey: 'categories/home-kitchen.jpg',
    altText: 'Home and kitchen essentials',
    isActive: true,
    children: [
      {
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        excerpt: 'Air fryers, microwave ovens, blenders, and coffee makers.',
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        storageKey: 'categories/kitchen-appliances.jpg',
        altText: 'Kitchen appliances',
        isActive: true,
        children: [
          {
            name: 'Air Fryers & Ovens',
            slug: 'air-fryers-ovens',
            excerpt: 'Digital air fryers and convection toaster ovens for healthy cooking.',
            image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
            storageKey: 'categories/air-fryers.jpg',
            altText: 'Air fryers',
            isActive: true,
          },
          {
            name: 'Coffee Makers & Espresso',
            slug: 'coffee-makers-espresso',
            excerpt: 'Drip coffee machines, French presses, and espresso makers.',
            image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
            storageKey: 'categories/coffee-makers.jpg',
            altText: 'Coffee makers',
            isActive: true,
          },
          {
            name: 'Blenders & Juicers',
            slug: 'blenders-juicers',
            excerpt: 'High-speed bullet blenders, food processors, and cold press juicers.',
            image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800',
            storageKey: 'categories/blenders.jpg',
            altText: 'Blenders and juicers',
            isActive: true,
          },
        ],
      },
      {
        name: 'Home Decor & Lighting',
        slug: 'home-decor-lighting',
        excerpt: 'Wall art, ambient lamps, indoor planters, and decorative rugs.',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
        storageKey: 'categories/home-decor.jpg',
        altText: 'Home decor',
        isActive: true,
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        excerpt: 'Sofas, dining tables, ergonomic office chairs, and bed frames.',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        storageKey: 'categories/furniture.jpg',
        altText: 'Furniture pieces',
        isActive: true,
      },
      {
        name: 'Bedding & Bath',
        slug: 'bedding-bath',
        excerpt: 'Cotton bedsheets, pillows, duvets, and bath towels.',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
        storageKey: 'categories/bedding-bath.jpg',
        altText: 'Bedding and towels',
        isActive: true,
      },
      {
        name: 'Cookware & Dining',
        slug: 'cookware-dining',
        excerpt: 'Non-stick pans, stainless steel pots, and ceramic dinnerware.',
        image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800',
        storageKey: 'categories/cookware.jpg',
        altText: 'Cookware set',
        isActive: true,
      },
    ],
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    excerpt: 'Skincare products, haircare, cosmetics, fragrances, and grooming kits.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    storageKey: 'categories/beauty-personal-care.jpg',
    altText: 'Beauty and skincare products',
    isActive: true,
    children: [
      {
        name: 'Skincare',
        slug: 'skincare',
        excerpt: 'Moisturizers, serums, sunscreens, and face washes.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
        storageKey: 'categories/skincare.jpg',
        altText: 'Skincare line',
        isActive: true,
        children: [
          {
            name: 'Sunscreens & Lotions',
            slug: 'sunscreens-lotions',
            excerpt: 'SPF 50+ broad spectrum sunscreens and hydrating body lotions.',
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800',
            storageKey: 'categories/sunscreens.jpg',
            altText: 'Sunscreen products',
            isActive: true,
          },
          {
            name: 'Facial Cleansers & Serums',
            slug: 'facial-cleansers-serums',
            excerpt: 'Vitamin C serums, salicylic acid washes, and hyaluronic face drops.',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
            storageKey: 'categories/face-serums.jpg',
            altText: 'Facial serums',
            isActive: true,
          },
        ],
      },
      {
        name: 'Haircare',
        slug: 'haircare',
        excerpt: 'Nourishing shampoos, conditioners, hair oils, and styling gels.',
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800',
        storageKey: 'categories/haircare.jpg',
        altText: 'Haircare bottles',
        isActive: true,
      },
      {
        name: 'Makeup',
        slug: 'makeup',
        excerpt: 'Foundations, lipsticks, mascaras, eyeshadow palettes, and blushers.',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
        storageKey: 'categories/makeup.jpg',
        altText: 'Makeup cosmetic set',
        isActive: true,
      },
      {
        name: 'Fragrances & Perfumes',
        slug: 'fragrances-perfumes',
        excerpt: 'Eau de Parfum, body mists, and luxury unisex perfumes.',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
        storageKey: 'categories/fragrances.jpg',
        altText: 'Perfume bottles',
        isActive: true,
      },
    ],
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    excerpt: 'Fitness machinery, yoga mats, outdoor gear, and activewear.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    storageKey: 'categories/sports-fitness.jpg',
    altText: 'Fitness equipment and gym gear',
    isActive: true,
    children: [
      {
        name: 'Exercise & Fitness Equipment',
        slug: 'fitness-equipment',
        excerpt: 'Dumbbells, resistance bands, treadmills, and exercise bikes.',
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800',
        storageKey: 'categories/fitness-equipment.jpg',
        altText: 'Exercise equipment',
        isActive: true,
      },
      {
        name: 'Outdoor & Camping',
        slug: 'outdoor-camping',
        excerpt: 'Tents, sleeping bags, hiking backpacks, and camping lanterns.',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        storageKey: 'categories/outdoor-camping.jpg',
        altText: 'Camping equipment',
        isActive: true,
      },
      {
        name: 'Athletic Wear',
        slug: 'athletic-wear',
        excerpt: 'Breathable sports jerseys, track pants, and compression shorts.',
        image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800',
        storageKey: 'categories/athletic-wear.jpg',
        altText: 'Athletic sportswear',
        isActive: true,
      },
      {
        name: 'Team Sports Equipment',
        slug: 'team-sports',
        excerpt: 'Cricket bats, footballs, basketballs, and badminton rackets.',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        storageKey: 'categories/team-sports.jpg',
        altText: 'Sports balls and bats',
        isActive: true,
      },
    ],
  },
  {
    name: 'Books & Stationery',
    slug: 'books-stationery',
    excerpt: 'Best-selling novels, academic textbooks, notebooks, and fine writing pens.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    storageKey: 'categories/books-stationery.jpg',
    altText: 'Books shelf',
    isActive: true,
    children: [
      {
        name: 'Fiction Books',
        slug: 'fiction-books',
        excerpt: 'Sci-fi, thrillers, romance, mystery, and fantasy novels.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
        storageKey: 'categories/fiction-books.jpg',
        altText: 'Fiction books',
        isActive: true,
      },
      {
        name: 'Non-Fiction & Self Help',
        slug: 'non-fiction-self-help',
        excerpt: 'Biographies, business growth, psychology, and personal development.',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
        storageKey: 'categories/non-fiction.jpg',
        altText: 'Non-fiction books',
        isActive: true,
      },
      {
        name: 'Office & School Supplies',
        slug: 'office-school-supplies',
        excerpt: 'Journals, planners, gel pens, highlighters, and desk organizers.',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800',
        storageKey: 'categories/stationery-supplies.jpg',
        altText: 'Office stationery supplies',
        isActive: true,
      },
    ],
  },
  {
    name: 'Automotive & Accessories',
    slug: 'automotive-accessories',
    excerpt: 'Car care essentials, riding jackets, helmets, and vehicle electronics.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
    storageKey: 'categories/automotive.jpg',
    altText: 'Automotive accessories',
    isActive: true,
    children: [
      {
        name: 'Car Accessories',
        slug: 'car-accessories',
        excerpt: 'Car seat covers, floor mats, dash cams, and tire inflators.',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
        storageKey: 'categories/car-accessories.jpg',
        altText: 'Car interior accessories',
        isActive: true,
      },
      {
        name: 'Motorbike Gear & Helmets',
        slug: 'motorbike-gear-helmets',
        excerpt: 'Full-face helmets, riding gloves, and knee guards.',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
        storageKey: 'categories/motorbike-gear.jpg',
        altText: 'Riding helmet and gear',
        isActive: true,
      },
    ],
  },
  {
    name: 'Toys, Games & Baby',
    slug: 'toys-games-baby',
    excerpt: 'Interactive toys, board games, action figures, and baby care essentials.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
    storageKey: 'categories/toys-games-baby.jpg',
    altText: 'Toys and board games',
    isActive: true,
    children: [
      {
        name: 'Toys & Board Games',
        slug: 'toys-board-games',
        excerpt: 'Building blocks, puzzle sets, strategy board games, and remote control cars.',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        storageKey: 'categories/board-games.jpg',
        altText: 'Board games',
        isActive: true,
      },
      {
        name: 'Baby Care & Diapering',
        slug: 'baby-care-diapering',
        excerpt: 'Soft skin baby wipes, diapers, feeding bottles, and baby lotions.',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800',
        storageKey: 'categories/baby-care.jpg',
        altText: 'Baby care products',
        isActive: true,
      },
      {
        name: 'Archived Seasonal Category (Inactive)',
        slug: 'archived-seasonal-category',
        excerpt: 'Sample inactive category for testing active status filters.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        storageKey: 'categories/archived-seasonal.jpg',
        altText: 'Archived category',
        isActive: false,
      },
    ],
  },
];

async function seedCategoriesRecursively(
  categories: SeedCategory[],
  parentId: string | null = null
): Promise<number> {
  let count = 0;

  for (const catData of categories) {
    const created = await prisma.category.create({
      data: {
        name: catData.name,
        slug: catData.slug,
        excerpt: catData.excerpt,
        image: catData.image,
        storageKey: catData.storageKey,
        altText: catData.altText,
        isActive: catData.isActive ?? true,
        parentId,
      },
    });
    count++;

    if (catData.children && catData.children.length > 0) {
      const childCount = await seedCategoriesRecursively(catData.children, created.id);
      count += childCount;
    }
  }

  return count;
}

async function main() {
  console.log('Resetting database and seeding users & categories...');

  // 1. Clean existing records in foreign key dependency order
  await prisma.session.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.credential.deleteMany({});
  await prisma.sellerDocument.deleteMany({});
  await prisma.sellerVerification.deleteMany({});
  await prisma.bankAccount.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.seller.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.user.deleteMany({});

  // Reset category hierarchy before deletion to prevent restrict constraint errors
  await prisma.category.updateMany({ data: { parentId: null } });
  await prisma.category.deleteMany({});

  // 2. Hash default passwords
  const adminPasswordHash = await argon2.hash('AdminPassword123!');
  const sellerPasswordHash = await argon2.hash('SellerPassword123!');

  // 3. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@cbsmarketplace.com',
      status: 'ACTIVE',
      emailVerified: true,
      roles: ['ADMIN', 'SELLER', 'CUSTOMER'],
      credential: {
        create: {
          provider: 'CREDENTIALS',
          passwordHash: adminPasswordHash,
        },
      },
    },
  });
  console.log(`✅ Created Admin User: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`);

  // 4. Create Seller User
  const sellerUser = await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'Seller',
      email: 'seller@cbsmarketplace.com',
      status: 'ACTIVE',
      emailVerified: true,
      roles: ['SELLER', 'CUSTOMER'],
      credential: {
        create: {
          provider: 'CREDENTIALS',
          passwordHash: sellerPasswordHash,
        },
      },
      seller: {
        create: {
          businessName: "Test Seller Store",
          businessType: "SOLE_PROPRIETORSHIP",
          status: "APPROVED",
          gstin: "27AAAAA0000A1Z5",
          contactEmail: "seller@cbsmarketplace.com",
          contactPhone: "9876543210",
        },
      },
    },
  });
  console.log(`✅ Created Seller User: ${sellerUser.firstName} ${sellerUser.lastName} (${sellerUser.email})`);

  // 5. Seed Categories
  console.log('\nSeeding categories hierarchy...');
  const totalCategories = await seedCategoriesRecursively(categoriesData);
  console.log(`✅ Successfully seeded ${totalCategories} categories across multiple hierarchical levels.`);

  console.log('\n===========================================');
  console.log('🎉 Database reset & seeded successfully!');
  console.log('===========================================');
  console.log('🔑 Admin Credentials:');
  console.log('   Email:    admin@cbsmarketplace.com');
  console.log('   Password: AdminPassword123!');
  console.log('-------------------------------------------');
  console.log('🔑 Seller Credentials:');
  console.log('   Email:    seller@cbsmarketplace.com');
  console.log('   Password: SellerPassword123!');
  console.log('===========================================\n');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
