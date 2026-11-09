import { randomUUID } from "node:crypto"

import { db } from "@workspace/db"

import { inventoryRepository } from "../modules/inventory/inventory.repository.js"

export async function createStockedListing(onHand: number) {
  const key = randomUUID()

  const user = await db.orm.public.User.create({
    firstName: "Test",
    email: `${key}@example.com`,
  })
  const seller = await db.orm.public.Seller.create({
    ownerUserId: user.id,
    businessName: `Seller ${key}`,
    businessType: "INDIVIDUAL",
  })
  const category = await db.orm.public.Category.create({
    slug: `category-${key}`,
    name: "Category",
    image: "image",
    storageKey: "key",
    altText: "alt",
  })
  const product = await db.orm.public.Product.create({
    title: "Product",
    slug: `product-${key}`,
    description: "Description",
    highlights: [],
    categoryId: category.id,
  })
  const variant = await db.orm.public.ProductVariant.create({
    productId: product.id,
    sku: `sku-${key}`,
    attributes: {},
  })
  const listing = await db.orm.public.SellerListing.create({
    sellerId: seller.id,
    variantId: variant.id,
    sellerSku: `seller-sku-${key}`,
    mrpPrice: 1000,
    sellingPrice: 900,
  })
  const location = await db.orm.public.InventoryLocation.create({
    sellerId: seller.id,
    name: "Warehouse",
    code: `LOC-${key}`,
  })

  const { item } = await inventoryRepository.executeStockAdjustment({
    sellerListingId: listing.id,
    locationId: location.id,
    quantityDelta: onHand,
    reason: "RESTOCK",
    performedById: user.id,
  })

  return {
    userId: user.id,
    sellerId: seller.id,
    productId: product.id,
    variantId: variant.id,
    listingId: listing.id,
    item,
  }
}

export async function createCustomer() {
  const user = await db.orm.public.User.create({
    firstName: "Buyer",
    email: `${randomUUID()}@example.com`,
  })
  return await db.orm.public.Customer.create({ userId: user.id })
}
