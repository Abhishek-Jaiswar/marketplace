import { logger } from "@workspace/logger"
import { sellerRepository } from "./seller.repository.js"
import { userRepository } from "../users/user.repository.js"
import { userCache } from "../users/user.cache.js"
import { db } from "@workspace/db"
import {
  hashPassword,
  generateOtp,
  signAccessToken,
} from "../../utils/security.js"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "../../utils/errors/index.js"
import { mailService } from "../../services/mail/mail.service.js"
import { uploadService } from "../../services/storage/upload.service.js"
import { sellerCache } from "./seller.cache.js"

class SellerService {
  async registerSeller(payload: any) {
    const existingUser = await userRepository.findUserByEmail(payload.email)
    if (existingUser) {
      throw new ConflictError("Email is already registered")
    }

    const passwordHash = await hashPassword(payload.password)

    const result = await sellerRepository.registerSellerTransaction(payload, passwordHash)

    const otp = generateOtp()
    await userCache.setEmailVerificationOtp(result.user.email, otp)

    try {
      await mailService.sendOtpEmail(result.user.email, otp)
      logger.info(`Seller verification OTP sent successfully to ${result.user.email}`)
    } catch (err) {
      logger.error(`Failed to send seller verification OTP email to ${result.user.email}`, err)
    }

    return {
      message: "Seller registered successfully. Please verify your email using the OTP sent.",
      user: result.user,
      seller: result.seller,
    }
  }

