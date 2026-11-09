import { beforeEach, describe, expect, it, vi } from "vitest"

import { makeStore } from "../store"
import { baseApi } from "./baseApi"

vi.mock("./retry-policy", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./retry-policy")>()),
  retryDelay: () => 0,
}))

const api = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    readThing: builder.query<{ ok: boolean }, void>({ query: () => "/thing" }),
    writeThing: builder.mutation<{ ok: boolean }, void>({
      query: () => ({ url: "/thing", method: "POST" }),
    }),
  }),
})

const json = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const fetchMock = vi.fn<typeof fetch>()
const paths = () =>
  fetchMock.mock.calls.map(
    ([request]) => new URL((request as Request).url).pathname
  )

function storeWithSession() {
  const store = makeStore()
  store.dispatch({ type: "auth/tokenReceived", payload: "old-token" })
  return store
}

const read = (store: ReturnType<typeof makeStore>) =>
  store.dispatch(api.endpoints.readThing.initiate())

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal("fetch", fetchMock)
})

describe("retries", () => {
  it("recovers a read from a transient failure", async () => {
    fetchMock
      .mockResolvedValueOnce(json(503))
      .mockResolvedValueOnce(json(200, { ok: true }))

    const result = await read(makeStore())

    expect(result.data).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("recovers a read from a network failure", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(json(200, { ok: true }))

    expect((await read(makeStore())).data).toEqual({ ok: true })
  })

  it("gives up after three retries and reports the error", async () => {
    fetchMock.mockImplementation(async () => json(503))

    const result = await read(makeStore())

    expect(result.error).toMatchObject({ status: 503 })
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it("does not repeat a request that failed for good", async () => {
    fetchMock.mockResolvedValueOnce(json(404))

    await read(makeStore())

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("never repeats a write", async () => {
    fetchMock.mockImplementation(async () => json(503))

    const result = await makeStore().dispatch(
      api.endpoints.writeThing.initiate()
    )

    expect(result).toHaveProperty("error")
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe("session refresh", () => {
  it("refreshes an expired token and replays the request", async () => {
    fetchMock
      .mockResolvedValueOnce(json(401))
      .mockResolvedValueOnce(json(200, { accessToken: "new-token" }))
      .mockResolvedValueOnce(json(200, { ok: true }))

    const store = storeWithSession()
    const result = await read(store)

    expect(result.data).toEqual({ ok: true })
    expect(paths()).toEqual(["/api/thing", "/api/users/refresh", "/api/thing"])
    expect(store.getState().auth.accessToken).toBe("new-token")
  })

  it("signs out when the server rejects the refresh", async () => {
    fetchMock.mockResolvedValueOnce(json(401)).mockResolvedValueOnce(json(401))

    const store = storeWithSession()
    await read(store)

    expect(store.getState().auth.isAuthenticated).toBe(false)
  })

  it("keeps the session when the refresh cannot reach the server", async () => {
    fetchMock
      .mockResolvedValueOnce(json(401))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))

    const store = storeWithSession()
    await read(store)

    expect(store.getState().auth.isAuthenticated).toBe(true)
    expect(store.getState().auth.accessToken).toBe("old-token")
  })
})
