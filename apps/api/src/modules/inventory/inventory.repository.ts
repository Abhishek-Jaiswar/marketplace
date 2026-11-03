import { and, db, type Condition } from "@workspace/db"
import type {
  CreateLocationInput,
  UpdateLocationInput,
  AdjustStockInput,
  ListInventoryQuery,
  ListLedgerQuery,
} from "./inventory.types.js"
import { BadRequestError, NotFoundError } from "../../utils/errors/index.js"

class InventoryRepository {
  // ---------------- Locations ----------------
  async findLocationById(id: string) {
    return await db.orm.public.InventoryLocation
      .include("address")
      .first({ id })
  }

  async findLocationByCode(code: string) {
    return await db.orm.public.InventoryLocation.where({ code }).first()
  }

  async findLocations(sellerId?: string, isActive?: boolean) {
    const where = (loc: any) => {
      const conditions: Condition[] = []
      if (sellerId !== undefined) {
        conditions.push(loc.sellerId.eq(sellerId))
      }
      if (isActive !== undefined) {
        conditions.push(loc.isActive.eq(isActive))
      }
      return conditions.length > 0 ? and(...conditions) : and()
    }

    return await db.orm.public.InventoryLocation
      .where(where)
      .include("address")
      .orderBy((l) => l.name.asc())
      .all()
  }

  async createLocation(sellerId: string | null, data: CreateLocationInput) {
    return await db.transaction(async (tx) => {
      let addressId: string | null = null

      if (data.address) {
        const address = await tx.orm.public.Address.create({
          street1: data.address.street1,
          street2: data.address.street2 ?? null,
          landmark: data.address.landmark ?? null,
          city: data.address.city,
          state: data.address.state,
          postalCode: data.address.postalCode,
          country: data.address.country,
          phoneNumber: data.address.phoneNumber ?? null,
        })
        addressId = address.id
      }

      return await tx.orm.public.InventoryLocation
        .include("address")
        .create({
          sellerId,
          name: data.name,
          code: data.code,
          type: data.type ?? "SELLER_WAREHOUSE",
          isPrimary: data.isPrimary ?? false,
          isActive: true,
          addressId,
        })
    })
  }

  async updateLocation(id: string, data: UpdateLocationInput) {
    return await db.transaction(async (tx) => {
      const location = await tx.orm.public.InventoryLocation.first({ id })
      if (!location) throw new NotFoundError("Inventory location not found")

      if (data.address) {
        if (location.addressId) {
          await tx.orm.public.Address.where({ id: location.addressId }).update({
            ...(data.address.street1 && { street1: data.address.street1 }),
            ...(data.address.street2 !== undefined && { street2: data.address.street2 ?? null }),
            ...(data.address.landmark !== undefined && { landmark: data.address.landmark ?? null }),
            ...(data.address.city && { city: data.address.city }),
            ...(data.address.state && { state: data.address.state }),
            ...(data.address.postalCode && { postalCode: data.address.postalCode }),
            ...(data.address.country && { country: data.address.country }),
            ...(data.address.phoneNumber !== undefined && { phoneNumber: data.address.phoneNumber ?? null }),
          })
        } else {
          const newAddress = await tx.orm.public.Address.create({
            street1: data.address.street1 || "",
            street2: data.address.street2 ?? null,
            landmark: data.address.landmark ?? null,
            city: data.address.city || "",
            state: data.address.state || "",
            postalCode: data.address.postalCode || "",
            country: data.address.country || "",
            phoneNumber: data.address.phoneNumber ?? null,
          })
          await tx.orm.public.InventoryLocation.where({ id }).update({
            addressId: newAddress.id,
          })
        }
      }

      return await tx.orm.public.InventoryLocation
        .include("address")
        .where({ id })
        .update({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        })
    })
  }

  // ---------------- Inventory Items ----------------
  async findInventoryItem(sellerListingId: string, locationId: string) {
    return await db.orm.public.InventoryItem.where({ sellerListingId, locationId }).first()
  }

