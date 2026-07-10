import type { Request, Response, NextFunction } from "express"
import { userService } from "./user.service.js"
import {
  registerSchema,
  loginSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./user.schema.js"
import { BadRequestError, UnauthorizedError } from "../../utils/errors/index.js"

class UserController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = registerSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid registration payload"
        throw new BadRequestError(message)
      }

      const result = await userService.registerUser(parseResult.data)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, otp } = req.body
      if (!email || !otp) {
        throw new BadRequestError("Email and OTP are required")
      }

      const result = await userService.verifyOtp(email, otp)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await userService.getUsers()
      res.status(200).json({
        data: users,
      })
    } catch (error) {
      next(error)
    }
  }

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.userId) {
        throw new UnauthorizedError("Invalid session")
      }

      const user = await userService.getUserById(req.user.userId)
      res.status(200).json({
        user,
      })
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = loginSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid login payload"
        throw new BadRequestError(message)
      }

      const result = await userService.loginUser(
        parseResult.data,
        req.headers["user-agent"],
        req.ip
      )

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })

      res.status(200).json({
        accessToken: result.accessToken,
        user: result.user,
      })
    } catch (error) {
      next(error)
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken
      if (refreshToken) {
        await userService.logoutUser(refreshToken)
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
      next(error)
    }
  }

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken
      if (!refreshToken) {
        throw new UnauthorizedError("Refresh token is required")
      }

      const result = await userService.refreshAccessToken(
        refreshToken,
        req.headers["user-agent"],
        req.ip
      )

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })

      res.status(200).json({
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  }

  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = resendOtpSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid payload"
        throw new BadRequestError(message)
      }

      const result = await userService.resendOtp(parseResult.data.email)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = forgotPasswordSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid payload"
        throw new BadRequestError(message)
      }

      const result = await userService.forgotPassword(parseResult.data.email)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = resetPasswordSchema.safeParse(req.body)
      if (!parseResult.success) {
        const message = parseResult.error.issues[0]?.message || "Invalid payload"
        throw new BadRequestError(message)
      }

      const result = await userService.resetPassword(parseResult.data)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()
