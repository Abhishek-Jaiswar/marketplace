import {
  MAX_LINE_QUANTITY,
  shippingFor,
  type AddCartItemInput,
  type CartLineView,
  type CartView,
  type MergeCartInput,
} from "@workspace/contracts/commerce"

import { BadRequestError, NotFoundError } from "../../utils/errors/index.js"
import { catalogRepository } from "../catalog/index.js"
import {
  cartRepository,
  resolveLine,
  type CartLineRow,
} from "./cart.repository.js"

interface StockLevels {
  onHand: number
  reserved: number
  safetyStock: number
}

export const availableUnits = (items: StockLevels[]): number =>
  Math.max(
    0,
    items.reduce(
      (total, item) => total + item.onHand - item.reserved - item.safetyStock,
      0
    )
  )

export function optionLabel(attributes: unknown): string | null {
  const values = Object.values((attributes ?? {}) as Record<string, unknown>)
  return values.length > 0 ? values.map(String).join(", ") : null
}

export function primaryImageUrl(
  media: { isPrimary: boolean; media?: { url: string } | null }[]
): string | null {
  const primary = media.find((item) => item.isPrimary) ?? media[0]
  return primary?.media?.url ?? null
}

function toLineView(row: CartLineRow): CartLineView {
  const { listing, variant, product, seller } = resolveLine(row)
  const availableStock = availableUnits(listing.inventoryItems)

  return {
    id: row.id,
    sellerListingId: listing.id,
    slug: product.slug,
    title: product.title,
    option: optionLabel(variant.attributes),
    image: primaryImageUrl(product.media),
    seller: seller.store?.displayName ?? seller.businessName,
    price: listing.sellingPrice,
    mrp: listing.mrpPrice,
    quantity: row.quantity,
    availableStock,
    codEnabled: listing.codEnabled,
    isPurchasable:
      listing.status === "ACTIVE" &&
      seller.status === "APPROVED" &&
      product.status === "APPROVED" &&
      availableStock >= row.quantity,
    priceChanged: listing.sellingPrice !== row.unitPriceAtAdd,
  }
}

export function summarize(lines: CartLineView[]): CartView {
  const sum = (value: (line: CartLineView) => number) =>
    lines.reduce((total, line) => total + value(line), 0)

  const subtotal = sum((line) => line.price * line.quantity)
  const shippingTotal = shippingFor(subtotal)

  return {
    lines,
    itemCount: sum((line) => line.quantity),
    mrpTotal: sum((line) => line.mrp * line.quantity),
    subtotal,
    shippingTotal,
    total: subtotal + shippingTotal,
  }
}

class CartService {
  private async cartIdFor(userId: string) {
    const customerId = await cartRepository.ensureCustomerId(userId)
    return await cartRepository.ensureCart(customerId)
  }

  private async view(cartId: string): Promise<CartView> {
    const rows = await cartRepository.findLines(cartId)
    return summarize(rows.map(toLineView))
  }

  async getCart(userId: string) {
    return await this.view(await this.cartIdFor(userId))
  }

  /** Returns the listing's stock, or throws when it cannot be bought. */
  private async requireBuyable(sellerListingId: string) {
    const listing = await catalogRepository.findListingById(sellerListingId)
    if (!listing || listing.status !== "ACTIVE") {
      throw new NotFoundError("This product is no longer for sale")
    }
    return { listing, stock: availableUnits(listing.inventoryItems) }
  }

  private limitFor(stock: number, maxOrderQuantity: number | null) {
    return Math.min(stock, maxOrderQuantity ?? MAX_LINE_QUANTITY)
  }

  async addItem(userId: string, input: AddCartItemInput) {
    const cartId = await this.cartIdFor(userId)
    const { listing, stock } = await this.requireBuyable(input.sellerListingId)
    const limit = this.limitFor(stock, listing.maxOrderQuantity)
    if (limit <= 0) throw new BadRequestError("This product is out of stock")

    const existing = await cartRepository.findItemByListing(cartId, listing.id)
    const quantity = (existing?.quantity ?? 0) + input.quantity
    if (quantity > limit) {
      throw new BadRequestError(`You can buy up to ${limit} of this product`)
    }

    if (existing) {
      await cartRepository.setItemQuantity(existing.id, quantity)
    } else {
      await cartRepository.createItem(
        cartId,
        listing.id,
        quantity,
        listing.sellingPrice
      )
    }
    return await this.view(cartId)
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cartId = await this.cartIdFor(userId)
    const item = await cartRepository.findItem(cartId, itemId)
    if (!item) throw new NotFoundError("This item is not in your cart")

    const { listing, stock } = await this.requireBuyable(item.sellerListingId)
    const limit = this.limitFor(stock, listing.maxOrderQuantity)
    if (quantity > limit) {
      throw new BadRequestError(`You can buy up to ${limit} of this product`)
    }

    await cartRepository.setItemQuantity(item.id, quantity)
    return await this.view(cartId)
  }

  async removeItem(userId: string, itemId: string) {
    const cartId = await this.cartIdFor(userId)
    const item = await cartRepository.findItem(cartId, itemId)
    if (!item) throw new NotFoundError("This item is not in your cart")

    await cartRepository.deleteItem(item.id)
    return await this.view(cartId)
  }

  /** Brings a signed-out cart across, skipping anything no longer for sale. */
  async merge(userId: string, input: MergeCartInput) {
    const cartId = await this.cartIdFor(userId)

    for (const item of input.items) {
      const listing = await catalogRepository.findListingById(
        item.sellerListingId
      )
      if (listing?.status !== "ACTIVE") continue

      const limit = this.limitFor(
        availableUnits(listing.inventoryItems),
        listing.maxOrderQuantity
      )
      const existing = await cartRepository.findItemByListing(
        cartId,
        listing.id
      )
      const quantity = Math.min(
        (existing?.quantity ?? 0) + item.quantity,
        limit
      )
      if (quantity <= 0) continue

      if (existing) {
        await cartRepository.setItemQuantity(existing.id, quantity)
      } else {
        await cartRepository.createItem(
          cartId,
          listing.id,
          quantity,
          listing.sellingPrice
        )
      }
    }
    return await this.view(cartId)
  }
}

export const cartService = new CartService()