  async findInventoryItemById(id: string) {
    return await db.orm.public.InventoryItem
      .include("sellerListing", (l) => l.include("variant", (v) => v.select("sku", "productId")))
      .include("location", (loc) => loc.select("id", "name", "code"))
      .first({ id })
  }

  async findInventoryItemsByListing(sellerListingId: string) {
    return await db.orm.public.InventoryItem
      .where({ sellerListingId })
      .include("location", (loc) => loc.select("id", "name", "code"))
      .all()
  }

  async findInventory(params: ListInventoryQuery) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const skip = (page - 1) * limit
    const { locationId } = params

    const where = (item: any) => {
      const conditions: Condition[] = []
      if (locationId !== undefined) {
        conditions.push(item.locationId.eq(locationId))
      }
      return conditions.length > 0 ? and(...conditions) : and()
    }

    const query = db.orm.public.InventoryItem
      .where(where)
      .offset(skip)
      .limit(limit)
      .include("sellerListing", (l) => l.include("variant", (v) => v.select("sku", "attributes")))
      .include("location", (loc) => loc.select("id", "name", "code"))
      .orderBy((i) => i.createdAt.desc())

    const [items, totals] = await Promise.all([
      query.all(),
      db.orm.public.InventoryItem.where(where).aggregate((aggregate) => ({ total: aggregate.count() })),
    ])

