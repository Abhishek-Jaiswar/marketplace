/* eslint-disable @typescript-eslint/no-namespace */
import type { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/security.js"
import { UnauthorizedError } from "../utils/errors/index.js"

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        roles: readonly string[] | string[]
      }
    }
  }
}

/** Identifies the caller when a valid token is sent, and never rejects. */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (token) {
    try {
      req.user = verifyAccessToken(token)
    } catch {
      // An expired token on a public route is treated as anonymous.
    }
  }
  next()
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication token required")
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      throw new UnauthorizedError("Authentication token required")
    }

    try {
      const decoded = verifyAccessToken(token)
      req.user = decoded
      next()
    } catch {
      throw new UnauthorizedError("Invalid or expired session")
    }
  } catch (error) {
    next(error)
  }
}
