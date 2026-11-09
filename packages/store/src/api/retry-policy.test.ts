import { describe, expect, it } from "vitest"

import { MAX_RETRIES, retryDelay, shouldRetry } from "./retry-policy"

const read = { url: "/x" }
const write = { url: "/x", method: "POST" }

describe("shouldRetry", () => {
  it.each([408, 502, 503, 504])("retries a read after %i", (status) => {
    expect(shouldRetry({ status, data: null }, read, 1)).toBe(true)
  })

  it.each([400, 401, 403, 404, 409, 422, 429, 500])(
    "does not retry a read after %i",
    (status) => {
      expect(shouldRetry({ status, data: null }, read, 1)).toBe(false)
    }
  )

  it("retries network failures and timeouts on reads", () => {
    const network = { status: "FETCH_ERROR", error: "failed" } as const
    const timeout = { status: "TIMEOUT_ERROR", error: "slow" } as const
    expect(shouldRetry(network, "/x", 1)).toBe(true)
    expect(shouldRetry(timeout, read, 1)).toBe(true)
  })

  it.each(["POST", "PUT", "PATCH", "DELETE"])("never retries %s", (method) => {
    const network = { status: "FETCH_ERROR", error: "failed" } as const
    expect(shouldRetry(network, { ...write, method }, 1)).toBe(false)
    expect(
      shouldRetry({ status: 503, data: null }, { ...write, method }, 1)
    ).toBe(false)
  })

  it("stops after the retry budget", () => {
    const error = { status: 503, data: null }
    expect(shouldRetry(error, read, MAX_RETRIES)).toBe(true)
    expect(shouldRetry(error, read, MAX_RETRIES + 1)).toBe(false)
  })
})

describe("retryDelay", () => {
  it("doubles, stays within jitter bounds, and caps", () => {
    expect(retryDelay(1, () => 0)).toBe(150)
    expect(retryDelay(1, () => 1)).toBe(300)
    expect(retryDelay(3, () => 1)).toBe(1200)
    expect(retryDelay(20, () => 1)).toBe(4000)
  })
})