    return {
      items,
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
    }
  }

  // ---------------- Double-Entry Stock Adjustment & Ledger ----------------
  async executeStockAdjustment(params: AdjustStockInput & { performedById?: string | null }) {
    return await db.transaction(async (tx) => {
      let item = await tx.orm.public.InventoryItem
        .where({
          sellerListingId: params.sellerListingId,
          locationId: params.locationId,
        })
        .first()

      if (!item) {
        if (params.quantityDelta < 0) {
          throw new BadRequestError("Cannot reduce stock for an uninitialized inventory item")
        }
        item = await tx.orm.public.InventoryItem.create({
          sellerListingId: params.sellerListingId,
          locationId: params.locationId,
          onHand: 0,
          reserved: 0,
          safetyStock: params.safetyStock ?? 0,
          lowStockThreshold: params.lowStockThreshold ?? 5,
        })
      }

      const newOnHand = item.onHand + params.quantityDelta
      if (newOnHand < 0) {
        throw new BadRequestError(`Insufficient stock. Current on-hand is ${item.onHand}, delta is ${params.quantityDelta}`)
      }

      if (newOnHand - item.reserved < 0) {
        throw new BadRequestError(`Cannot reduce stock below active reservations (${item.reserved} units reserved)`)
      }

      const updatedItem = await tx.orm.public.InventoryItem
        .where({ id: item.id })
        .update({
          onHand: newOnHand,
          ...(params.safetyStock !== undefined && { safetyStock: params.safetyStock }),
          ...(params.lowStockThreshold !== undefined && { lowStockThreshold: params.lowStockThreshold }),
        })

      const ledgerEntry = await tx.orm.public.InventoryLedger.create({
        inventoryItemId: item.id,
        quantityDelta: params.quantityDelta,
        balanceAfter: newOnHand,
        reason: params.reason,
        referenceType: params.referenceType ?? null,
        referenceId: params.referenceId ?? null,
        note: params.note ?? null,
        performedById: params.performedById ?? null,
      })

      return { item: updatedItem, ledgerEntry }
    })
  }

  // ---------------- Atomic Reservation Engine ----------------
  async createReservation(
    inventoryItemId: string,
    quantity: number,
    expiresAt: Date,
    cartId?: string | null,
    orderId?: string | null
  ) {
    return await db.transaction(async (tx) => {
      const item = await tx.orm.public.InventoryItem.first({ id: inventoryItemId })
      if (!item) throw new NotFoundError("Inventory item not found")

      const available = item.onHand - item.reserved - item.safetyStock
      if (available < quantity) {
        throw new BadRequestError(
          `Insufficient available stock for reservation. Requested: ${quantity}, Available: ${Math.max(0, available)}`
        )
      }

      const updatedItem = await tx.orm.public.InventoryItem
        .where({ id: item.id })
        .update({
          reserved: item.reserved + quantity,
        })

      const reservation = await tx.orm.public.InventoryReservation.create({
        inventoryItemId: item.id,
        quantity,
        cartId: cartId ?? null,
        orderId: orderId ?? null,
        expiresAt: expiresAt.toISOString(),
        status: "PENDING",
      })

      return { reservation, item: updatedItem }
    })
  }

  async commitReservation(reservationId: string, orderId: string, performedById?: string | null) {
    return await db.transaction(async (tx) => {
      const reservation = await tx.orm.public.InventoryReservation.first({ id: reservationId })
      if (!reservation) throw new NotFoundError("Reservation not found")

      if (reservation.status !== "PENDING") {
        throw new BadRequestError(`Cannot commit reservation with status ${reservation.status}`)
      }

      const item = await tx.orm.public.InventoryItem.first({ id: reservation.inventoryItemId })
      if (!item) throw new NotFoundError("Associated inventory item not found")

      const newOnHand = item.onHand - reservation.quantity
      const newReserved = Math.max(0, item.reserved - reservation.quantity)

      const updatedItem = await tx.orm.public.InventoryItem
        .where({ id: item.id })
        .update({
          onHand: newOnHand,
          reserved: newReserved,
        })

      const updatedReservation = await tx.orm.public.InventoryReservation
        .where({ id: reservation.id })
        .update({
          status: "COMMITTED",
          orderId,
        })

      const ledgerEntry = await tx.orm.public.InventoryLedger.create({
        inventoryItemId: item.id,
        quantityDelta: -reservation.quantity,
        balanceAfter: newOnHand,
        reason: "ORDER_FULFILLED",
        referenceType: "ORDER",
        referenceId: orderId,
        note: `Committed reservation ${reservation.id}`,
        performedById: performedById ?? null,
      })

      return { reservation: updatedReservation, item: updatedItem, ledgerEntry }
    })
  }

  async releaseReservation(reservationId: string, reason = "ORDER_CANCELLED_RESTOCK") {
    return await db.transaction(async (tx) => {
      const reservation = await tx.orm.public.InventoryReservation.first({ id: reservationId })
      if (!reservation) throw new NotFoundError("Reservation not found")

      if (reservation.status !== "PENDING") {
        return reservation // Already resolved
      }

      const item = await tx.orm.public.InventoryItem.first({ id: reservation.inventoryItemId })
      if (item) {
        const newReserved = Math.max(0, item.reserved - reservation.quantity)
        await tx.orm.public.InventoryItem
          .where({ id: item.id })
          .update({ reserved: newReserved })
      }

      return await tx.orm.public.InventoryReservation
        .where({ id: reservation.id })
        .update({
          status: "RELEASED",
        })
    })
  }

  // ---------------- Ledger Queries ----------------
  async findLedgerEntries(params: ListLedgerQuery) {
    const page = params.page ?? 1
    const limit = params.limit ?? 50
    const skip = (page - 1) * limit
    const { inventoryItemId, reason } = params

    const where = (entry: any) => {
      const conditions: Condition[] = []
      if (inventoryItemId !== undefined) {
        conditions.push(entry.inventoryItemId.eq(inventoryItemId))
      }
      if (reason !== undefined) {
        conditions.push(entry.reason.eq(reason))
      }
      return conditions.length > 0 ? and(...conditions) : and()
    }

    const query = db.orm.public.InventoryLedger
      .where(where)
      .offset(skip)
      .limit(limit)
      .orderBy((l) => l.createdAt.desc())
      .include("performedBy", (u) => u.select("id", "firstName", "lastName", "email"))

    const [items, totals] = await Promise.all([
      query.all(),
      db.orm.public.InventoryLedger.where(where).aggregate((aggregate) => ({ total: aggregate.count() })),
    ])

    return {
      items,
      total: totals.total,
      page,
      limit,
      totalPages: Math.ceil(totals.total / limit),
    }
  }
}

export const inventoryRepository = new InventoryRepository()
