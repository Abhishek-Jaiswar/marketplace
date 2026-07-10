import { logger } from "@workspace/logger"
import { userRepository } from "./user.repository.js"
import { userCache } from "./user.cache.js"
import {
  hashPassword,
  generateOtp,
  comparePassword,
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/security.js"
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../../utils/errors/index.js"
import { mailService } from "../../services/mail/mail.service.js"
import { TRegister, TLogin, TResetPassword } from "./user.types.js"

class UserService {
  async registerUser(payload: TRegister) {
    const existingUser = await userRepository.findUserByEmail(payload.email)
    if (existingUser) {
      throw new ConflictError("Email is already registered")
    }

    const passwordHash = await hashPassword(payload.password)
    const user = await userRepository.registerUser(payload, passwordHash)

    const otp = generateOtp()
    await userCache.setEmailVerificationOtp(user.email, otp)

    try {
      await mailService.sendOtpEmail(user.email, otp)
      logger.info(`Verification OTP sent successfully to ${user.email}`)
    } catch (err) {
      logger.error(`Failed to send verification OTP email to ${user.email}`, err)
    }

    return {
      message: "User registered successfully. Please verify your email using the OTP sent.",
      user,
    }
  }

  async verifyOtp(email: string, otp: string) {
    if (!email || !otp) {
      throw new BadRequestError("Email and OTP are required")
    }

    const cachedOtp = await userCache.getEmailVerificationOtp(email)
    if (!cachedOtp) {
      throw new BadRequestError("OTP has expired or is invalid")
    }

    if (cachedOtp !== otp) {
      throw new BadRequestError("Invalid OTP")
    }

    const user = await userRepository.findUserByEmail(email)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const updatedUser = await userRepository.updateUserStatus(user.id, "ACTIVE")

    await userCache.deleteEmailVerificationOtp(email)
    await userCache.invalidateUser(user.id) // Clears user details and list cache

    return {
      message: "Email verified successfully. You can now login.",
      user: updatedUser,
    }
  }

  async getUsers() {
    return await userCache.getOrSetUserList(1, 100, async () => {
      logger.info("Users cache miss - fetching from database")
      return await userRepository.getAllUsers()
    })
  }

  async getUserById(userId: string) {
    return await userCache.getOrSetUserDetails(userId, async () => {
      logger.info(`User details cache miss - fetching user ${userId} from database`)
      const foundUser = await userRepository.findUserById(userId)
      if (!foundUser) {
        throw new NotFoundError("User not found")
      }
      return foundUser
    })
  }

  async loginUser(payload: TLogin, userAgent?: string, ipAddress?: string) {
    const user = await userRepository.findUserByEmail(payload.email)
    if (!user || !user.credential) {
      throw new UnauthorizedError("Invalid email or password")
    }

    if (!user.emailVerified) {
      throw new ForbiddenError("Please verify your email address before logging in")
    }

    if (user.status === "SUSPENDED") {
      throw new ForbiddenError("Your account has been suspended. Please contact support.")
    }

    const isPasswordValid = await comparePassword(payload.password, user.credential.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password")
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    })

    const plainRefreshToken = generateRefreshToken()
    const refreshTokenHash = hashRefreshToken(plainRefreshToken)

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    await userRepository.createSession(user.id, refreshTokenHash, expiresAt, userAgent, ipAddress)

    return {
      accessToken,
      refreshToken: plainRefreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        emailVerified: user.emailVerified,
        roles: user.roles,
      },
    }
  }

  async logoutUser(refreshToken: string) {
    const hash = hashRefreshToken(refreshToken)
    await userRepository.deleteSessionByHash(hash)
  }

  async refreshAccessToken(refreshToken: string, userAgent?: string, ipAddress?: string) {
    const hash = hashRefreshToken(refreshToken)
    const session = await userRepository.findSessionByHash(hash)

    if (!session) {
      throw new UnauthorizedError("Invalid or expired session")
    }

    if (session.expiresAt < new Date()) {
      await userRepository.deleteSessionByHash(hash)
      throw new UnauthorizedError("Session expired")
    }

    const newPlainRefreshToken = generateRefreshToken()
    const newHash = hashRefreshToken(newPlainRefreshToken)
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Session rotation
    await userRepository.deleteSessionByHash(hash)
    await userRepository.createSession(
      session.userId,
      newHash,
      newExpiresAt,
      userAgent || session.userAgent || undefined,
      ipAddress || session.ipAddress || undefined
    )

    const newAccessToken = signAccessToken({
      userId: session.user.id,
      email: session.user.email,
      roles: session.user.roles,
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newPlainRefreshToken,
    }
  }

  async resendOtp(email: string) {
    const user = await userRepository.findUserByEmail(email)
    if (!user) {
      // Return generic success to prevent email scanning
      return { message: "If the email is registered and unverified, a new OTP has been sent." }
    }

    if (user.emailVerified) {
      throw new ConflictError("Email is already verified")
    }

    const otp = generateOtp()
    await userCache.setEmailVerificationOtp(email, otp)

    try {
      await mailService.sendOtpEmail(email, otp)
      logger.info(`Resent verification OTP successfully to ${email}`)
    } catch (err) {
      logger.error(`Failed to resend verification OTP email to ${email}`, err)
    }

    return {
      message: "If the email is registered and unverified, a new OTP has been sent.",
    }
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findUserByEmail(email)
    // Return generic success to prevent email scanning
    if (!user || !user.emailVerified || user.status === "SUSPENDED") {
      return { message: "If the email is registered, a password reset OTP has been sent." }
    }

    const otp = generateOtp()
    await userCache.setUserOtp(email, otp)

    try {
      await mailService.sendResetPasswordOtp(email, otp)
      logger.info(`Password reset OTP sent successfully to ${email}`)
    } catch (err) {
      logger.error(`Failed to send password reset OTP email to ${email}`, err)
    }

    return {
      message: "If the email is registered, a password reset OTP has been sent.",
    }
  }

  async resetPassword(payload: TResetPassword) {
    const { email, otp, newPassword } = payload

    const cachedOtp = await userCache.getUserOtp(email)
    if (!cachedOtp || String(cachedOtp) !== String(otp)) {
      throw new BadRequestError("Invalid or expired password reset OTP")
    }

    const user = await userRepository.findUserByEmail(email)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const passwordHash = await hashPassword(newPassword)
    await userRepository.updateCredentialPassword(user.id, passwordHash)

    // Force log out of all active sessions for security
    await userRepository.deleteAllSessionsForUser(user.id)

    // Invalidate the OTP and User cache details
    await userCache.deleteUserOtp(email)
    await userCache.invalidateUser(user.id)

    return {
      message: "Password reset successfully. Please login with your new password.",
    }
  }
}

export const userService = new UserService()
