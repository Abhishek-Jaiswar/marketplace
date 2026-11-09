import { logger } from "@workspace/logger"
import type { Scalars } from "@prisma/orm-postgres/family-contract/types"
import type { Models } from "./prisma/contract.js"
import { db } from "./prisma/db.js"

export { db, db as prisma, contract } from "./prisma/db.js"
export { and, or, not } from "@prisma/orm-postgres/orm-client"
export type { Condition } from "@prisma/orm-postgres/orm-client"
export type { Contract, Models } from "./prisma/contract.js"

export type User = Scalars<Models.public_User>
export type Credential = Scalars<Models.public_Credential>
export type Session = Scalars<Models.public_Session>
export type VerificationToken = Scalars<Models.public_VerificationToken>
export type Category = Scalars<Models.public_Category>
export type Customer = Scalars<Models.public_Customer>
export type Seller = Scalars<Models.public_Seller>
export type Store = Scalars<Models.public_Store>
export type BankAccount = Scalars<Models.public_BankAccount>
export type SellerVerification = Scalars<Models.public_SellerVerification>
export type SellerDocument = Scalars<Models.public_SellerDocument>
export type Media = Scalars<Models.public_Media>
export type Address = Scalars<Models.public_Address>
export type Product = Scalars<Models.public_Product>
export type Brand = Scalars<Models.public_Brand>
export type ProductVariant = Scalars<Models.public_ProductVariant>
export type ProductMedia = Scalars<Models.public_ProductMedia>
export type SellerListing = Scalars<Models.public_SellerListing>
export type InventoryLocation = Scalars<Models.public_InventoryLocation>
export type InventoryItem = Scalars<Models.public_InventoryItem>
export type InventoryReservation = Scalars<Models.public_InventoryReservation>
export type InventoryLedger = Scalars<Models.public_InventoryLedger>
export type Cart = Scalars<Models.public_Cart>
export type CartItem = Scalars<Models.public_CartItem>
export type WishlistItem = Scalars<Models.public_WishlistItem>
export type Order = Scalars<Models.public_Order>
export type SellerOrder = Scalars<Models.public_SellerOrder>
export type OrderItem = Scalars<Models.public_OrderItem>
export type OrderEvent = Scalars<Models.public_OrderEvent>
export type Invoice = Scalars<Models.public_Invoice>
export type Payment = Scalars<Models.public_Payment>
export type PaymentWebhookEvent = Scalars<Models.public_PaymentWebhookEvent>
export type Refund = Scalars<Models.public_Refund>
export type Shipment = Scalars<Models.public_Shipment>
export type ShipmentItem = Scalars<Models.public_ShipmentItem>
export type ShipmentEvent = Scalars<Models.public_ShipmentEvent>
export type ReturnRequest = Scalars<Models.public_ReturnRequest>
export type ReturnMedia = Scalars<Models.public_ReturnMedia>
export type CommissionRule = Scalars<Models.public_CommissionRule>
export type SellerLedgerEntry = Scalars<Models.public_SellerLedgerEntry>
export type Payout = Scalars<Models.public_Payout>
export type ProductReview = Scalars<Models.public_ProductReview>
export type ReviewMedia = Scalars<Models.public_ReviewMedia>
export type SellerRating = Scalars<Models.public_SellerRating>
export type Coupon = Scalars<Models.public_Coupon>
export type CouponRedemption = Scalars<Models.public_CouponRedemption>
export type Collection = Scalars<Models.public_Collection>
export type CollectionProduct = Scalars<Models.public_CollectionProduct>
export type Notification = Scalars<Models.public_Notification>
export type AuditLog = Scalars<Models.public_AuditLog>
export type CategoryAttribute = Scalars<Models.public_CategoryAttribute>

export type UserStatus = Models.public_User["status"]
export type UserRole = Models.public_User["roles"][number]
export type AuthProvider = Models.public_Credential["provider"]
export type VerificationTokenType = Models.public_VerificationToken["type"]
export type SellerStatus = Models.public_Seller["status"]
export type BusinessType = Models.public_Seller["businessType"]
export type VerificationStatus = Models.public_SellerVerification["status"]
export type SellerDocumentType = Models.public_SellerDocument["type"]
export type MediaType = Models.public_Media["mediaType"]
export type StorageProvider = Models.public_Media["provider"]
export type ProductStatus = Models.public_Product["status"]
export type VariantStatus = Models.public_ProductVariant["status"]
export type ListingStatus = Models.public_SellerListing["status"]
export type ItemCondition = Models.public_SellerListing["condition"]
export type LocationType = Models.public_InventoryLocation["type"]
export type InventoryChangeReason = Models.public_InventoryLedger["reason"]
export type ReservationStatus = Models.public_InventoryReservation["status"]
export type OrderStatus = Models.public_Order["status"]
export type SellerOrderStatus = Models.public_SellerOrder["status"]
export type OrderItemStatus = Models.public_OrderItem["status"]
export type PaymentStatus = Models.public_Payment["status"]
export type RefundStatus = Models.public_Refund["status"]
export type ShipmentStatus = Models.public_Shipment["status"]
export type ReturnStatus = Models.public_ReturnRequest["status"]
export type SellerLedgerEntryType = Models.public_SellerLedgerEntry["type"]
export type PayoutStatus = Models.public_Payout["status"]
export type ReviewStatus = Models.public_ProductReview["status"]

export async function testConnection(): Promise<{ count: number }> {
  try {
    const result = await db.orm.public.User.aggregate((aggregate) => ({
      count: aggregate.count(),
    }))

    logger.info("Database connection successful", result)

    return result
  } catch (error) {
    logger.error("Database connection failed", { error })
    throw error
  }
}
