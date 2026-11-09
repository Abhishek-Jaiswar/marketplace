import { and, db } from "@workspace/db"
import type {
  AdjustStockInput,
  CreateLocationInput,
  ListInventoryQuery,
  ListLedgerQuery,
  ReserveStockInput,
  UpdateLocationInput,
} from "@workspace/contracts/inventory"

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors/index.js"
import { availableStock, pickReservationItem } from "./inventory.allocation.js"

interface ReservationOptions {
  expiresAt: Date
  cartId?: string | null | undefined
  orderId?: string | null | undefined
}

interface SellerScope {
  sellerId?: string | undefined
}

// Prisma budgets reject unbounded SELECTs; no seller approaches this many locations.
const MAX_LOCATIONS = 200

const toPage = <Item>(
  items: Item[],
  total: number,
  page: number,
  limit: number
) => ({
  items,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
})

class InventoryRepository {
  async findLocationById(id: string) {
    return await db.orm.public.InventoryLocation.include("address").first({
      id,
    })
  }

  async assertLocationCodeAvailable(code: string): Promise<void> {
    const existing = await db.orm.public.InventoryLocation.where({
      code,
    }).first()
    if (existing) {
      throw new ConflictError(`Location code '${code}' is already registered`)
    }
  }

  async findLocations(sellerId?: string) {
    return await db.orm.public.InventoryLocation.where((location) =>
      sellerId === undefined ? and() : location.sellerId.eq(sellerId)
    )
      .include("address")
      .orderBy((location) => location.name.asc())
      .limit(MAX_LOCATIONS)
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

      return await tx.orm.public.InventoryLocation.include("address").create({
        sellerId,
        name: data.name,
        code: data.code,
        type: data.type,
        isPrimary: data.isPrimary,
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
        const { address } = data
        if (location.addressId) {
          await tx.orm.public.Address.where({ id: location.addressId }).update({
            ...(address.street1 && { street1: address.street1 }),
            ...(address.street2 !== undefined && {
              street2: address.street2 ?? null,
            }),
            ...(address.landmark !== undefined && {
              landmark: address.landmark ?? null,
            }),
            ...(address.city && { city: address.city }),
            ...(address.state && { state: address.state }),
            ...(address.postalCode && { postalCode: address.postalCode }),
            ...(address.country && { country: address.country }),
            ...(address.phoneNumber !== undefined && {
              phoneNumber: address.phoneNumber ?? null,
            }),
          })
        } else {
          const newAddress = await tx.orm.public.Address.create({
            street1: address.street1 || "",
            street2: address.street2 ?? null,
            landmark: address.landmark ?? null,
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "",
            phoneNumber: address.phoneNumber ?? null,
          })
          await tx.orm.public.InventoryLocation.where({ id }).update({
            addressId: newAddress.id,
          })
        }
      }

      return await tx.orm.public.InventoryLocation.include("address")
        .where({ id })
        .update({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
        })
    })
  }

  async findInventory(params: ListInventoryQuery & SellerScope) {
    const { page, limit, locationId, sellerId } = params

    const scoped = db.orm.public.InventoryItem.where((item) =>
      and(
        ...(locationId === undefined ? [] : [item.locationId.eq(locationId)]),
        ...(sellerId === undefined
          ? []
          : [
              item.sellerListing.some((listing) =>
                listing.sellerId.eq(sellerId)
              ),
            ])
      )
    )

    const [items, totals] = await Promise.all([
      scoped
        .offset((page - 1) * limit)
        .limit(limit)
        .include("sellerListing", (listing) =>
          listing.include("variant", (variant) =>
            variant.select("sku", "attributes")
          )
        )
        .include("location", (location) =>
          location.select("id", "name", "code")
        )
        .orderBy((item) => item.createdAt.desc())
        .all(),
      scoped.aggregate((aggregate) => ({ total: aggregate.count() })),
    ])

    return toPage(items, totals.total, page, limit)
  }

  async findLedgerEntries(params: ListLedgerQuery & SellerScope) {
    const { page, limit, inventoryItemId, reason, sellerId } = params

    const scoped = db.orm.public.InventoryLedger.where((entry) =>
      and(
        ...(inventoryItemId === undefined
          ? []
          : [entry.inventoryItemId.eq(inventoryItemId)]),
        ...(reason === undefined ? [] : [entry.reason.eq(reason)]),
        ...(sellerId === undefined
          ? []
          : [
              entry.inventoryItem.some((item) =>
                item.sellerListing.some((listing) =>
                  listing.sellerId.eq(sellerId)
                )
              ),
            ])
      )
    )

    const [items, totals] = await Promise.all([
      scoped
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy((entry) => entry.createdAt.desc())
        .include("performedBy", (user) =>
          user.select("id", "firstName", "lastName", "email")
        )
        .all(),
      scoped.aggregate((aggregate) => ({ total: aggregate.count() })),
    ])

    return toPage(items, totals.total, page, limit)
  }

  async executeStockAdjustment(
    params: AdjustStockInput & { performedById: string }
  ) {
    return await db.transaction(async (tx) => {
      let item = await tx.orm.public.InventoryItem.where({
        sellerListingId: params.sellerListingId,
        locationId: params.locationId,
      })
        .forNoKeyUpdate()
        .first()

      if (!item) {
        if (params.quantityDelta < 0) {
          throw new BadRequestError(
            "Cannot reduce stock for an uninitialized inventory item"
          )
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
        throw new BadRequestError(
          `Insufficient stock. Current on-hand is ${item.onHand}, delta is ${params.quantityDelta}`
        )
      }

      if (newOnHand - item.reserved < 0) {
        throw new BadRequestError(
          `Cannot reduce stock below active reservations (${item.reserved} units reserved)`
        )
      }

      const updatedItem = await tx.orm.public.InventoryItem.where({
        id: item.id,
      }).update({
        onHand: newOnHand,
        ...(params.safetyStock !== undefined && {
          safetyStock: params.safetyStock,
        }),
        ...(params.lowStockThreshold !== undefined && {
          lowStockThreshold: params.lowStockThreshold,
        }),
      })

      const ledgerEntry = await tx.orm.public.InventoryLedger.create({
        inventoryItemId: item.id,
        quantityDelta: params.quantityDelta,
        balanceAfter: newOnHand,
        reason: params.reason,
        referenceType: params.referenceType ?? null,
        referenceId: params.referenceId ?? null,
        note: params.note ?? null,
        performedById: params.performedById,
      })

      return { item: updatedItem, ledgerEntry }
    })
  }

  /**
   * Reserves every requested line or none. Rows are locked before stock is
   * read so concurrent checkouts cannot oversell, and listings are visited in
   * a fixed order so two multi-line reservations cannot deadlock.
   */
  async createReservations(
    requests: ReserveStockInput["items"],
    { expiresAt, cartId, orderId }: ReservationOptions
  ) {
    const orderedRequests = [...requests].sort((a, b) =>
      a.sellerListingId.localeCompare(b.sellerListingId)
    )

    return await db.transaction(async (tx) => {
      const reservations = []

      for (const request of orderedRequests) {
        const candidates = await tx.orm.public.InventoryItem.where({
          sellerListingId: request.sellerListingId,
        })
          .orderBy((item) => item.id.asc())
          .limit(MAX_LOCATIONS)
          .forNoKeyUpdate()
          .all()

        const target = pickReservationItem(
          candidates,
          request.preferredLocationId
        )
        if (!target) {
          throw new BadRequestError(
            `No stocked inventory location found for listing '${request.sellerListingId}'`
          )
        }

        const available = availableStock(target)
        if (available < request.quantity) {
          throw new BadRequestError(
            `Insufficient available stock for reservation. Requested: ${request.quantity}, Available: ${Math.max(0, available)}`
          )
        }

        await tx.orm.public.InventoryItem.where({ id: target.id }).update({
          reserved: target.reserved + request.quantity,
        })

        reservations.push(
          await tx.orm.public.InventoryReservation.create({
            inventoryItemId: target.id,
            quantity: request.quantity,
            cartId: cartId ?? null,
            orderId: orderId ?? null,
            expiresAt: expiresAt.toISOString(),
            status: "PENDING",
          })
        )
      }

      return reservations
    })
  }

  async commitReservation(
    reservationId: string,
    orderId: string,
    performedById: string
  ) {
    return await db.transaction(async (tx) => {
      const reservation = await tx.orm.public.InventoryReservation.where({
        id: reservationId,
      })
        .forUpdate()
        .first()
      if (!reservation) throw new NotFoundError("Reservation not found")

      if (reservation.status !== "PENDING") {
        throw new BadRequestError(
          `Cannot commit reservation with status ${reservation.status}`
        )
      }

      const item = await tx.orm.public.InventoryItem.where({
        id: reservation.inventoryItemId,
      })
        .forNoKeyUpdate()
        .first()
      if (!item) throw new NotFoundError("Associated inventory item not found")

      const newOnHand = item.onHand - reservation.quantity

      const updatedItem = await tx.orm.public.InventoryItem.where({
        id: item.id,
      }).update({
        onHand: newOnHand,
        reserved: Math.max(0, item.reserved - reservation.quantity),
      })

      const updatedReservation = await tx.orm.public.InventoryReservation.where(
        { id: reservation.id }
      ).update({ status: "COMMITTED", orderId })

      const ledgerEntry = await tx.orm.public.InventoryLedger.create({
        inventoryItemId: item.id,
        quantityDelta: -reservation.quantity,
        balanceAfter: newOnHand,
        reason: "ORDER_FULFILLED",
        referenceType: "ORDER",
        referenceId: orderId,
        note: `Committed reservation ${reservation.id}`,
        performedById,
      })

      return { reservation: updatedReservation, item: updatedItem, ledgerEntry }
    })
  }

  async releaseReservation(reservationId: string) {
    return await db.transaction(async (tx) => {
      const reservation = await tx.orm.public.InventoryReservation.where({
        id: reservationId,
      })
        .forUpdate()
        .first()
      if (!reservation) throw new NotFoundError("Reservation not found")

      if (reservation.status !== "PENDING") {
        return { reservation, item: null }
      }

      const item = await tx.orm.public.InventoryItem.where({
        id: reservation.inventoryItemId,
      })
        .forNoKeyUpdate()
        .first()

      const updatedItem = item
        ? await tx.orm.public.InventoryItem.where({ id: item.id }).update({
            reserved: Math.max(0, item.reserved - reservation.quantity),
          })
        : null

      const updatedReservation = await tx.orm.public.InventoryReservation.where(
        { id: reservation.id }
      ).update({ status: "RELEASED" })

      return { reservation: updatedReservation, item: updatedItem }
    })
  }
}

export const inventoryRepository = new InventoryRepository()
