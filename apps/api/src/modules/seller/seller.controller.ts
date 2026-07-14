import type { Request, Response, NextFunction } from "express"
import { sellerService } from "./seller.service.js"
import {
  registerSellerSchema,
  onboardSchema,
  storeSchema,
  bankAccountSchema,
  verifySellerSchema,
} from "./seller.schema.js"
import { BadRequestError, UnauthorizedError } from "../../utils/errors/index.js"

class SellerController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = registerSellerSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid registration payload"
        throw new BadRequestError(message)
      }

      const result = await sellerService.registerSeller(parseResult.data)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  onboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const parseResult = onboardSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid onboarding payload"
        throw new BadRequestError(message)
      }

      const result = await sellerService.onboardExistingUser(req.user.userId, parseResult.data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const seller = await sellerService.getSellerProfile(req.user.userId)
      res.status(200).json({ seller })
    } catch (error) {
      next(error)
    }
  }

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const parseResult = onboardSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid profile payload"
        throw new BadRequestError(message)
      }

      const seller = await sellerService.updateSellerProfile(req.user.userId, parseResult.data)
      res.status(200).json({
        message: "Seller profile updated successfully.",
        seller,
      })
    } catch (error) {
      next(error)
    }
  }

  updateStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const parseResult = storeSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid store payload"
        throw new BadRequestError(message)
      }

      const store = await sellerService.updateStoreDetails(req.user.userId, parseResult.data)
      res.status(200).json({
        message: "Store details updated successfully.",
        store,
      })
    } catch (error) {
      next(error)
    }
  }

  addBankAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const parseResult = bankAccountSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid bank details payload"
        throw new BadRequestError(message)
      }

      const account = await sellerService.addBankAccount(req.user.userId, parseResult.data)
      res.status(201).json({
        message: "Bank account added successfully.",
        account,
      })
    } catch (error) {
      next(error)
    }
  }

  uploadDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const { type } = req.body
      const file = req.file

      if (!type) {
        throw new BadRequestError("Document type is required")
      }

      if (!file) {
        throw new BadRequestError("Document file is required")
      }

      const allowedTypes = ["GST_CERTIFICATE", "PAN_CARD", "BUSINESS_LICENSE", "ADDRESS_PROOF", "CANCELLED_CHEQUE", "OTHER"]
      if (!allowedTypes.includes(type)) {
        throw new BadRequestError(`Invalid document type. Allowed types: ${allowedTypes.join(", ")}`)
      }

      const document = await sellerService.uploadDocument(req.user.userId, type, file)
      res.status(201).json({
        message: "Document uploaded and attached successfully.",
        document,
      })
    } catch (error) {
      next(error)
    }
  }

  submit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const seller = await sellerService.submitVerification(req.user.userId)
      res.status(200).json({
        message: "Seller verification request submitted successfully.",
        seller,
      })
    } catch (error) {
      next(error)
    }
  }

  verifySeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sellerId } = req.params
      if (!sellerId) {
        throw new BadRequestError("Seller ID is required")
      }

      const parseResult = verifySellerSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid verification review payload"
        throw new BadRequestError(message)
      }

      const reviewerId = req.user?.userId || "system"

      const seller = await sellerService.verifySellerAdmin(
        sellerId as string,
        parseResult.data.status,
        parseResult.data.remarks,
        reviewerId
      )

      res.status(200).json({
        message: `Seller status updated to ${parseResult.data.status} successfully.`,
        seller,
      })
    } catch (error) {
      next(error)
    }
  }

  getSellers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1)
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10))

      const result = await sellerService.getAllSellers(page, limit)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const sellerController = new SellerController()
