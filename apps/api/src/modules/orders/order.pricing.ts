const BPS = 10_000

export interface GstSplit {
  taxableAmount: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
}

/**
 * Splits a tax-inclusive amount. Within one state GST is half central, half
 * state; between states it is all integrated. Every paisa is accounted for.
 */
export function splitGst(
  lineTotal: number,
  gstRateBps: number,
  isIntraState: boolean
): GstSplit {
  const taxableAmount = Math.round((lineTotal * BPS) / (BPS + gstRateBps))
  const tax = lineTotal - taxableAmount

  if (!isIntraState) {
    return { taxableAmount, cgstAmount: 0, sgstAmount: 0, igstAmount: tax }
  }

  const cgstAmount = Math.floor(tax / 2)
  return {
    taxableAmount,
    cgstAmount,
    sgstAmount: tax - cgstAmount,
    igstAmount: 0,
  }
}

export const commissionFor = (lineTotal: number, rateBps: number): number =>
  Math.round((lineTotal * rateBps) / BPS)

export interface CommissionRuleRates {
  sellerId: string | null
  categoryId: string | null
  rateBps: number
}

/** Most specific rule wins: seller and category, seller, category, default. */
export function resolveCommissionBps(
  rules: CommissionRuleRates[],
  sellerId: string,
  categoryId: string
): number {
  const match = (seller: string | null, category: string | null) =>
    rules.find(
      (rule) => rule.sellerId === seller && rule.categoryId === category
    )

  const rule =
    match(sellerId, categoryId) ??
    match(sellerId, null) ??
    match(null, categoryId) ??
    match(null, null)
  return rule?.rateBps ?? 0
}

export const isSameState = (a: string, b: string | null | undefined) =>
  a.trim().toLowerCase() === b?.trim().toLowerCase()
