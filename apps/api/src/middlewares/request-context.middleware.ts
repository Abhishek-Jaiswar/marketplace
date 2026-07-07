import { randomUUID } from "node:crypto"
import type { RequestHandler } from "express"
import { runWithRequestContext } from "@workspace/logger"

function getHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export const requestContextMiddleware: RequestHandler = (request, response, next) => {
  const correlationId =
    getHeaderValue(request.headers["x-correlation-id"]) ??
    getHeaderValue(request.headers["x-request-id"]) ??
    randomUUID()

  response.setHeader("X-Correlation-Id", correlationId)
  response.setHeader("X-Request-Id", correlationId)

  runWithRequestContext({ correlationId }, next)
}
