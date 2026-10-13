import { config } from "dotenv"
import { defineConfig, env } from "prisma/config"

if (process.env.PRISMA_ENV === "production") {
  config({ path: "../../.env.production", override: true })
} else {
  config({ path: "../../.env" })
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