  async onboardExistingUser(userId: string, payload: any) {
    const user = await userRepository.findUserById(userId)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    // Check if seller profile already exists
    let seller = await sellerRepository.findSellerByOwnerId(userId)

    if (seller) {
      // User is already a seller or is in drafting stage
      return {
        message: "Seller profile already exists.",
        user,
        seller,
      }
    }

    // Add SELLER role if not present
    const updatedRoles = Array.from(new Set([...user.roles, "SELLER"]))

    const updatedUser = await sellerRepository.updateUserRoles(userId, updatedRoles)

    seller = await sellerRepository.createSeller(
      userId,
      payload.businessName,
      payload.businessType,
      payload.contactEmail || user.email,
      payload.contactPhone,
      payload.gstin
    )

    await userCache.invalidateUser(userId)
    await sellerCache.invalidateUser(userId)

    // Issue updated token containing the new roles
    const accessToken = signAccessToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      roles: updatedUser.roles as string[],
    })

    return {
      message: "Seller onboarding started successfully.",
      user: updatedUser,
      seller,
      accessToken,
    }
  }

  async getSellerProfile(userId: string) {
    return sellerCache.getOrSetSellerDetails(userId, async () => {
      const seller = await sellerRepository.findSellerByOwnerId(userId)
      if (!seller) {
        throw new NotFoundError("Seller profile not found. Please start onboarding.")
      }
      return seller
    })
  }

  async updateSellerProfile(userId: string, payload: any) {
    const seller = await sellerRepository.findSellerByOwnerId(userId)
    if (!seller) {
      throw new NotFoundError("Seller profile not found")
    }

    if (seller.status !== "DRAFT" && seller.status !== "DOCUMENTS_PENDING" && seller.status !== "REJECTED") {
      throw new ForbiddenError("Cannot edit seller profile in its current status")
    }

    const updatedSeller = await sellerRepository.updateSellerProfile(seller.id, {
      businessName: payload.businessName,
      businessType: payload.businessType,
      gstin: payload.gstin,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      status: "DRAFT", // reset to draft if they modify details
    })

    await sellerCache.invalidateUser(userId)

    return updatedSeller
  }

  async updateStoreDetails(userId: string, payload: any) {
    const seller = await sellerRepository.findSellerByOwnerId(userId)
    if (!seller) {
      throw new NotFoundError("Seller profile not found")
    }

    if (seller.status !== "DRAFT" && seller.status !== "DOCUMENTS_PENDING" && seller.status !== "REJECTED") {
      throw new ForbiddenError("Cannot edit store details in its current status")
    }

    // Validate slug uniqueness if changed
    const existingStore = await sellerRepository.findStoreBySlug(payload.slug)
    if (existingStore && existingStore.sellerId !== seller.id) {
      throw new ConflictError("Store link / slug is already taken by another seller")
    }

    const store = await sellerRepository.upsertStore(seller.id, {
      displayName: payload.displayName,
      slug: payload.slug,
      description: payload.description,
      address: payload.address,
    })

    await sellerCache.invalidateUser(userId)

    return store
  }

  async addBankAccount(userId: string, payload: any) {
    const seller = await sellerRepository.findSellerByOwnerId(userId)
    if (!seller) {
      throw new NotFoundError("Seller profile not found")
    }

    if (seller.status !== "DRAFT" && seller.status !== "DOCUMENTS_PENDING" && seller.status !== "REJECTED") {
      throw new ForbiddenError("Cannot add bank details in its current status")
    }

    const account = await sellerRepository.addBankAccount(seller.id, payload)

    await sellerCache.invalidateUser(userId)

    return account
  }

  async uploadDocument(userId: string, type: any, file: Express.Multer.File) {
    const seller = await sellerRepository.findSellerByOwnerId(userId)
    if (!seller) {
      throw new NotFoundError("Seller profile not found")
    }

    if (seller.status !== "DRAFT" && seller.status !== "DOCUMENTS_PENDING" && seller.status !== "REJECTED") {
      throw new ForbiddenError("Cannot upload documents in its current status")
    }

    // 1. Upload file buffer to Cloudinary
    const folder = `sellers/${seller.id}/documents`
    const uploadedAsset = await uploadService.upload(file, folder)

    // 2. Save file metadata as Media record in DB
    const extension = file.originalname.split(".").pop()
    const media = await sellerRepository.createMedia({
      fileName: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extension: extension || null,
      size: file.size,
      mediaType: file.mimetype.startsWith("image/") ? "IMAGE" : "DOCUMENT",
      provider: "CLOUDINARY",
      storageKey: uploadedAsset.storageKey,
      url: uploadedAsset.url,
      uploadedById: userId,
    })

    // 3. Attach Document to Seller Verification
    const verification = await sellerRepository.getOrCreateVerification(seller.id)
    const doc = await sellerRepository.addDocument(verification.id, media.id, type)

    await sellerCache.invalidateUser(userId)

    return doc
  }

  async submitVerification(userId: string) {
    const seller = await sellerRepository.findSellerByOwnerId(userId)
    if (!seller) {
      throw new NotFoundError("Seller profile not found")
    }

    if (seller.status !== "DRAFT" && seller.status !== "DOCUMENTS_PENDING" && seller.status !== "REJECTED") {
      throw new ForbiddenError("Application is already submitted or approved")
    }

    // Validation: ensure store details are filled
    if (!seller.store) {
      throw new BadRequestError("Store information is required before submission")
    }

    // Validation: ensure pickup address is filled
    if (!seller.store.addressId) {
      throw new BadRequestError("Pickup address is required before submission")
    }

    // Validation: bank details
    if (seller.bankAccounts.length === 0) {
      throw new BadRequestError("At least one bank account is required before submission")
    }

    // Validation: documents
    const verification = await sellerRepository.getOrCreateVerification(seller.id)
    if (verification.documents.length === 0) {
      throw new BadRequestError("Please upload at least one verification document (e.g. GST certificate, PAN, or Cheque)")
    }

    // Update statuses
    await sellerRepository.updateSellerProfile(seller.id, {
      status: "UNDER_REVIEW",
    })

    await sellerRepository.updateVerificationStatus(seller.id, "UNDER_REVIEW")

    await sellerCache.invalidateUser(userId)

    return this.getSellerProfile(userId)
  }

  async verifySellerAdmin(sellerId: string, status: "APPROVED" | "REJECTED", remarks?: string, reviewerId?: string) {
    const seller = await sellerRepository.findSellerById(sellerId)
    if (!seller) {
      throw new NotFoundError("Seller not found")
    }

    // Update verification
    await sellerRepository.updateVerificationStatus(
      seller.id,
      status === "APPROVED" ? "APPROVED" : "REJECTED",
      reviewerId,
      remarks
    )

    // Update bank accounts status (approve all pending ones on seller approval)
    if (status === "APPROVED") {
      await db.bankAccount.updateMany({
        where: { sellerId: seller.id, status: "PENDING" },
        data: { status: "APPROVED", verifiedAt: new Date() },
      })
      await db.sellerDocument.updateMany({
        where: { verification: { sellerId: seller.id }, status: "PENDING" },
        data: { status: "APPROVED", verifiedAt: new Date() },
      })
    } else {
      await db.bankAccount.updateMany({
        where: { sellerId: seller.id, status: "PENDING" },
        data: { status: "REJECTED" },
      })
      await db.sellerDocument.updateMany({
        where: { verification: { sellerId: seller.id }, status: "PENDING" },
        data: { status: "REJECTED" },
      })
    }

    // Update seller status
    const updatedSeller = await sellerRepository.updateSellerProfile(seller.id, {
      status: status === "APPROVED" ? "APPROVED" : "REJECTED",
      approvedAt: status === "APPROVED" ? new Date() : null,
    })

    await sellerCache.invalidateUser(seller.ownerUserId)

    return updatedSeller
  }

  async getAllSellers(page: number = 1, limit: number = 10) {
    return sellerCache.getOrSetUserList(page, limit, async () => {
      logger.info(`Seller list cache miss - fetching page ${page} limit ${limit} from database`)
      return sellerRepository.findAllSellers(page, limit)
    })
  }

  async lookupGstin(gstin: string) {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    if (!gstinRegex.test(gstin)) {
      throw new BadRequestError("Invalid GSTIN format. Must be a 15-digit code.")
    }

    const states: Record<string, string> = {
      "29": "Karnataka",
      "27": "Maharashtra",
      "07": "Delhi",
      "33": "Tamil Nadu",
      "09": "Uttar Pradesh",
      "19": "West Bengal",
    }
    const stateCode = gstin.substring(0, 2)
    const state = states[stateCode] || "Maharashtra"

    return {
      gstin,
      tradeName: `Acme Retailers (${state} Division)`,
      legalName: `Acme Retailers Private Limited`,
      businessType: "PRIVATE_LIMITED",
      state,
      status: "ACTIVE",
    }
  }
}

export const sellerService = new SellerService()
