import { describe, expect, it } from "vitest"

import { parseEnv } from "./env.config.js"

const baseEnv = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/app",
  CLOUDINARY_CLOUD_NAME: "cloud",
  CLOUDINARY_CLOUD_API_KEY: "key",
  CLOUDINARY_CLOUD_API_SECRET: "secret",
  MAIL_USER: "mail",
  MAIL_PASS: "pass",
}

describe("parseEnv", () => {
  it("rejects production without JWT_SECRET", () => {
    expect(() => parseEnv({ ...baseEnv, NODE_ENV: "production" })).toThrow(
      "JWT_SECRET is required in production"
    )
  })

  it("rejects a short JWT_SECRET", () => {
    expect(() => parseEnv({ ...baseEnv, JWT_SECRET: "short" })).toThrow(
      "JWT_SECRET"
    )
  })

  it("falls back to a development secret outside production", () => {
    const env = parseEnv({ ...baseEnv, NODE_ENV: "development" })
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32)
  })
})
