import type { Request, Response, NextFunction } from "express"
import { customerService } from "./customer.service.js"
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
} from "./customer.schema.js"
import { BadRequestError, UnauthorizedError } from "../../utils/errors/index.js"

class CustomerController {
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const customer = await customerService.getCustomerProfile(req.user.userId)
      res.status(200).json({ customer })
    } catch (error) {
      next(error)
    }
  }

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const parseResult = updateProfileSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid profile payload"
        throw new BadRequestError(message)
      }

      const customer = await customerService.updateCustomerProfile(req.user.userId, parseResult.data)
      res.status(200).json({
        message: "Customer profile updated successfully.",
        customer,
      })
    } catch (error) {
      next(error)
    }
  }

  createAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const parseResult = createAddressSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid address payload"
        throw new BadRequestError(message)
      }

      const address = await customerService.createCustomerAddress(req.user.userId, parseResult.data)
      res.status(201).json({
        message: "Address added successfully.",
        address,
      })
    } catch (error) {
      next(error)
    }
  }

  updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const { addressId } = req.params
      if (!addressId) {
        throw new BadRequestError("Address ID is required")
      }

      const parseResult = updateAddressSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid address payload"
        throw new BadRequestError(message)
      }

      const address = await customerService.updateCustomerAddress(req.user.userId, addressId as string, parseResult.data)
      res.status(200).json({
        message: "Address updated successfully.",
        address,
      })
    } catch (error) {
      next(error)
    }
  }

  deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const { addressId } = req.params
      if (!addressId) {
        throw new BadRequestError("Address ID is required")
      }

      const result = await customerService.deleteCustomerAddress(req.user.userId, addressId as string)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  setDefaultShipping = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const { addressId } = req.params
      if (!addressId) {
        throw new BadRequestError("Address ID is required")
      }

      const customer = await customerService.setDefaultShippingAddress(req.user.userId, addressId as string)
      res.status(200).json({
        message: "Default shipping address set successfully.",
        customer,
      })
    } catch (error) {
      next(error)
    }
  }

  setDefaultBilling = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Authentication required")
      }

      const { addressId } = req.params
      if (!addressId) {
        throw new BadRequestError("Address ID is required")
      }

      const customer = await customerService.setDefaultBillingAddress(req.user.userId, addressId as string)
      res.status(200).json({
        message: "Default billing address set successfully.",
        customer,
      })
    } catch (error) {
      next(error)
    }
  }
}

export const customerController = new CustomerController()
