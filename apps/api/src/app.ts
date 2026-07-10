import express, { type Application } from "express"
import cookieParser from "cookie-parser"

import { Env } from "./config/env.config.js"
import { corsMiddleware } from "./middlewares/cors.middleware.js"
import { errorHandler } from "./middlewares/error-handler.middleware.js"
import { notFoundHandler } from "./middlewares/not-found.middleware.js"
import { requestLogger } from "./middlewares/request-logger.middleware.js"
import { securityHeaders } from "./middlewares/security-headers.middleware.js"
import { apiRouter } from "./modules/api.routes.js"

export function createApp(): Application {
  const app = express()

  app.disable("x-powered-by")
  app.set("trust proxy", Env.TRUST_PROXY)

  app.use(securityHeaders)
  app.use(corsMiddleware)
  app.use(requestLogger)
  app.use(cookieParser())
  app.use(express.json({ limit: Env.JSON_BODY_LIMIT }))
  app.use(express.urlencoded({ extended: true, limit: Env.JSON_BODY_LIMIT }))
  app.use(requestLogger)

  app.get("/", (_request, response) => {
    response.status(200).json({
      name: "cbs-marketplace-api",
      status: "ok",
    })
  })

  app.use("/api", apiRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
