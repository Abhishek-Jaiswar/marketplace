import { Redis } from "ioredis"
import { logger } from "@workspace/logger"
import { Env } from "../config/env.config.js"

export const redis = new Redis(Env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy(times) {
    if (times > 3) {
      // Stop retrying after 3 failed attempts to avoid log flooding
      return null
    }
    return Math.min(times * 1000, 3000)
  },
})

redis.on("error", (error) => {
  logger.warn("Redis connection error:", {
    error: error instanceof Error ? error.message : String(error),
  })
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
