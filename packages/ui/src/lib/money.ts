const inr = (fractionDigits: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

const wholeRupees = inr(0)
const withPaise = inr(2)

/** Formats integer paise with Indian digit grouping, such as ₹1,24,999. */
export function formatInr(paise: number): string {
  return (paise % 100 === 0 ? wholeRupees : withPaise).format(paise / 100)
}

/** Whole-number percentage saved against MRP, rounded down. */
export function discountPercent(mrp: number, price: number): number {
  return mrp > price ? Math.floor(((mrp - price) / mrp) * 100) : 0
}
