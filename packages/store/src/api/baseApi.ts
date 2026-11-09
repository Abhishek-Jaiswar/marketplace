import {
  createApi,
  fetchBaseQuery,
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { tokenReceived, loggedOut } from "../slices/authSlice"
import { REQUEST_TIMEOUT_MS, retryDelay, shouldRetry } from "./retry-policy"

class SimpleMutex {
  private promise: Promise<void> = Promise.resolve()
  private locked = false

  isLocked() {
    return this.locked
  }

  async waitForUnlock() {
    while (this.locked) {
      await this.promise
    }
  }

  async acquire(): Promise<() => void> {
    this.locked = true
    let release: () => void = () => {}
    const nextPromise = new Promise<void>((resolve) => {
      release = () => {
        this.locked = false
        resolve()
      }
    })
    const currentPromise = this.promise
    this.promise = currentPromise.then(() => nextPromise)
    await currentPromise
    return release
  }
}

const mutex = new SimpleMutex()

const getBaseApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  const defaultUrl =
    process.env.NODE_ENV === "production"
      ? "https://marketplace-2zmv.onrender.com/api"
      : "http://localhost:4000/api"
  const url = envUrl || defaultUrl
  const sanitized = url.replace(/\/+$/, "")
  return sanitized.endsWith("/api") ? sanitized : `${sanitized}/api`
}

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseApiUrl(),
  credentials: "include",
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers, { getState }) => {
    const { auth } = getState() as { auth?: { accessToken: string | null } }
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`)
    }
    return headers
  },
})

const baseQueryWithRetry = retry(baseQuery, {
  retryCondition: (error, args, { attempt }) =>
    shouldRetry(
      error as FetchBaseQueryError,
      args as string | FetchArgs,
      attempt
    ),
  backoff: (attempt, _maxRetries, signal) =>
    new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, retryDelay(attempt))
      signal?.addEventListener("abort", () => {
        clearTimeout(timer)
        resolve()
      })
    }),
})

/** The server rejected the refresh token, as opposed to being unreachable. */
const isRefreshRejected = (error: FetchBaseQueryError | undefined) =>
  error?.status === 400 || error?.status === 401 || error?.status === 403

/** On these routes a 401 means wrong details, not an expired session. */
const CREDENTIAL_ROUTES =
  /\/users\/(login|register|verify|resend-otp|forgot-password|reset-password)$/

const isCredentialRequest = (args: string | FetchArgs) =>
  CREDENTIAL_ROUTES.test(typeof args === "string" ? args : args.url)

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQueryWithRetry(args, api, extraOptions)

  if (result.error?.status === 401 && !isCredentialRequest(args)) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        // Not retried: refresh tokens rotate, so a repeat could revoke the session.
        const refreshResult = await baseQuery(
          { url: "/users/refresh", method: "POST" },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          const data = refreshResult.data as { accessToken: string }
          api.dispatch(tokenReceived(data.accessToken))
          result = await baseQueryWithRetry(args, api, extraOptions)
        } else if (isRefreshRejected(refreshResult.error)) {
          api.dispatch(loggedOut())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQueryWithRetry(args, api, extraOptions)
    }
  }

  return result as Awaited<ReturnType<typeof baseQuery>>
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Seller",
    "SellerList",
    "Customer",
    "Category",
    "CategoryTree",
    "Catalog",
    "Product",
    "Listing",
    "Inventory",
    "Location",
    "Brand",
    "Cart",
    "Order",
  ],
  endpoints: () => ({}),
})
