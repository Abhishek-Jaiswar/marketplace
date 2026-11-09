import { Redis } from "ioredis"
import { logger } from "@workspace/logger"
import { Env } from "../config/env.config.js"

const MAX_RECONNECT_DELAY_MS = 30_000

export const redis = new Redis(Env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  // Keep trying for as long as the API runs, so Redis can return without a
  // restart. The cap keeps an outage from flooding the connection.
  retryStrategy(times) {
    return Math.min(times * 500, MAX_RECONNECT_DELAY_MS)
  },
})

// Reported once per outage rather than on every reconnect attempt.
let isDown = false

redis.on("error", (error) => {
  if (isDown) return
  isDown = true
  logger.warn("Redis is unavailable; running without cache and rate limits", {
    error: error instanceof Error ? error.message : String(error),
  })
})

redis.on("ready", () => {
  if (isDown) logger.info("Redis connection restored")
  isDown = false
})

export const testRedisConnection = async (): Promise<void> => {
  try {
    if (redis.status === "wait") {
      await redis.connect()
    }

    const response = await redis.ping()

    if (response != "PONG") {
      throw new Error(`Unexpected PING response: , ${response}`)
    }

    logger.info(`Redis server replied: #${response}`)
    logger.info("Redis is ready, PING/PONG health check passed.")
  } catch (error) {
    logger.error("Redis health-check failed.", {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export const closedConnection = async (): Promise<void> => {
  try {
    if (redis.status === "ready") {
      await redis.quit()
      logger.info("Redis connection closed gracefully.")
    } else {
      logger.info(
        `Redis connection not in a closable state (status: ${redis.status}), skipping quit.`
      )
    }
  } catch (error) {
    logger.error(
      `Failed to close Redis connection: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
