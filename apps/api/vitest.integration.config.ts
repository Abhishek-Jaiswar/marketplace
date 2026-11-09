import { defineConfig } from "vitest/config"

import { resolveTestDatabaseUrl, testEnv } from "./vitest.shared.ts"

export default defineConfig({
  test: {
    include: ["src/**/*.integration.test.ts"],
    env: { ...testEnv, DATABASE_URL: resolveTestDatabaseUrl() },
    globalSetup: ["./vitest.global-setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
})
