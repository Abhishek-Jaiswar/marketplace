import { randomUUID } from "node:crypto"

import { db } from "@workspace/db"
import { describe, expect, it } from "vitest"

import { createCustomer, createStockedListing } from "./fixtures.js"

const ADDRESS = { city: "Pune", state: "Maharashtra", postalCode: "411001" }

async function placeOrder() {
  const stocked = await createStockedListing(5)
  const customer = await createCustomer()
  const key = randomUUID()

  const order = await db.orm.public.Order.create({
    orderNumber: `ORD-${key}`,
    idempotencyKey: key,
    customerId: customer.id,
    subtotal: 90_000,
    grandTotal: 90_000,
    shippingAddress: ADDRESS,
    billingAddress: ADDRESS,
  })
  const sellerOrder = await db.orm.public.SellerOrder.create({
    sellerOrderNumber: `SO-${key}`,
    orderId: order.id,
    sellerId: stocked.sellerId,
    subtotal: 90_000,
    total: 90_000,
  })
  const orderItem = await db.orm.public.OrderItem.create({
    sellerOrderId: sellerOrder.id,
    sellerListingId: stocked.listingId,
    variantId: stocked.variantId,
    title: "Product",
    sku: "sku",
    sellerSku: "seller-sku",
    attributes: {},
    quantity: 1,
    unitMrp: 100_000,
    unitPrice: 90_000,
    taxableAmount: 76_271,
    gstRateBps: 1800,
    igstAmount: 13_729,
    lineTotal: 90_000,
  })

  return { ...stocked, customer, key, order, sellerOrder, orderItem }
}

describe("order to payout", () => {
  it("records a full purchase, return, and settlement", async () => {
    const placed = await placeOrder()
    const { customer, key, order, sellerOrder, orderItem, sellerId } = placed

    const payment = await db.orm.public.Payment.create({
      orderId: order.id,
      provider: "RAZORPAY",
      amount: order.grandTotal,
    })
    const shipment = await db.orm.public.Shipment.create({
      sellerOrderId: sellerOrder.id,
      carrier: "carrier",
      trackingNumber: key,
    })
    await db.orm.public.ShipmentItem.create({
      shipmentId: shipment.id,
      orderItemId: orderItem.id,
      quantity: 1,
    })
    await db.orm.public.ProductReview.create({
      productId: placed.productId,
      customerId: customer.id,
      orderItemId: orderItem.id,
      rating: 5,
    })
    const returnRequest = await db.orm.public.ReturnRequest.create({
      returnNumber: `RET-${key}`,
      orderItemId: orderItem.id,
      customerId: customer.id,
      sellerId,
      quantity: 1,
      reason: "DAMAGED",
    })
    await db.orm.public.Refund.create({
      paymentId: payment.id,
      orderItemId: orderItem.id,
      returnRequestId: returnRequest.id,
      amount: 90_000,
    })

    const bank = await db.orm.public.BankAccount.create({
      sellerId,
      accountHolderName: "Seller",
      accountNumber: "1234567890",
      ifscCode: "HDFC0000001",
      bankName: "HDFC",
    })
    const payout = await db.orm.public.Payout.create({
      payoutNumber: `PAY-${key}`,
      sellerId,
      bankAccountId: bank.id,
      amount: 3_000_000_000n,
      periodStart: "2026-11-01T00:00:00.000Z",
      periodEnd: "2026-11-07T00:00:00.000Z",
    })
    const entry = await db.orm.public.SellerLedgerEntry.create({
      sellerId,
      type: "PAYOUT",
      amount: -90_000,
      balanceAfter: 3_000_000_000n,
      idempotencyKey: `payout:${payout.id}`,
      payoutId: payout.id,
    })

    expect(payout.amount).toBe(3_000_000_000n)
    expect(entry.balanceAfter).toBe(3_000_000_000n)
  })
})

describe("database guarantees", () => {
  it("rejects a repeated checkout", async () => {
    const { customer, key } = await placeOrder()

    await expect(
      db.orm.public.Order.create({
        orderNumber: `ORD-${randomUUID()}`,
        idempotencyKey: key,
        customerId: customer.id,
        subtotal: 1,
        grandTotal: 1,
        shippingAddress: ADDRESS,
        billingAddress: ADDRESS,
      })
    ).rejects.toThrow()
  })

  it("allows one review per purchased item", async () => {
    const { customer, orderItem, productId } = await placeOrder()
    const review = {
      productId,
      customerId: customer.id,
      orderItemId: orderItem.id,
      rating: 4,
    }

    await db.orm.public.ProductReview.create(review)
    await expect(db.orm.public.ProductReview.create(review)).rejects.toThrow()
  })

  it("rejects a rating outside 1 to 5", async () => {
    const { customer, orderItem, productId } = await placeOrder()

    await expect(
      db.orm.public.ProductReview.create({
        productId,
        customerId: customer.id,
        orderItemId: orderItem.id,
        rating: 6,
      })
    ).rejects.toThrow()
  })

  it("rejects a selling price above MRP", async () => {
    const { listingId } = await createStockedListing(1)

    await expect(
      db.orm.public.SellerListing.where({ id: listingId }).update({
        sellingPrice: 1001,
      })
    ).rejects.toThrow()
  })

  it("rejects reserving more than is on hand", async () => {
    const { item } = await createStockedListing(2)

    await expect(
      db.orm.public.InventoryItem.where({ id: item!.id }).update({
        reserved: 3,
      })
    ).rejects.toThrow()
  })

  it("keeps a listing that has order history", async () => {
    const { listingId } = await placeOrder()

    await expect(
      db.orm.public.SellerListing.where({ id: listingId }).delete()
    ).rejects.toThrow()
  })
})
