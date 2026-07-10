import type { RequestHandler } from "express"

import { NotFoundError } from "../utils/errors/index.js"

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(
    new NotFoundError(
      `Route not found: ${request.method} ${request.originalUrl}`
    )
  )
}
