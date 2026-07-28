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

async function main() {
  console.log('Resetting database and seeding users...');

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
