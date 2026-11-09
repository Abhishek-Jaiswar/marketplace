import request from "supertest"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { createApp } from "../../app.js"
import { bearer } from "../../test/auth.js"
import { catalogRepository } from "../catalog/index.js"
import { sellerRepository } from "../seller/index.js"
import { inventoryRepository } from "./inventory.repository.js"

vi.mock("../../lib/redis.js", () => ({ redis: { status: "end" } }))
vi.mock("./inventory.cache.js", () => ({
  inventoryCache: { invalidateListingStock: vi.fn() },
}))
vi.mock("./inventory.repository.js", () => ({
  inventoryRepository: {
    assertLocationCodeAvailable: vi.fn(),
    commitReservation: vi.fn(),
    createLocation: vi.fn(),
    createReservations: vi.fn(),
    executeStockAdjustment: vi.fn(),
    findInventory: vi.fn(),
    findLedgerEntries: vi.fn(),
    findLocationById: vi.fn(),
    findLocations: vi.fn(),
    releaseReservation: vi.fn(),
    updateLocation: vi.fn(),
  },
}))
vi.mock("../seller/index.js", () => ({
  sellerRepository: { findSellerIdentityByOwnerId: vi.fn() },
}))
vi.mock("../catalog/index.js", () => ({
  catalogRepository: { findListingById: vi.fn() },
}))

const repository = vi.mocked(inventoryRepository, { deep: true })
const sellers = vi.mocked(sellerRepository, { deep: true })
const catalog = vi.mocked(catalogRepository, { deep: true })

const app = createApp()
const SELLER = bearer(["SELLER"])
const ADMIN = bearer(["ADMIN"], "admin-1")
const EMPTY_PAGE = { items: [], total: 0, page: 1, limit: 20, totalPages: 0 }

function mockSeller(id = "seller-1", status = "APPROVED") {
  sellers.findSellerIdentityByOwnerId.mockResolvedValue({
    id,
    status,
  } as never)
}

describe("inventory access control", () => {
  it.each([
    ["get", "/api/inventory/locations"],
    ["post", "/api/inventory/locations"],
    ["put", "/api/inventory/locations/loc-1"],
    ["post", "/api/inventory/adjust"],
    ["post", "/api/inventory/reserve"],
    ["post", "/api/inventory/commit"],
    ["post", "/api/inventory/release"],
    ["get", "/api/inventory/items"],
    ["get", "/api/inventory/ledger"],
  ] as const)("%s %s requires a token", async (method, path) => {
    const response = await request(app)[method](path)
    expect(response.status).toBe(401)
  })

  it("rejects customers from seller routes", async () => {
    const response = await request(app)
      .get("/api/inventory/items")
      .set("Authorization", bearer(["CUSTOMER"]))
    expect(response.status).toBe(403)
  })

  it.each(["reserve", "commit", "release"])(
    "does not let sellers call %s",
    async (action) => {
      const response = await request(app)
        .post(`/api/inventory/${action}`)
        .set("Authorization", SELLER)
        .send({})
      expect(response.status).toBe(403)
    }
  )
})

