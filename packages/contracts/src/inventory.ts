import { z } from "zod"

import { paginationQuerySchema } from "./common.js"

export const locationTypeSchema = z.enum([
  "SELLER_WAREHOUSE",
  "PLATFORM_FULFILLMENT_CENTER",
  "STORE_RETAIL_POINT",
])

export const inventoryChangeReasonSchema = z.enum([
  "RESTOCK",
  "ORDER_RESERVED",
  "ORDER_FULFILLED",
  "ORDER_CANCELLED_RESTOCK",
  "RETURN_RESTOCK",
  "DAMAGE_WRITEOFF",
  "INVENTORY_AUDIT_ADJUSTMENT",
  "TRANSFER",
])

export type LocationType = z.infer<typeof locationTypeSchema>
export type InventoryChangeReason = z.infer<typeof inventoryChangeReasonSchema>

const addressSchema = z.object({
  street1: z.string().trim().min(1, "Street 1 is required").max(255),
  street2: z.string().trim().max(255).nullable().optional(),
  landmark: z.string().trim().max(255).nullable().optional(),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  postalCode: z.string().trim().min(3, "Valid postal code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100),
  phoneNumber: z.string().trim().max(20).nullable().optional(),
})

export const createLocationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Warehouse name must be at least 2 characters")
    .max(100),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z0-9_-]+$/,
      "Code must contain only uppercase alphanumeric characters, dashes or underscores"
    )
    .min(2)
    .max(50),
  type: locationTypeSchema.default("SELLER_WAREHOUSE"),
  isPrimary: z.boolean().default(false),
  address: addressSchema.optional(),
})

export const updateLocationSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
  address: addressSchema.partial().optional(),
})

export const adjustStockSchema = z.object({
  sellerListingId: z.string().trim().min(1, "Listing ID is required"),
  locationId: z.string().trim().min(1, "Location ID is required"),
  quantityDelta: z
    .number()
    .int()
    .refine((value) => value !== 0, "quantityDelta cannot be 0"),
  reason: inventoryChangeReasonSchema,
  referenceType: z.string().trim().max(100).nullable().optional(),
  referenceId: z.string().trim().max(100).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
  safetyStock: z.number().int().nonnegative().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
})

export const reserveStockSchema = z.object({
  items: z
    .array(
      z.object({
        sellerListingId: z.string().trim().min(1, "Listing ID is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        preferredLocationId: z.string().trim().optional(),
      })
    )
    .min(1, "At least one item must be reserved"),
  cartId: z.string().trim().nullable().optional(),
  orderId: z.string().trim().nullable().optional(),
  ttlMinutes: z.number().int().min(1).max(60).default(15),
})

export const commitReservationSchema = z.object({
  reservationId: z.string().trim().min(1, "Reservation ID is required"),
  orderId: z.string().trim().min(1, "Order ID is required"),
})

export const releaseReservationSchema = z.object({
  reservationId: z.string().trim().min(1, "Reservation ID is required"),
})

export const listInventoryQuerySchema = paginationQuerySchema(20).extend({
  sellerId: z.string().trim().optional(),
  locationId: z.string().trim().optional(),
})

export const listLedgerQuerySchema = paginationQuerySchema(50).extend({
  inventoryItemId: z.string().trim().optional(),
  reason: inventoryChangeReasonSchema.optional(),
})

// Parsed values, as the API sees them after defaults are applied.
export type CreateLocationInput = z.output<typeof createLocationSchema>
export type UpdateLocationInput = z.output<typeof updateLocationSchema>
export type AdjustStockInput = z.output<typeof adjustStockSchema>
export type ReserveStockInput = z.output<typeof reserveStockSchema>
export type CommitReservationInput = z.output<typeof commitReservationSchema>
export type ReleaseReservationInput = z.output<typeof releaseReservationSchema>
export type ListInventoryQuery = z.output<typeof listInventoryQuerySchema>
export type ListLedgerQuery = z.output<typeof listLedgerQuerySchema>

// Request bodies and params, as clients send them.
export type CreateLocationRequest = z.input<typeof createLocationSchema>
export type AdjustStockRequest = z.input<typeof adjustStockSchema>
export type ListInventoryParams = z.input<typeof listInventoryQuerySchema>
export type ListLedgerParams = z.input<typeof listLedgerQuerySchema>

export interface InventoryLocation {
  id: string
  name: string
  code: string
  type: LocationType
  isPrimary: boolean
  isActive: boolean
  addressId?: string | null
  address?: {
    id: string
    street1: string
    street2?: string | null
    city: string
    state: string
    postalCode: string
    country: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: string
  sellerListingId: string
  sellerListing?: {
    id: string
    sellerSku: string
    sellingPrice: number
    variant?: {
      sku: string
      attributes: Record<string, unknown>
    }
  }
  locationId: string
  location?: {
    id: string
    name: string
    code: string
  }
  onHand: number
  reserved: number
  safetyStock: number
  lowStockThreshold: number
  createdAt: string
  updatedAt: string
}

export interface InventoryLedgerEntry {
  id: string
  inventoryItemId: string
  quantityDelta: number
  balanceAfter: number
  reason: InventoryChangeReason
  referenceType?: string | null
  referenceId?: string | null
  note?: string | null
  performedBy?: {
    id: string
    firstName: string
    lastName?: string | null
    email: string
  } | null
  createdAt: string
}
