import { randomUUID } from "node:crypto"

import { db } from "@workspace/db"
import request, { type Response } from "supertest"
import { describe, expect, it, vi } from "vitest"

import { createApp } from "../app.js"
import { bearer } from "./auth.js"
import { createCustomer, createStockedListing } from "./fixtures.js"

vi.mock("../lib/redis.js", () => ({ redis: { status: "end" } }))

const app = createApp()

function ok(response: Response, status = 200) {
  expect(
    response.status,
    `${response.request.method} ${response.request.url}: ${JSON.stringify(response.body)}`
  ).toBe(status)
  return response.body
}

async function buyableListing(stock: number) {
  const stocked = await createStockedListing(stock)
  await db.orm.public.Seller.where({ id: stocked.sellerId }).update({
    status: "APPROVED",
  })
  await db.orm.public.Product.where({ id: stocked.productId }).update({
    status: "APPROVED",
  })
  return stocked
}

async function shopper() {
  const customer = await createCustomer()
  const auth = { Authorization: bearer(["CUSTOMER"], customer.userId) }
  const address = await db.orm.public.Address.create({
    recipientName: "Priya Nair",
    street1: "12 MG Road",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    country: "India",
    phoneNumber: "9876543210",
    customerId: customer.id,
  })
  return { customer, auth, addressId: address.id }
}

async function add(
  auth: Record<string, string>,
  sellerListingId: string,
  quantity: number
) {
  return await request(app)
    .post("/api/cart/items")
    .set(auth)
    .send({ sellerListingId, quantity })
}

const stockOf = (id: string) => db.orm.public.InventoryItem.first({ id })

describe("cart", () => {
  it("requires signing in", async () => {
    expect((await request(app).get("/api/cart")).status).toBe(401)
    expect((await request(app).get("/api/orders")).status).toBe(401)
  })

  it("adds, updates, and removes lines with live totals", async () => {
    const { auth } = await shopper()
    const { listingId } = await buyableListing(5)

    const added = ok(await add(auth, listingId, 2)).data
    expect(added.itemCount).toBe(2)
    expect(added.subtotal).toBe(1800)
    expect(added.shippingTotal).toBe(4900)
    expect(added.lines[0].isPurchasable).toBe(true)

    const again = ok(await add(auth, listingId, 1)).data
    expect(again.lines).toHaveLength(1)
    expect(again.lines[0].quantity).toBe(3)

    const lineId = again.lines[0].id
    const updated = ok(
      await request(app)
        .patch(`/api/cart/items/${lineId}`)
        .set(auth)
        .send({ quantity: 1 })
    ).data
    expect(updated.itemCount).toBe(1)

    const removed = ok(
      await request(app).delete(`/api/cart/items/${lineId}`).set(auth)
    ).data
    expect(removed.lines).toEqual([])
  })

  it("refuses more than is in stock", async () => {
    const { auth } = await shopper()
    const { listingId } = await buyableListing(2)

    const response = await add(auth, listingId, 3)
    expect(response.status).toBe(400)
    expect(response.body.error.message).toContain("up to 2")
  })

  it("cannot touch another shopper's cart", async () => {
    const owner = await shopper()
    const other = await shopper()
    const { listingId } = await buyableListing(5)
    const lineId = ok(await add(owner.auth, listingId, 1)).data.lines[0].id

    const response = await request(app)
      .delete(`/api/cart/items/${lineId}`)
      .set(other.auth)
    expect(response.status).toBe(404)
  })

  it("merges a signed-out cart and caps it to stock", async () => {
    const { auth } = await shopper()
    const { listingId } = await buyableListing(3)

    const merged = ok(
      await request(app)
        .post("/api/cart/merge")
        .set(auth)
        .send({
          items: [
            { sellerListingId: listingId, quantity: 5 },
            { sellerListingId: "gone", quantity: 1 },
          ],
        })
    ).data
    expect(merged.lines).toHaveLength(1)
    expect(merged.lines[0].quantity).toBe(3)
  })
})

