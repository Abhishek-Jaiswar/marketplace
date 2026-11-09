import { signAccessToken } from "../utils/security.js"

export function bearer(roles: string[], userId = "user-1"): string {
  const token = signAccessToken({
    userId,
    email: `${userId}@example.com`,
    roles,
  })
  return `Bearer ${token}`
}
