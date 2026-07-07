import { PrismaPg } from "@prisma/adapter-pg"

import { Prisma, PrismaClient } from "./generated/prisma/client.js"
import { dbEnv } from "./env.js"
import { logger } from "@workspace/logger"

const adapter = new PrismaPg({ connectionString: dbEnv.DATABASE_URL })

export const prisma = new PrismaClient({
  adapter,
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
})

prisma.$on("query", (event: Prisma.QueryEvent) => {
  if (event.query.trim().toLowerCase().startsWith("select 1")) {
    return
  }

  const isSlow = event.duration >= dbEnv.SLOW_QUERY_THRESHOLD
  const level = isSlow ? "warn" : "info"
  const message = isSlow ? "Slow database query detected" : "Database query"

  logger[level](message, {
    database: {
      query: event.query,
      params: event.params,
      durationMs: event.duration,
      slowQueryThresholdMs: dbEnv.SLOW_QUERY_THRESHOLD,
    },
  })
})

export async function testConnection() {
  try {
    const response = await prisma.$queryRaw`
      SELECT NOW()
    `

    logger.info("Database connection successful", response)

    return response
  } catch (error) {
    logger.error("Database connection failed", { error })
    throw error
  }
}

export const db = prisma
