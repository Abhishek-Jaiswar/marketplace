import { db } from "@workspace/db"
import { describe, expect, it } from "vitest"

import { createStockedListing } from "../../test/fixtures.js"
import { inventoryRepository } from "./inventory.repository.js"

const LIST_PARAMS = { page: 1, limit: 50 }
const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

const readItem = (id: string) => db.orm.public.InventoryItem.first({ id })

describe("tenant scoping", () => {
  it("lists only the requesting seller's locations", async () => {
    const mine = await createStockedListing(1)
    await createStockedListing(1)

    const locations = await inventoryRepository.findLocations(mine.sellerId)

    expect(locations.map((location) => location.sellerId)).toEqual([
      mine.sellerId,
    ])
  })

  it("returns only the requesting seller's inventory", async () => {
    const mine = await createStockedListing(3)
    await createStockedListing(7)

    const result = await inventoryRepository.findInventory({
      ...LIST_PARAMS,
      sellerId: mine.sellerId,
    })

    expect(result.total).toBe(1)
    expect(result.items.map((item) => item.sellerListingId)).toEqual([
      mine.listingId,
    ])
  })

  it("returns only the requesting seller's ledger", async () => {
    const mine = await createStockedListing(3)
    const other = await createStockedListing(7)

    const result = await inventoryRepository.findLedgerEntries({
      ...LIST_PARAMS,
      sellerId: mine.sellerId,
    })

    expect(result.total).toBe(1)
    expect(result.items[0]?.inventoryItemId).toBe(mine.item?.id)
    expect(result.items[0]?.inventoryItemId).not.toBe(other.item?.id)
  })
})

describe("reservations", () => {
  it("never oversells under concurrent requests", async () => {
    const { listingId, item } = await createStockedListing(5)

    const results = await Promise.allSettled(
      Array.from({ length: 12 }, () =>
        inventoryRepository.createReservations(
          [{ sellerListingId: listingId, quantity: 1 }],
          { expiresAt }
        )
      )
    )

    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(5)
    expect((await readItem(item!.id))?.reserved).toBe(5)
  })

  it("reserves all lines or none", async () => {
    const first = await createStockedListing(5)
    const second = await createStockedListing(1)

    await expect(
      inventoryRepository.createReservations(
        [
          { sellerListingId: first.listingId, quantity: 2 },
          { sellerListingId: second.listingId, quantity: 2 },
        ],
        { expiresAt }
      )
    ).rejects.toThrow("Insufficient available stock")

    expect((await readItem(first.item!.id))?.reserved).toBe(0)
    expect((await readItem(second.item!.id))?.reserved).toBe(0)
  })

  it("commits a reservation exactly once", async () => {
    const { listingId, userId, item } = await createStockedListing(5)
    const [reservation] = await inventoryRepository.createReservations(
      [{ sellerListingId: listingId, quantity: 2 }],
      { expiresAt }
    )

    const results = await Promise.allSettled([
      inventoryRepository.commitReservation(reservation!.id, "order-1", userId),
      inventoryRepository.commitReservation(reservation!.id, "order-1", userId),
    ])

    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1)
    const updated = await readItem(item!.id)
    expect(updated?.onHand).toBe(3)
    expect(updated?.reserved).toBe(0)
  })

  it("returns held stock on release and ignores a repeat", async () => {
    const { listingId, item } = await createStockedListing(5)
    const [reservation] = await inventoryRepository.createReservations(
      [{ sellerListingId: listingId, quantity: 4 }],
      { expiresAt }
    )

    const first = await inventoryRepository.releaseReservation(reservation!.id)
    const second = await inventoryRepository.releaseReservation(reservation!.id)

    expect(first.reservation?.status).toBe("RELEASED")
    expect(second.item).toBeNull()
    expect((await readItem(item!.id))?.reserved).toBe(0)
  })
})
