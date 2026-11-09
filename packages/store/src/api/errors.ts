import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import type { SerializedError } from "@reduxjs/toolkit"
import type { ApiErrorResponse } from "@workspace/contracts/common"

const isFetchError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error

/** Turns any RTK Query error into a sentence that is safe to show a user. */
export function getApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined | unknown,
  fallback = "Something went wrong. Try again."
): string {
  if (!isFetchError(error)) return fallback

  if (error.status === "FETCH_ERROR") {
    return "Could not reach the server. Check your connection and try again."
  }
  if (error.status === "TIMEOUT_ERROR") {
    return "The server took too long to respond. Try again."
  }

  const message = (error.data as ApiErrorResponse | undefined)?.error?.message
  return typeof error.status === "number" && error.status < 500 && message
    ? message
    : fallback
}
