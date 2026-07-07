import type { RequestHandler } from "express"

import { Env } from "../config/env.config.js"

const defaultAllowedMethods = "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
const defaultAllowedHeaders = "Content-Type,Authorization"

export const corsMiddleware: RequestHandler = (request, response, next) => {
  const requestOrigin = request.headers.origin
  const allowAnyOrigin = Env.CORS_ORIGINS.length === 0

  if (requestOrigin && (allowAnyOrigin || Env.CORS_ORIGINS.includes(requestOrigin))) {
    response.setHeader("Access-Control-Allow-Origin", requestOrigin)
    response.setHeader("Vary", "Origin")
  }

  response.setHeader("Access-Control-Allow-Credentials", "true")
  response.setHeader("Access-Control-Allow-Methods", defaultAllowedMethods)
  response.setHeader(
    "Access-Control-Allow-Headers",
    request.headers["access-control-request-headers"] ?? defaultAllowedHeaders,
  )

  if (request.method === "OPTIONS") {
    response.sendStatus(204)
    return
  }

  next()
}
