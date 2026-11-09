import type {
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"

export const MAX_RETRIES = 3
export const REQUEST_TIMEOUT_MS = 20_000
export const UPLOAD_TIMEOUT_MS = 120_000

const BASE_DELAY_MS = 300
const MAX_DELAY_MS = 4_000

/** Gateway and overload responses that usually clear on their own. */
const TRANSIENT_STATUSES = new Set([408, 502, 503, 504])
const SAFE_METHODS = new Set(["GET", "HEAD"])

function isSafeToRepeat(args: string | FetchArgs): boolean {
  const method = typeof args === "string" ? "GET" : (args.method ?? "GET")
  return SAFE_METHODS.has(method.toUpperCase())
}

/**
 * Retries reads that failed for a transient reason. Writes are never retried
 * automatically: after a dropped connection the server may already have
 * applied them, and repeating would place the order or take the action twice.
 */
export function shouldRetry(
  error: FetchBaseQueryError,
  args: string | FetchArgs,
  attempt: number
): boolean {
  if (attempt > MAX_RETRIES || !isSafeToRepeat(args)) {
    return false
  }
  if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
    return true
  }
  return (
    typeof error.status === "number" && TRANSIENT_STATUSES.has(error.status)
  )
}

/** Exponential backoff with jitter, so clients don't all retry in step. */
export function retryDelay(attempt: number, random = Math.random): number {
  const ceiling = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (attempt - 1))
  return ceiling / 2 + random() * (ceiling / 2)
}