describe("checkout", () => {
  async function ready(stock = 5, quantity = 2) {
    const buyer = await shopper()
    const stocked = await buyableListing(stock)
    const cart = ok(await add(buyer.auth, stocked.listingId, quantity)).data
    return { ...buyer, ...stocked, cart }
  }

  const place = (auth: Record<string, string>, body: Record<string, unknown>) =>
    request(app).post("/api/orders/checkout").set(auth).send(body)

  it("places an order, holds stock, and empties the cart", async () => {
    const { auth, addressId, cart, item } = await ready()

    const placed = ok(
      await place(auth, {
        addressId,
        paymentMethod: "COD",
        idempotencyKey: randomUUID(),
        expectedTotal: cart.total,
      }),
      201
    ).data
    expect(placed.orderNumber).toMatch(/^ORD-/)

    expect((await stockOf(item!.id))?.reserved).toBe(2)
    expect(
      ok(await request(app).get("/api/cart").set(auth)).data.lines
    ).toEqual([])

    const order = ok(
      await request(app).get(`/api/orders/${placed.orderNumber}`).set(auth)
    ).data
    expect(order.status).toBe("PLACED")
    expect(order.grandTotal).toBe(cart.total)
    expect(order.paymentMethod).toBe("COD")
    expect(order.shippingAddress.recipientName).toBe("Priya Nair")
    expect(order.sellerOrders[0].items[0].quantity).toBe(2)

    const list = ok(await request(app).get("/api/orders").set(auth))
    expect(list.data[0].orderNumber).toBe(placed.orderNumber)
    expect(list.meta.total).toBe(1)
  })

  it("does not place the same order twice", async () => {
    const { auth, addressId, cart, item } = await ready()
    const body = {
      addressId,
      paymentMethod: "COD",
      idempotencyKey: randomUUID(),
      expectedTotal: cart.total,
    }

    const first = ok(await place(auth, body), 201).data
    const second = ok(await place(auth, body), 201).data

    expect(second.orderNumber).toBe(first.orderNumber)
    expect((await stockOf(item!.id))?.reserved).toBe(2)
  })

  it("stops when the price changed since the shopper saw it", async () => {
    const { auth, addressId, cart, listingId } = await ready()
    await db.orm.public.SellerListing.where({ id: listingId }).update({
      sellingPrice: 950,
    })

    const response = await place(auth, {
      addressId,
      paymentMethod: "COD",
      idempotencyKey: randomUUID(),
      expectedTotal: cart.total,
    })
    expect(response.status).toBe(409)
    expect(response.body.error.message).toContain("changed")
  })

  it("rejects a delivery address belonging to someone else", async () => {
    const { auth, cart } = await ready()
    const other = await shopper()

    const response = await place(auth, {
      addressId: other.addressId,
      paymentMethod: "COD",
      idempotencyKey: randomUUID(),
      expectedTotal: cart.total,
    })
    expect(response.status).toBe(404)
  })

  it("never sells the last unit twice", async () => {
    const stocked = await buyableListing(1)
    const buyers = await Promise.all(
      Array.from({ length: 4 }, async () => {
        const buyer = await shopper()
        const cart = ok(await add(buyer.auth, stocked.listingId, 1)).data
        return { ...buyer, cart }
      })
    )

    const results = await Promise.all(
      buyers.map(({ auth, addressId, cart }) =>
        place(auth, {
          addressId,
          paymentMethod: "COD",
          idempotencyKey: randomUUID(),
          expectedTotal: cart.total,
        })
      )
    )

    expect(results.filter((r) => r.status === 201)).toHaveLength(1)
    expect((await stockOf(stocked.item!.id))?.reserved).toBe(1)
  })

  it("splits an order per seller and records test payments", async () => {
    const buyer = await shopper()
    const first = await buyableListing(5)
    const second = await buyableListing(5)
    await add(buyer.auth, first.listingId, 1)
    const cart = ok(await add(buyer.auth, second.listingId, 1)).data

    const placed = ok(
      await place(buyer.auth, {
        addressId: buyer.addressId,
        paymentMethod: "ONLINE",
        idempotencyKey: randomUUID(),
        expectedTotal: cart.total,
      }),
      201
    ).data

    const order = ok(
      await request(app)
        .get(`/api/orders/${placed.orderNumber}`)
        .set(buyer.auth)
    ).data
    expect(order.sellerOrders).toHaveLength(2)
    expect(order.paymentStatus).toBe("CAPTURED")
  })

  it("keeps orders private", async () => {
    const { auth, addressId, cart } = await ready()
    const other = await shopper()
    const placed = ok(
      await place(auth, {
        addressId,
        paymentMethod: "COD",
        idempotencyKey: randomUUID(),
        expectedTotal: cart.total,
      }),
      201
    ).data

    const response = await request(app)
      .get(`/api/orders/${placed.orderNumber}`)
      .set(other.auth)
    expect(response.status).toBe(404)
  })
})
