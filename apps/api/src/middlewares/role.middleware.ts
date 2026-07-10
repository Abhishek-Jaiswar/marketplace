import type { Request, Response, NextFunction } from "express"
import { type UserRole } from "@workspace/db"
import { ForbiddenError, UnauthorizedError } from "../utils/errors/index.js"

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Authentication required")
      }

      const userRoles = req.user.roles as UserRole[]
      const hasRole = userRoles.some((role) => allowedRoles.includes(role))

      if (!hasRole) {
        throw new ForbiddenError("You do not have permission to perform this action")
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
