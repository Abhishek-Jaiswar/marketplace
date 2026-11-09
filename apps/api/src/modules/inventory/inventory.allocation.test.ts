import { describe, expect, it } from "vitest"

import { availableStock, pickReservationItem } from "./inventory.allocation.js"

const item = (
  locationId: string,
  onHand: number,
  reserved = 0,
  safetyStock = 0
) => ({
  locationId,
  onHand,
  reserved,
  safetyStock,
})

describe("availableStock", () => {
  it("subtracts reserved units and safety stock", () => {
    expect(availableStock(item("a", 10, 3, 2))).toBe(5)
  })
})

describe("pickReservationItem", () => {
  it("uses the preferred location when it stocks the listing", () => {
    const items = [item("big", 100), item("small", 1)]
    expect(pickReservationItem(items, "small")?.locationId).toBe("small")
  })

  it("falls back to the most available location", () => {
    const items = [item("a", 10, 9), item("b", 8, 1), item("c", 5)]
    expect(pickReservationItem(items, "missing")?.locationId).toBe("b")
    expect(pickReservationItem(items)?.locationId).toBe("b")
  })

  it("returns undefined when nothing is stocked", () => {
    expect(pickReservationItem([])).toBeUndefined()
  })
})
