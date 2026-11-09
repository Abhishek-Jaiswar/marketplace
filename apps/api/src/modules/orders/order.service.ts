import { randomBytes } from "node:crypto"

import type {
  CheckoutInput,
  OrderAddress,
  OrderDetailView,
  OrderSummaryView,
} from "@workspace/contracts/commerce"

import { isProduction } from "../../config/env.config.js"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors/index.js"
import { cartRepository, resolveLine } from "../cart/cart.repository.js"
import {
  availableUnits,
  optionLabel,
  primaryImageUrl,
  summarize,
} from "../cart/cart.service.js"
import { inventoryCache } from "../inventory/inventory.cache.js"
import {
  commissionFor,
  isSameState,
  resolveCommissionBps,
  splitGst,
} from "./order.pricing.js"
import {
  orderRepository,
  type OrderPlan,
  type OrderRow,
  type PlannedLine,
  type PlannedSellerOrder,
} from "./order.repository.js"

const DAY_MS = 24 * 60 * 60 * 1000
const RESERVATION_HOLD_DAYS = 7

function newOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "")
  return `ORD-${date}-${randomBytes(3).toString("hex").toUpperCase()}`
}

function paymentFor(
  choice: CheckoutInput["paymentMethod"]
): OrderPlan["payment"] {
  if (choice === "COD") {
    return {
      provider: "COD",
      method: "COD",
      status: "CREATED",
      providerPaymentId: null,
      capturedAt: null,
    }
  }
  if (isProduction) {
    throw new BadRequestError("Online payment is not available yet")
  }
  // Stands in for a payment gateway until Razorpay keys are configured.
  return {
    provider: "RAZORPAY",
    method: "UPI",
    status: "CAPTURED",
    providerPaymentId: `test_${randomBytes(9).toString("hex")}`,
    capturedAt: new Date().toISOString(),
  }
}

function toSummary(order: OrderRow): OrderSummaryView {
  const items = order.sellerOrders.flatMap((group) => group.items)
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    placedAt: order.placedAt,
    grandTotal: order.grandTotal,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    thumbnails: items.map((item) => item.imageUrl),
  }
}

function toDetail(order: OrderRow): OrderDetailView {
  const payment = order.payments[0]
  return {
    ...toSummary(order),
    subtotal: order.subtotal,
    shippingTotal: order.shippingTotal,
    taxTotal: order.taxTotal,
    paymentMethod: payment?.method ?? null,
    paymentStatus: payment?.status ?? null,
    shippingAddress: order.shippingAddress as unknown as OrderAddress,
    sellerOrders: order.sellerOrders.map((group) => ({
      id: group.id,
      sellerOrderNumber: group.sellerOrderNumber,
      seller:
        group.seller?.store?.displayName ?? group.seller?.businessName ?? "",
      status: group.status,
      shipByAt: group.shipByAt,
      items: group.items.map((item) => ({
        id: item.id,
        title: item.title,
        option: optionLabel(item.attributes),
        slug: item.variant?.product?.slug ?? null,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
        status: item.status,
      })),
    })),
  }
}

