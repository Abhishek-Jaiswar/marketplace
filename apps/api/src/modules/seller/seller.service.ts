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

    try {
      const otp = generateOtp()
      await userCache.setEmailVerificationOtp(result.user.email, otp)
      await mailService.sendOtpEmail(result.user.email, otp)
      logger.info(`Seller verification OTP sent successfully to ${result.user.email}`)
    } catch (err) {
      logger.error(`Failed to process seller verification OTP for ${result.user.email}`, err)
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

    let slug = payload.slug
    if (!slug) {
      slug = payload.displayName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      if (!slug) slug = `store-${seller.id.substring(0, 6)}`
    }

    // Validate slug uniqueness if changed
    const existingStore = await sellerRepository.findStoreBySlug(slug)
    if (existingStore && existingStore.sellerId !== seller.id) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`
    }

    const store = await sellerRepository.upsertStore(seller.id, {
      displayName: payload.displayName,
      slug,
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

  async verifySellerAdmin(
    sellerId: string,
    payload: {
      status?: "APPROVED" | "REJECTED" | "UNDER_REVIEW" | undefined
      remarks?: string | null | undefined
      stepDecisions?: {
        business?: { status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; rejectionReason?: string | null | undefined } | undefined
        store?: { status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; rejectionReason?: string | null | undefined } | undefined
        bank?: { status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; rejectionReason?: string | null | undefined } | undefined
        documents?: { status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; rejectionReason?: string | null | undefined } | undefined
      } | undefined
      reviveStep?: "business" | "store" | "bank" | "documents" | undefined
      reviveSeller?: boolean | undefined
    },
    reviewerId?: string
  ) {
    const seller = await sellerRepository.findSellerById(sellerId)
    if (!seller) {
      throw new NotFoundError("Seller not found")
    }

    const verification = await sellerRepository.getOrCreateVerification(sellerId)

    let businessStatus = verification.businessStatus || "PENDING"
    let businessRejectionReason = verification.businessRejectionReason || null

    let storeStatus = verification.storeStatus || "PENDING"
    let storeRejectionReason = verification.storeRejectionReason || null

    let bankStatus = verification.bankStatus || "PENDING"
    let bankRejectionReason = verification.bankRejectionReason || null

    let documentsStatus = verification.documentsStatus || "PENDING"
    let documentsRejectionReason = verification.documentsRejectionReason || null

    // 1. Process Step Decisions if provided
    if (payload.stepDecisions) {
      if (payload.stepDecisions.business) {
        businessStatus = payload.stepDecisions.business.status as any
        businessRejectionReason =
          payload.stepDecisions.business.status === "REJECTED"
            ? payload.stepDecisions.business.rejectionReason || "Business details rejected"
            : null
      }
      if (payload.stepDecisions.store) {
        storeStatus = payload.stepDecisions.store.status as any
        storeRejectionReason =
          payload.stepDecisions.store.status === "REJECTED"
            ? payload.stepDecisions.store.rejectionReason || "Store & address details rejected"
            : null
      }
      if (payload.stepDecisions.bank) {
        bankStatus = payload.stepDecisions.bank.status as any
        bankRejectionReason =
          payload.stepDecisions.bank.status === "REJECTED"
            ? payload.stepDecisions.bank.rejectionReason || "Bank account details rejected"
            : null
      }
      if (payload.stepDecisions.documents) {
        documentsStatus = payload.stepDecisions.documents.status as any
        documentsRejectionReason =
          payload.stepDecisions.documents.status === "REJECTED"
            ? payload.stepDecisions.documents.rejectionReason || "Verification documents / signature rejected"
            : null
      }
    }

    // 2. Process Progressive Step Revive
    if (payload.reviveStep) {
      if (payload.reviveStep === "business") {
        businessStatus = "PENDING"
        businessRejectionReason = null
      } else if (payload.reviveStep === "store") {
        storeStatus = "PENDING"
        storeRejectionReason = null
      } else if (payload.reviveStep === "bank") {
        bankStatus = "PENDING"
        bankRejectionReason = null
      } else if (payload.reviveStep === "documents") {
        documentsStatus = "PENDING"
        documentsRejectionReason = null
      }
    }

    // 3. Evaluate Overall Status
    let overallStatus: "APPROVED" | "REJECTED" | "UNDER_REVIEW" = "UNDER_REVIEW"

    if (payload.reviveSeller) {
      overallStatus = "UNDER_REVIEW"
    } else if (payload.status) {
      overallStatus = payload.status
    } else {
      const stepStatuses = [businessStatus, storeStatus, bankStatus, documentsStatus]
      if (stepStatuses.includes("REJECTED")) {
        overallStatus = "REJECTED"
      } else if (stepStatuses.every((s) => s === "APPROVED")) {
        overallStatus = "APPROVED"
      } else {
        overallStatus = "UNDER_REVIEW"
      }
    }

    // If whole application is approved directly, mark all steps as approved
    if (payload.status === "APPROVED") {
      businessStatus = "APPROVED"
      businessRejectionReason = null
      storeStatus = "APPROVED"
      storeRejectionReason = null
      bankStatus = "APPROVED"
      bankRejectionReason = null
      documentsStatus = "APPROVED"
      documentsRejectionReason = null
    }

    // Build remarks
    let finalRemarks = payload.remarks
    if (!finalRemarks && overallStatus === "REJECTED") {
      const rejections: string[] = []
      if (businessStatus === "REJECTED" && businessRejectionReason) {
        rejections.push(`Business Details: ${businessRejectionReason}`)
      }
      if (storeStatus === "REJECTED" && storeRejectionReason) {
        rejections.push(`Store Details: ${storeRejectionReason}`)
      }
      if (bankStatus === "REJECTED" && bankRejectionReason) {
        rejections.push(`Bank Account: ${bankRejectionReason}`)
      }
      if (documentsStatus === "REJECTED" && documentsRejectionReason) {
        rejections.push(`Documents: ${documentsRejectionReason}`)
      }
      finalRemarks = rejections.length > 0 ? rejections.join(" | ") : "Merchant application rejected"
    }

    // Update verification in db
    await sellerRepository.updateVerificationStatus(
      seller.id,
      overallStatus as any,
      reviewerId,
      finalRemarks ?? undefined,
      {
        businessStatus: businessStatus as any,
        businessRejectionReason,
        storeStatus: storeStatus as any,
        storeRejectionReason,
        bankStatus: bankStatus as any,
        bankRejectionReason,
        documentsStatus: documentsStatus as any,
        documentsRejectionReason,
      }
    )

    // Update bank accounts & documents status
    if (bankStatus === "APPROVED") {
      await db.bankAccount.updateMany({
        where: { sellerId: seller.id },
        data: { status: "APPROVED", verifiedAt: new Date() },
      })
    } else if (bankStatus === "REJECTED") {
      await db.bankAccount.updateMany({
        where: { sellerId: seller.id },
        data: { status: "REJECTED", rejectionReason: bankRejectionReason },
      })
    }

    if (documentsStatus === "APPROVED") {
      await db.sellerDocument.updateMany({
        where: { verification: { sellerId: seller.id } },
        data: { status: "APPROVED", verifiedAt: new Date() },
      })
    } else if (documentsStatus === "REJECTED") {
      await db.sellerDocument.updateMany({
        where: { verification: { sellerId: seller.id } },
        data: { status: "REJECTED", rejectionReason: documentsRejectionReason },
      })
    }

    // Update seller status
    const updatedSeller = await sellerRepository.updateSellerProfile(seller.id, {
      status: overallStatus === "APPROVED" ? "APPROVED" : overallStatus === "REJECTED" ? "REJECTED" : "UNDER_REVIEW",
      approvedAt: overallStatus === "APPROVED" ? new Date() : null,
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
