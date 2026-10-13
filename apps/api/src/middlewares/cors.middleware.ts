import cors from "cors"
import { Env } from "../config/env.config.js"

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile, server-to-server, curl)
    if (!origin) {
      return callback(null, true)
    }

    // Allow all if no origins configured
    if (Env.CORS_ORIGINS.length === 0) {
      return callback(null, true)
    }

    const normalizedOrigin = origin.replace(/\/+$/, "")
    if (Env.CORS_ORIGINS.includes(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(null, false)
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400, // Preflight cache (24h)
})
