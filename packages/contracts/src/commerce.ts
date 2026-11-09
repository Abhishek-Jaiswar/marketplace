import { z } from "zod"

import { paginationQuerySchema } from "./common.js"

export const MAX_LINE_QUANTITY = 10
const FREE_SHIPPING_FROM_PAISE = 49900
const SHIPPING_FEE_PAISE = 4900

/** Delivery charge for a basket, in paise. */
export const shippingFor = (subtotal: number): number =>
  subtotal >= FREE_SHIPPING_FROM_PAISE || subtotal === 0
    ? 0
    : SHIPPING_FEE_PAISE

const listingId = z.string().trim().min(1, "Listing ID is required")
const quantity = z
  .number()
  .int()
  .positive("Quantity must be at least 1")
  .max(MAX_LINE_QUANTITY, `You can buy up to ${MAX_LINE_QUANTITY} at a time`)

export const addCartItemSchema = z.object({
  sellerListingId: listingId,
  quantity: quantity.default(1),
})

export const updateCartItemSchema = z.object({ quantity })

export const mergeCartSchema = z.object({
  items: z.array(z.object({ sellerListingId: listingId, quantity })).max(50),
})

export const paymentChoiceSchema = z.enum(["COD", "ONLINE"])

export const checkoutSchema = z.object({
  addressId: z.string().trim().min(1, "Choose a delivery address"),
  paymentMethod: paymentChoiceSchema,
  idempotencyKey: z.string().trim().min(8).max(100),
  /** The total the shopper saw, so a price change cannot surprise them. */
  expectedTotal: z.number().int().nonnegative(),
})

export const orderNumberParamSchema = z.object({
  orderNumber: z.string().trim().min(1),
})

export const listOrdersQuerySchema = paginationQuerySchema(10)

export type AddCartItemInput = z.output<typeof addCartItemSchema>
export type MergeCartInput = z.output<typeof mergeCartSchema>
export type CheckoutInput = z.output<typeof checkoutSchema>
export type PaymentChoice = z.infer<typeof paymentChoiceSchema>
export type AddCartItemRequest = z.input<typeof addCartItemSchema>
export type CheckoutRequest = z.input<typeof checkoutSchema>

export interface CartLineView {
  id: string
  sellerListingId: string
  slug: string
  title: string
  option: string | null
  image: string | null
  seller: string
  price: number
  mrp: number
  quantity: number
  availableStock: number
  codEnabled: boolean
  isPurchasable: boolean
  priceChanged: boolean
}

export interface CartView {
  lines: CartLineView[]
  itemCount: number
  mrpTotal: number
  subtotal: number
  shippingTotal: number
  total: number
}

export interface OrderItemView {
  id: string
  title: string
  option: string | null
  slug: string | null
  imageUrl: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  status: string
}

export interface SellerOrderView {
  id: string
  sellerOrderNumber: string
  seller: string
  status: string
  shipByAt: string | null
  items: OrderItemView[]
}

export interface OrderAddress {
  recipientName: string
  phoneNumber: string | null
  street1: string
  street2: string | null
  landmark: string | null
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderSummaryView {
  orderNumber: string
  status: string
  placedAt: string | null
  grandTotal: number
  itemCount: number
  thumbnails: (string | null)[]
}

export interface OrderDetailView extends OrderSummaryView {
  subtotal: number
  shippingTotal: number
  taxTotal: number
  paymentMethod: string | null
  paymentStatus: string | null
  shippingAddress: OrderAddress
  sellerOrders: SellerOrderView[]
}
