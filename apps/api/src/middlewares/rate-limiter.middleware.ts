import type { Request, Response, NextFunction } from "express"
import { redis } from "../lib/redis.js"
import { TooManyRequestsError } from "../utils/errors/index.js"

export interface RateLimitOptions {
  limit: number
  windowSeconds: number
  keyPrefix: string
  keyGenerator?: (req: Request) => string
}

export function rateLimiter(options: RateLimitOptions) {
  const { limit, windowSeconds, keyPrefix, keyGenerator } = options

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = keyGenerator ? keyGenerator(req) : req.ip || "unknown"
      const key = `rate_limit:${keyPrefix}:${identifier}`

      const now = Date.now()
      const windowMs = windowSeconds * 1000
      const windowStart = now - windowMs

      const pipeline = redis.multi()
      pipeline.zremrangebyscore(key, 0, windowStart)
      pipeline.zadd(key, now, `${now}-${Math.random()}`)
      pipeline.zcard(key)
      pipeline.expire(key, windowSeconds)

      const results = await pipeline.exec()

      if (!results) {
        throw new Error("Redis transaction failed")
      }

      const cardResult = results[2]
      if (!cardResult) {
        throw new Error("Failed to retrieve request count from Redis")
      }

      const [err, count] = cardResult as [Error | null, number]
      if (err) {
        throw err
      }

      const remaining = Math.max(0, limit - count)

      res.setHeader("X-RateLimit-Limit", limit)
      res.setHeader("X-RateLimit-Remaining", remaining)
      res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000))

      if (count > limit) {
        throw new TooManyRequestsError("Too many requests. Please try again later.")
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
