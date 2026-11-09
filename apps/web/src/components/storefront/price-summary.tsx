import { formatInr } from "@workspace/ui/lib/money"

export function PriceSummary({
  mrpTotal,
  subtotal,
  shippingTotal,
  total,
}: {
  mrpTotal: number
  subtotal: number
  shippingTotal: number
  total: number
}) {
  return (
    <>
      <h2 className="font-semibold">Price details</h2>
      <dl className="mt-2 space-y-1.5">
        <div className="flex justify-between">
          <dt>Price, MRP</dt>
          <dd className="tabular-nums">{formatInr(mrpTotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount</dt>
          <dd className="text-discount tabular-nums">
            −{formatInr(mrpTotal - subtotal)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="tabular-nums">
            {shippingTotal === 0 ? "Free" : formatInr(shippingTotal)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatInr(total)}</dd>
        </div>
      </dl>
      <p className="mt-1 text-sm text-muted-foreground">
        Inclusive of all taxes
      </p>
    </>
  )
}
