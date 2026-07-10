import type { ErrorRequestHandler } from "express"

import { Env } from "../config/env.config.js"
import { logger } from "@workspace/logger"
import { AppError } from "../utils/errors/app-error.js"

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next

  const isAppError = error instanceof AppError
  const statusCode = isAppError ? error.statusCode : 500
  const message =
    isAppError || Env.NODE_ENV !== "production"
      ? error.message
      : "Internal server error"

  const details = isAppError ? error.details : null

  if (statusCode >= 500) {
    logger.error("request failed", { error })
  }

  response.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(details ? { details } : {}),
    },
  })
}
