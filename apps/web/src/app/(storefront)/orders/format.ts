/** Stored timestamps are UTC without a zone marker. */
export function formatOrderDate(value: string): string {
  const utc = /[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`
  return new Date(utc).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  })
}
