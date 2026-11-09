import { describe, expect, it } from "vitest"

import { getApiErrorMessage } from "./errors"

describe("getApiErrorMessage", () => {
  it("shows the API's message for a client error", () => {
    const error = {
      status: 409,
      data: {
        error: { message: "Email is already registered", statusCode: 409 },
      },
    }
    expect(getApiErrorMessage(error)).toBe("Email is already registered")
  })

  it("never shows internal detail from a server error", () => {
    const error = {
      status: 500,
      data: { error: { message: "column does not exist", statusCode: 500 } },
    }
    expect(getApiErrorMessage(error, "Could not save.")).toBe("Could not save.")
  })

  it("explains connection problems", () => {
    expect(
      getApiErrorMessage({ status: "FETCH_ERROR", error: "failed" })
    ).toContain("connection")
    expect(
      getApiErrorMessage({ status: "TIMEOUT_ERROR", error: "slow" })
    ).toContain("too long")
  })

  it("falls back for unknown errors", () => {
    expect(getApiErrorMessage(undefined, "Could not load.")).toBe(
      "Could not load."
    )
  })
})
