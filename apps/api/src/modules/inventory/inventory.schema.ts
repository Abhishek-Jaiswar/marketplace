import { z } from "zod"

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
  name: z.string().trim().min(2, "Warehouse name must be at least 2 characters").max(100),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase alphanumeric characters, dashes or underscores")
    .min(2)
    .max(50),
  type: z
    .enum(["SELLER_WAREHOUSE", "PLATFORM_FULFILLMENT_CENTER", "STORE_RETAIL_POINT"])
    .optional()
    .default("SELLER_WAREHOUSE"),
  isPrimary: z.boolean().optional().default(false),
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
    .refine((val) => val !== 0, "quantityDelta cannot be 0"),
  reason: z.enum([
    "RESTOCK",
    "ORDER_RESERVED",
    "ORDER_FULFILLED",
    "ORDER_CANCELLED_RESTOCK",
    "RETURN_RESTOCK",
    "DAMAGE_WRITEOFF",
    "INVENTORY_AUDIT_ADJUSTMENT",
    "TRANSFER",
  ]),
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
  ttlMinutes: z.number().int().min(1).max(60).optional().default(15),
})

export const commitReservationSchema = z.object({
  reservationId: z.string().trim().min(1, "Reservation ID is required"),
  orderId: z.string().trim().min(1, "Order ID is required"),
})

export const releaseReservationSchema = z.object({
  reservationId: z.string().trim().min(1, "Reservation ID is required"),
  reason: z.string().trim().max(255).optional(),
})

export const listInventoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  sellerId: z.string().trim().optional(),
  locationId: z.string().trim().optional(),
  isLowStock: z
    .string()
    .optional()
    .transform((val) => val === "true"),
})

export const listLedgerQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
  inventoryItemId: z.string().trim().optional(),
  reason: z
    .enum([
      "RESTOCK",
      "ORDER_RESERVED",
      "ORDER_FULFILLED",
      "ORDER_CANCELLED_RESTOCK",
      "RETURN_RESTOCK",
      "DAMAGE_WRITEOFF",
      "INVENTORY_AUDIT_ADJUSTMENT",
      "TRANSFER",
    ])
    .optional(),
})
