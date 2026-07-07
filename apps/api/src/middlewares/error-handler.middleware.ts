import type { ErrorRequestHandler } from "express"

import { Env } from "../config/env.config.js"
import { logger } from "@workspace/logger"
import { HttpError } from "../utils/http-error.js"

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next

  const statusCode = error instanceof HttpError ? error.statusCode : 500
  const message =
    error instanceof HttpError || Env.NODE_ENV !== "production"
      ? error.message
      : "Internal server error"

  if (statusCode >= 500) {
    logger.error("request failed", { error })
  }

  response.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  })
}
