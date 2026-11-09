import { db } from "@workspace/db"

import { MAX_UNPAGED_ROWS } from "../../utils/query-limits.js"

class CartRepository {
  /** Admins and demo sellers may shop without having registered as buyers. */
  async ensureCustomerId(userId: string): Promise<string> {
    const existing = await db.orm.public.Customer.select("id")
      .where({ userId })
      .first()
    if (existing) return existing.id
    const created = await db.orm.public.Customer.create({ userId })
    return created.id
  }

  async ensureCart(customerId: string): Promise<string> {
    const existing = await db.orm.public.Cart.select("id")
      .where({ customerId })
      .first()
    if (existing) return existing.id
    const created = await db.orm.public.Cart.create({ customerId })
    return created.id
  }

  async findLines(cartId: string) {
    return await db.orm.public.CartItem.where({ cartId })
      .include("sellerListing", (listing) =>
        listing
          .include("seller", (seller) =>
            seller
              .select("id", "businessName", "status")
              .include("store", (store) =>
                store
                  .select("slug", "displayName")
                  .include("address", (address) => address.select("state"))
              )
          )
          .include("inventoryItems", (item) =>
            item.select("onHand", "reserved", "safetyStock")
          )
          .include("variant", (variant) =>
            variant
              .select("id", "sku", "attributes", "productId")
              .include("product", (product) =>
                product
                  .select(
                    "id",
                    "title",
                    "slug",
                    "status",
                    "categoryId",
                    "hsnCode",
                    "gstRateBps"
                  )
                  .include("media", (media) =>
                    media
                      .select("isPrimary")
                      .include("media", (file) => file.select("url"))
                  )
              )
          )
      )
      .orderBy((item) => item.createdAt.asc())
      .limit(MAX_UNPAGED_ROWS)
      .all()
  }

  async findItem(cartId: string, id: string) {
    return await db.orm.public.CartItem.where({ cartId, id }).first()
  }

  async findItemByListing(cartId: string, sellerListingId: string) {
    return await db.orm.public.CartItem.where({
      cartId,
      sellerListingId,
    }).first()
  }

  async createItem(
    cartId: string,
    sellerListingId: string,
    quantity: number,
    unitPriceAtAdd: number
  ) {
    return await db.orm.public.CartItem.create({
      cartId,
      sellerListingId,
      quantity,
      unitPriceAtAdd,
    })
  }

  async setItemQuantity(id: string, quantity: number) {
    return await db.orm.public.CartItem.where({ id }).update({ quantity })
  }

  async deleteItem(id: string) {
    return await db.orm.public.CartItem.where({ id }).delete()
  }
}

export const cartRepository = new CartRepository()

/** Foreign keys guarantee these links, though the ORM types them as nullable. */
export function resolveLine(row: CartLineRow) {
  const listing = row.sellerListing!
  const variant = listing.variant!
  return {
    listing,
    variant,
    product: variant.product!,
    seller: listing.seller!,
  }
}
export type CartLineRow = Awaited<
  ReturnType<typeof cartRepository.findLines>
>[number]
