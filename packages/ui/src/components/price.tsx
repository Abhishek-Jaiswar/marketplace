import { cn } from "@workspace/ui/lib/utils"
import { discountPercent, formatInr } from "@workspace/ui/lib/money"

const sizes = {
  sm: { price: "text-base", detail: "text-xs", gap: "gap-x-1.5" },
  md: { price: "text-xl", detail: "text-sm", gap: "gap-x-2" },
  lg: { price: "text-3xl", detail: "text-base", gap: "gap-x-3" },
  xl: { price: "text-5xl sm:text-6xl", detail: "text-lg", gap: "gap-x-4" },
} as const

export interface PriceProps {
  /** Selling price in paise. */
  amount: number
  /** Printed MRP in paise. Shown only when it exceeds the selling price. */
  mrp?: number
  size?: keyof typeof sizes
  /** Adds the "Inclusive of all taxes" line used on a product page. */
  showTaxNote?: boolean
  className?: string
}

export function Price({
  amount,
  mrp,
  size = "md",
  showTaxNote = false,
  className,
}: PriceProps) {
  const style = sizes[size]
  const percentOff = mrp ? discountPercent(mrp, amount) : 0

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className={cn("flex flex-wrap items-baseline", style.gap)}>
        <span
          className={cn(
            "font-bold text-foreground type-display tabular-nums",
            style.price
          )}
        >
          {formatInr(amount)}
        </span>
        {percentOff > 0 && mrp ? (
          <span className={cn("flex items-baseline gap-x-2", style.detail)}>
            <span className="text-muted-foreground">
              MRP <s className="tabular-nums">{formatInr(mrp)}</s>
            </span>
            <span className="font-semibold text-discount">
              {percentOff}% off
            </span>
          </span>
        ) : null}
      </div>
      {showTaxNote ? (
        <p className={cn("text-muted-foreground", style.detail)}>
          Inclusive of all taxes
        </p>
      ) : null}
    </div>
  )
}
