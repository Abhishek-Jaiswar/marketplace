import { describe, expect, it } from "vitest"
import { shippingFor } from "@workspace/contracts/commerce"

import {
  commissionFor,
  isSameState,
  resolveCommissionBps,
  splitGst,
} from "./order.pricing.js"

describe("splitGst", () => {
  it("backs tax out of an inclusive price between states", () => {
    expect(splitGst(11800, 1800, false)).toEqual({
      taxableAmount: 10000,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 1800,
    })
  })

  it("halves tax within a state and keeps every paisa", () => {
    const split = splitGst(10001, 500, true)
    expect(split.taxableAmount + split.cgstAmount + split.sgstAmount).toBe(
      10001
    )
    expect(Math.abs(split.cgstAmount - split.sgstAmount)).toBeLessThanOrEqual(1)
  })

  it("handles products with no GST rate", () => {
    expect(splitGst(5000, 0, true).taxableAmount).toBe(5000)
  })
})

describe("commission", () => {
  const rules = [
    { sellerId: null, categoryId: null, rateBps: 1000 },
    { sellerId: null, categoryId: "c1", rateBps: 800 },
    { sellerId: "s1", categoryId: null, rateBps: 600 },
    { sellerId: "s1", categoryId: "c1", rateBps: 400 },
  ]

  it("prefers the most specific rule", () => {
    expect(resolveCommissionBps(rules, "s1", "c1")).toBe(400)
    expect(resolveCommissionBps(rules, "s1", "c2")).toBe(600)
    expect(resolveCommissionBps(rules, "s2", "c1")).toBe(800)
    expect(resolveCommissionBps(rules, "s2", "c2")).toBe(1000)
  })

  it("charges nothing without a rule", () => {
    expect(resolveCommissionBps([], "s1", "c1")).toBe(0)
  })

  it("calculates the amount in paise", () => {
    expect(commissionFor(12345, 1000)).toBe(1235)
  })
})

describe("shipping and place of supply", () => {
  it("is free from ₹499", () => {
    expect(shippingFor(49899)).toBe(4900)
    expect(shippingFor(49900)).toBe(0)
    expect(shippingFor(0)).toBe(0)
  })

  it("compares states loosely", () => {
    expect(isSameState(" Maharashtra", "maharashtra ")).toBe(true)
    expect(isSameState("Delhi", null)).toBe(false)
  })
})
