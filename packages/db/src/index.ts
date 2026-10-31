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
