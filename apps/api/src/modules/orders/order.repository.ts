import { db } from "@workspace/db"
import type { OrderAddress } from "@workspace/contracts/commerce"

import { MAX_UNPAGED_ROWS } from "../../utils/query-limits.js"
import { inventoryRepository } from "../inventory/inventory.repository.js"

export interface PlannedLine {
  sellerListingId: string
  variantId: string
  sellerId: string
  title: string
  sku: string
  sellerSku: string
  imageUrl: string | null
  attributes: Record<string, unknown>
  hsnCode: string | null
  quantity: number
  unitMrp: number
  unitPrice: number
  taxableAmount: number
  gstRateBps: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  lineTotal: number
  commissionBps: number
  commissionAmount: number
}

export interface PlannedSellerOrder {
  sellerId: string
  shipByAt: string
  lines: PlannedLine[]
}

export interface OrderPlan {
  orderNumber: string
  idempotencyKey: string
  customerId: string
  cartId: string
  actorUserId: string
  subtotal: number
  shippingTotal: number
  taxTotal: number
  grandTotal: number
  address: OrderAddress
  reservationExpiresAt: Date
  sellerOrders: PlannedSellerOrder[]
  payment: {
    provider: "COD" | "RAZORPAY"
    method: "COD" | "UPI"
    status: "CREATED" | "CAPTURED"
    providerPaymentId: string | null
    capturedAt: string | null
  }
}

const sum = (lines: PlannedLine[], value: (line: PlannedLine) => number) =>
  lines.reduce((total, line) => total + value(line), 0)

class OrderRepository {
  async findCommissionRules() {
    return await db.orm.public.CommissionRule.where({ isActive: true })
      .limit(MAX_UNPAGED_ROWS)
      .all()
  }

  async findOwnedAddress(customerId: string, addressId: string) {
    return await db.orm.public.Address.where({
      id: addressId,
      customerId,
    }).first()
  }

  async findOrderIdentity(customerId: string, idempotencyKey: string) {
    return await db.orm.public.Order.select("orderNumber")
      .where({ customerId, idempotencyKey })
      .first()
  }

  /** Creates the order, holds its stock and empties the cart, or does none. */
  async placeOrder(plan: OrderPlan): Promise<string> {
    return await db.transaction(async (tx) => {
      const now = new Date().toISOString()
      const order = await tx.orm.public.Order.create({
        orderNumber: plan.orderNumber,
        idempotencyKey: plan.idempotencyKey,
        customerId: plan.customerId,
        status: "PLACED",
        subtotal: plan.subtotal,
        shippingTotal: plan.shippingTotal,
        taxTotal: plan.taxTotal,
        grandTotal: plan.grandTotal,
        shippingAddress: { ...plan.address },
        billingAddress: { ...plan.address },
        placedAt: now,
      })

      const reservations: {
        orderItemId: string
        sellerListingId: string
        quantity: number
      }[] = []

      for (const [index, group] of plan.sellerOrders.entries()) {
        const groupSubtotal = sum(group.lines, (line) => line.lineTotal)
        const shipping = index === 0 ? plan.shippingTotal : 0
        const sellerOrder = await tx.orm.public.SellerOrder.create({
          sellerOrderNumber: `${plan.orderNumber}-${index + 1}`,
          orderId: order.id,
          sellerId: group.sellerId,
          subtotal: groupSubtotal,
          shippingTotal: shipping,
          taxTotal: sum(
            group.lines,
            (line) => line.cgstAmount + line.sgstAmount + line.igstAmount
          ),
          total: groupSubtotal + shipping,
          shipByAt: group.shipByAt,
        })

        for (const line of group.lines) {
          const { sellerId: _sellerId, attributes, ...columns } = line
          const item = await tx.orm.public.OrderItem.create({
            ...columns,
            attributes: attributes as never,
            sellerOrderId: sellerOrder.id,
          })
          reservations.push({
            orderItemId: item.id,
            sellerListingId: line.sellerListingId,
            quantity: line.quantity,
          })
        }
      }

      // A fixed order keeps two checkouts from deadlocking on each other.
      reservations.sort((a, b) =>
        a.sellerListingId.localeCompare(b.sellerListingId)
      )
      for (const reservation of reservations) {
        await inventoryRepository.reserveLine(tx, reservation, {
          expiresAt: plan.reservationExpiresAt,
          orderId: order.id,
          orderItemId: reservation.orderItemId,
        })
      }

      await tx.orm.public.Payment.create({
        orderId: order.id,
        amount: plan.grandTotal,
        ...plan.payment,
      })
      await tx.orm.public.OrderEvent.create({
        orderId: order.id,
        toStatus: "PLACED",
        actorType: "CUSTOMER",
        actorUserId: plan.actorUserId,
      })
      await tx.orm.public.CartItem.where({ cartId: plan.cartId }).deleteAll()

      return order.orderNumber
    })
  }

  private withDetails() {
    return db.orm.public.Order.include("sellerOrders", (sellerOrder) =>
      sellerOrder
        .include("seller", (seller) =>
          seller
            .select("businessName")
            .include("store", (store) => store.select("displayName"))
        )
        .include("items", (item) =>
          item.include("variant", (variant) =>
            variant
              .select("productId")
              .include("product", (product) => product.select("slug"))
          )
        )
    ).include("payments")
  }

  async findOrderForCustomer(customerId: string, orderNumber: string) {
    return await this.withDetails().where({ customerId, orderNumber }).first()
  }

  async findOrders(customerId: string, page: number, limit: number) {
    const scoped = this.withDetails().where({ customerId })
    const [items, totals] = await Promise.all([
      scoped
        .orderBy((order) => order.createdAt.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all(),
      db.orm.public.Order.where({ customerId }).aggregate((aggregate) => ({
        total: aggregate.count(),
      })),
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

export const orderRepository = new OrderRepository()
export type OrderRow = NonNullable<
  Awaited<ReturnType<typeof orderRepository.findOrderForCustomer>>
>