describe("tenant scoping", () => {
  it("pins a seller's inventory to their own seller id", async () => {
    mockSeller("seller-1")
    repository.findInventory.mockResolvedValue(EMPTY_PAGE as never)

    await request(app)
      .get("/api/inventory/items?sellerId=someone-else")
      .set("Authorization", SELLER)
      .expect(200)

    expect(repository.findInventory).toHaveBeenCalledWith(
      expect.objectContaining({ sellerId: "seller-1" })
    )
  })

  it("lets admins filter inventory by any seller", async () => {
    repository.findInventory.mockResolvedValue(EMPTY_PAGE as never)

    await request(app)
      .get("/api/inventory/items?sellerId=seller-9")
      .set("Authorization", ADMIN)
      .expect(200)

    expect(repository.findInventory).toHaveBeenCalledWith(
      expect.objectContaining({ sellerId: "seller-9" })
    )
  })

  it("pins a seller's ledger to their own seller id", async () => {
    mockSeller("seller-1")
    repository.findLedgerEntries.mockResolvedValue(EMPTY_PAGE as never)

    await request(app)
      .get("/api/inventory/ledger")
      .set("Authorization", SELLER)
      .expect(200)

    expect(repository.findLedgerEntries).toHaveBeenCalledWith(
      expect.objectContaining({ sellerId: "seller-1" })
    )
  })

  it("rejects seller-role users without a seller profile", async () => {
    sellers.findSellerIdentityByOwnerId.mockResolvedValue(null as never)

    await request(app)
      .get("/api/inventory/ledger")
      .set("Authorization", SELLER)
      .expect(403)

    expect(repository.findLedgerEntries).not.toHaveBeenCalled()
  })

  it("blocks stock adjustments on another seller's listing", async () => {
    mockSeller("seller-1")
    catalog.findListingById.mockResolvedValue({
      sellerId: "seller-2",
    } as never)

    await request(app)
      .post("/api/inventory/adjust")
      .set("Authorization", SELLER)
      .send({
        sellerListingId: "listing-1",
        locationId: "loc-1",
        quantityDelta: 5,
        reason: "RESTOCK",
      })
      .expect(403)

    expect(repository.executeStockAdjustment).not.toHaveBeenCalled()
  })

  it("only lets approved sellers create locations", async () => {
    mockSeller("seller-1", "DRAFT")

    await request(app)
      .post("/api/inventory/locations")
      .set("Authorization", SELLER)
      .send({ name: "Main", code: "MAIN" })
      .expect(403)

    expect(repository.createLocation).not.toHaveBeenCalled()
  })
})

describe("response contract", () => {
  beforeEach(() => mockSeller())

  it("returns lists as data plus meta", async () => {
    repository.findInventory.mockResolvedValue({
      items: [{ id: "item-1" }],
      total: 41,
      page: 2,
      limit: 20,
      totalPages: 3,
    } as never)

    const response = await request(app)
      .get("/api/inventory/items?page=2")
      .set("Authorization", SELLER)
      .expect(200)

    expect(response.body).toEqual({
      data: [{ id: "item-1" }],
      meta: { total: 41, page: 2, limit: 20, totalPages: 3 },
    })
  })

  it("returns 201 with data and message on create", async () => {
    repository.createLocation.mockResolvedValue({ id: "loc-1" } as never)

    const response = await request(app)
      .post("/api/inventory/locations")
      .set("Authorization", SELLER)
      .send({ name: "Main", code: "main-1" })
      .expect(201)

    expect(response.body).toEqual({
      data: { id: "loc-1" },
      message: "Inventory location created successfully",
    })
    expect(repository.createLocation).toHaveBeenCalledWith(
      "seller-1",
      expect.objectContaining({ code: "MAIN-1", type: "SELLER_WAREHOUSE" })
    )
  })

  it("reports every invalid field", async () => {
    const response = await request(app)
      .post("/api/inventory/adjust")
      .set("Authorization", SELLER)
      .send({ quantityDelta: 0, reason: "NOPE" })
      .expect(400)

    expect(response.body.error.statusCode).toBe(400)
    expect(
      response.body.error.details.map((issue: { path: string }) => issue.path)
    ).toEqual(
      expect.arrayContaining([
        "sellerListingId",
        "locationId",
        "quantityDelta",
        "reason",
      ])
    )
  })

  it("forwards async failures to the error handler", async () => {
    repository.findLocations.mockRejectedValue(new Error("database down"))

    const response = await request(app)
      .get("/api/inventory/locations")
      .set("Authorization", ADMIN)
      .expect(500)

    expect(response.body.error.statusCode).toBe(500)
  })

  it("passes reservations through for admins", async () => {
    repository.createReservations.mockResolvedValue([{ id: "res-1" }] as never)

    const response = await request(app)
      .post("/api/inventory/reserve")
      .set("Authorization", ADMIN)
      .send({ items: [{ sellerListingId: "listing-1", quantity: 2 }] })
      .expect(200)

    expect(response.body.data.reservations).toEqual([{ id: "res-1" }])
    expect(response.body.data.ttlMinutes).toBe(15)
  })
})