class OrderService {
  async checkout(userId: string, input: CheckoutInput) {
    const customerId = await cartRepository.ensureCustomerId(userId)

    const previous = await orderRepository.findOrderIdentity(
      customerId,
      input.idempotencyKey
    )
    if (previous) return { orderNumber: previous.orderNumber }

    const address = await orderRepository.findOwnedAddress(
      customerId,
      input.addressId
    )
    if (!address) throw new NotFoundError("Choose a delivery address")

    const cartId = await cartRepository.ensureCart(customerId)
    const rows = await cartRepository.findLines(cartId)
    if (rows.length === 0) throw new BadRequestError("Your cart is empty")

    const payment = paymentFor(input.paymentMethod)
    const rules = await orderRepository.findCommissionRules()
    const groups = new Map<string, PlannedLine[]>()
    const handlingDays = new Map<string, number>()
    let taxTotal = 0

    const views = rows.map((row) => {
      const { listing, variant, product, seller } = resolveLine(row)
      const stock = availableUnits(listing.inventoryItems)

      if (
        listing.status !== "ACTIVE" ||
        seller.status !== "APPROVED" ||
        product.status !== "APPROVED"
      ) {
        throw new ConflictError(`${product.title} is no longer for sale`)
      }
      if (stock < row.quantity) {
        throw new ConflictError(
          stock > 0
            ? `Only ${stock} of ${product.title} left. Update your cart to continue.`
            : `${product.title} is out of stock. Remove it to continue.`
        )
      }
      if (input.paymentMethod === "COD" && !listing.codEnabled) {
        throw new BadRequestError(
          `${product.title} cannot be paid for on delivery`
        )
      }

      const lineTotal = listing.sellingPrice * row.quantity
      const gstRateBps = product.gstRateBps ?? 0
      const gst = splitGst(
        lineTotal,
        gstRateBps,
        isSameState(address.state, seller.store?.address?.state)
      )
      const commissionBps = resolveCommissionBps(
        rules,
        listing.sellerId,
        product.categoryId
      )
      taxTotal += gst.cgstAmount + gst.sgstAmount + gst.igstAmount

      const line: PlannedLine = {
        sellerListingId: listing.id,
        variantId: listing.variantId,
        sellerId: listing.sellerId,
        title: product.title,
        sku: variant.sku,
        sellerSku: listing.sellerSku,
        imageUrl: primaryImageUrl(product.media),
        attributes: variant.attributes as Record<string, unknown>,
        hsnCode: product.hsnCode,
        quantity: row.quantity,
        unitMrp: listing.mrpPrice,
        unitPrice: listing.sellingPrice,
        gstRateBps,
        ...gst,
        lineTotal,
        commissionBps,
        commissionAmount: commissionFor(lineTotal, commissionBps),
      }
      groups.set(listing.sellerId, [
        ...(groups.get(listing.sellerId) ?? []),
        line,
      ])
      handlingDays.set(
        listing.sellerId,
        Math.max(
          handlingDays.get(listing.sellerId) ?? 0,
          listing.handlingTimeDays
        )
      )

      return {
        price: listing.sellingPrice,
        mrp: listing.mrpPrice,
        quantity: row.quantity,
      }
    })

    const totals = summarize(views as Parameters<typeof summarize>[0])
    if (totals.total !== input.expectedTotal) {
      throw new ConflictError(
        "Prices in your cart have changed. Review the new total and try again."
      )
    }

    const now = Date.now()
    const sellerOrders: PlannedSellerOrder[] = [...groups].map(
      ([sellerId, lines]) => ({
        sellerId,
        lines,
        shipByAt: new Date(
          now + (handlingDays.get(sellerId) ?? 1) * DAY_MS
        ).toISOString(),
      })
    )

    try {
      const orderNumber = await orderRepository.placeOrder({
        orderNumber: newOrderNumber(),
        idempotencyKey: input.idempotencyKey,
        customerId,
        cartId,
        actorUserId: userId,
        subtotal: totals.subtotal,
        shippingTotal: totals.shippingTotal,
        taxTotal,
        grandTotal: totals.total,
        address: {
          recipientName: address.recipientName ?? "",
          phoneNumber: address.phoneNumber,
          street1: address.street1,
          street2: address.street2,
          landmark: address.landmark,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        reservationExpiresAt: new Date(now + RESERVATION_HOLD_DAYS * DAY_MS),
        sellerOrders,
        payment,
      })

      await Promise.all(
        rows.map((row) =>
          inventoryCache.invalidateListingStock(row.sellerListingId)
        )
      )
      return { orderNumber }
    } catch (error) {
      // A double-submitted checkout loses the race on the unique key.
      const winner = await orderRepository.findOrderIdentity(
        customerId,
        input.idempotencyKey
      )
      if (winner) return { orderNumber: winner.orderNumber }
      throw error
    }
  }

  async getOrder(userId: string, orderNumber: string) {
    const customerId = await cartRepository.ensureCustomerId(userId)
    const order = await orderRepository.findOrderForCustomer(
      customerId,
      orderNumber
    )
    if (!order) throw new NotFoundError("Order not found")
    return toDetail(order)
  }

  async listOrders(userId: string, page: number, limit: number) {
    const customerId = await cartRepository.ensureCustomerId(userId)
    const result = await orderRepository.findOrders(customerId, page, limit)
    return { ...result, items: result.items.map(toSummary) }
  }
}

export const orderService = new OrderService()
