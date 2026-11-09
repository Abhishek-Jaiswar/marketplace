/**
 * Placeholder data for features whose APIs do not exist yet. Everything mock
 * in the storefront comes from this file or `mock-cart.ts`.
 *
 * Replace when the API ships (tables already exist, see ADR 0006):
 * - ratings, reviews:   ProductReview, Product.ratingCount / ratingTotal
 * - delivery estimates: Shipment and a carrier serviceability API
 * - offers:             Coupon
 * - deal end time:      Collection.endsAt
 * - cart:               Cart, CartItem
 *
 * Values derive from the product slug, so they stay the same between loads.
 */

function hash(text: string): number {
  let value = 7
  for (const character of text) {
    value = (value * 31 + character.charCodeAt(0)) % 1_000_003
  }
  return value
}

export interface MockRating {
  rating: number
  count: number
}

export function mockRating(slug: string): MockRating {
  const value = hash(slug)
  return { rating: 3.6 + (value % 13) / 10, count: 40 + (value % 4800) }
}

export interface MockReview {
  name: string
  rating: number
  title: string
  body: string
  date: string
}

const REVIEW_POOL = [
  {
    name: "Priya N.",
    title: "Worth the price",
    body: "Good quality for what it costs. Packaging was neat and it arrived on time.",
  },
  {
    name: "Rahul V.",
    title: "Does what it says",
    body: "Using it daily for a month now with no problems. Matches the description.",
  },
  {
    name: "Ananya D.",
    title: "Happy with this",
    body: "Looks better in person. The seller answered my question the same day.",
  },
  {
    name: "Vikram R.",
    title: "Decent, could be better",
    body: "Works well overall. Instructions could be clearer, but setup was quick.",
  },
  {
    name: "Sneha K.",
    title: "Bought a second one",
    body: "Liked it enough to order another as a gift. Delivery was faster than expected.",
  },
  {
    name: "Imran S.",
    title: "Solid build",
    body: "Feels sturdy and well finished. Good value compared with shops near me.",
  },
]

const REVIEW_DATES = ["2 weeks ago", "1 month ago", "2 months ago"]
const REVIEWS_SHOWN = 3

export function mockReviews(slug: string): MockReview[] {
  const start = hash(slug) % REVIEW_POOL.length
  return Array.from({ length: REVIEWS_SHOWN }, (_, index) => {
    const review = REVIEW_POOL[(start + index) % REVIEW_POOL.length]!
    return {
      ...review,
      rating: 5 - ((hash(slug) + index) % 2),
      date: REVIEW_DATES[index]!,
    }
  })
}

/** Share of reviews at 5, 4, 3, 2 and 1 stars, as whole percentages. */
export function mockRatingBreakdown(rating: number): number[] {
  const five = Math.round((rating - 3) * 32)
  const four = Math.round((5 - rating) * 28 + 12)
  const low = Math.max(0, 100 - five - four)
  return [
    five,
    four,
    Math.round(low * 0.55),
    Math.round(low * 0.25),
    Math.round(low * 0.2),
  ]
}

const DAY_MS = 24 * 60 * 60 * 1000
const TRANSIT_DAYS = 3

export function mockDeliveryDate(handlingDays: number): string {
  return new Date(
    Date.now() + (handlingDays + TRANSIT_DAYS) * DAY_MS
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  })
}

const EMI_MONTHS = 12
const EMI_MINIMUM_PAISE = 300000

export function mockOffers(pricePaise: number): string[] {
  const offers = [
    "10% instant discount with select bank credit cards, up to ₹1,500",
    "Flat ₹100 off your first order with code WELCOME100",
  ]
  if (pricePaise >= EMI_MINIMUM_PAISE) {
    const monthly = Math.ceil(pricePaise / 100 / EMI_MONTHS)
    offers.push(
      `No-cost EMI from ₹${monthly.toLocaleString("en-IN")} a month for ${EMI_MONTHS} months`
    )
  }
  return offers
}

export const mockPromotions = [
  {
    title: "10% off with bank cards",
    detail: "On select credit cards, up to ₹1,500",
    tint: "bg-tint-sky",
  },
  {
    title: "Free delivery over ₹499",
    detail: "On orders from every seller",
    tint: "bg-tint-wheat",
  },
  {
    title: "7-day easy returns",
    detail: "On most products",
    tint: "bg-tint-pista",
  },
] as const
