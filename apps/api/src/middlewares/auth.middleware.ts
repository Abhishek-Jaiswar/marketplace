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
        roles: string[]
      }
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
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
