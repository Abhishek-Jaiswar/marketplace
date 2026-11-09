type QueryValue = string | number | boolean | null | undefined

/** Builds `?a=1&b=2` from defined values, or "" when there are none. */
export function toQueryString(params: object | void): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params ?? {}) as [
    string,
    QueryValue,
  ][]) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value))
    }
  }

  const query = search.toString()
  return query ? `?${query}` : ""
}
