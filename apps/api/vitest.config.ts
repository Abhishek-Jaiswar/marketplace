import { defineConfig } from "vitest/config"

import { testEnv } from "./vitest.shared.ts"

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["src/**/*.integration.test.ts"],
    env: testEnv,
    clearMocks: true,
  },
})
