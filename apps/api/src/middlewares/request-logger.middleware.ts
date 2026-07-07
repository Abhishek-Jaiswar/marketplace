import { performance } from "node:perf_hooks"

import type { RequestHandler } from "express"

import { Env } from "../config/env.config.js"
import { logger } from "@workspace/logger"

export const requestLogger: RequestHandler = (request, response, next) => {
  if (Env.NODE_ENV === "production" && request.path === "/health/live") {
    next()
    return
  }

  const startedAt = performance.now()

  response.on("finish", () => {
    const durationMs = Math.round(performance.now() - startedAt)
    const level =
      response.statusCode >= 500 ? "error" : response.statusCode >= 400 ? "warn" : "info"

    logger[level]("request completed", {
      request: {
        method: request.method,
        path: request.originalUrl,
        ip: request.ip,
        userAgent: request.get("user-agent"),
      },
      response: {
        statusCode: response.statusCode,
      },
      durationMs,
    })
  })

  next()
}
