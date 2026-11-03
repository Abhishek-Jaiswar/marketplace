import type {
  LocationType,
  InventoryChangeReason,
  ReservationStatus,
} from "@workspace/db"

export interface CreateLocationInput {
  name: string
  code: string
  type?: LocationType | undefined
  isPrimary?: boolean | undefined
  address?: {
    street1: string
    street2?: string | null | undefined
    landmark?: string | null | undefined
    city: string
    state: string
    postalCode: string
    country: string
    phoneNumber?: string | null | undefined
  } | undefined
}

export interface UpdateLocationInput {
  name?: string | undefined
  isPrimary?: boolean | undefined
  isActive?: boolean | undefined
  address?: {
    street1?: string | undefined
    street2?: string | null | undefined
    landmark?: string | null | undefined
    city?: string | undefined
    state?: string | undefined
    postalCode?: string | undefined
    country?: string | undefined
    phoneNumber?: string | null | undefined
  } | undefined
}

export interface ListLocationsQuery {
  sellerId?: string | undefined
  isActive?: boolean | undefined
}

export interface AdjustStockInput {
  sellerListingId: string
  locationId: string
  quantityDelta: number
  reason: InventoryChangeReason
  referenceType?: string | null | undefined
  referenceId?: string | null | undefined
  note?: string | null | undefined
  safetyStock?: number | undefined
  lowStockThreshold?: number | undefined
}

export interface ReserveItemRequest {
  sellerListingId: string
  quantity: number
  preferredLocationId?: string | undefined
}

export interface ReserveStockInput {
  items: ReserveItemRequest[]
  cartId?: string | null | undefined
  orderId?: string | null | undefined
  ttlMinutes?: number | undefined
}

export interface CommitReservationInput {
  reservationId: string
  orderId: string
}

export interface ReleaseReservationInput {
  reservationId: string
  reason?: string | undefined
}

export interface ListInventoryQuery {
  page?: number | undefined
  limit?: number | undefined
  sellerId?: string | undefined
  locationId?: string | undefined
  isLowStock?: boolean | undefined
}

export interface ListLedgerQuery {
  page?: number | undefined
  limit?: number | undefined
  inventoryItemId?: string | undefined
  reason?: InventoryChangeReason | undefined
}
