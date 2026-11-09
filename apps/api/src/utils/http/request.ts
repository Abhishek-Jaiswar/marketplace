import type { Request } from "express"
import type { z } from "zod"
import type { ApiErrorIssue } from "@workspace/contracts/common"

import { BadRequestError, UnauthorizedError } from "../errors/index.js"

export type AuthUser = NonNullable<Request["user"]>

/** Validates a request value, throwing a 400 that lists every invalid field. */
export function parse<Schema extends z.ZodType>(
  schema: Schema,
  value: unknown
): z.output<Schema> {
  const result = schema.safeParse(value)
  if (result.success) {
    return result.data
  }

  const issues: ApiErrorIssue[] = result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }))
  throw new BadRequestError(issues[0]?.message ?? "Invalid request", issues)
}

/** Returns the authenticated user on routes guarded by `requireAuth`. */
export function getAuthUser(req: Request): AuthUser {
  if (!req.user) {
    throw new UnauthorizedError("Authentication required")
  }
  return req.user
}

export function isAdmin(user: AuthUser): boolean {
  return user.roles.includes("ADMIN")
}
