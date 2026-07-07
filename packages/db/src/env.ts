const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for @workspace/db")
}

export const dbEnv = {
  DATABASE_URL: databaseUrl,
  SLOW_QUERY_THRESHOLD: Number.parseInt(
    process.env.SLOW_QUERY_THRESHOLD_MS ?? "500",
    10,
  ),
}
