import { and, db, type Models } from "@workspace/db"

import { generateOtp, hashOtp } from "../../utils/security.js"

type OtpType = Models.public_VerificationToken["type"]

const OTP_TTL_MS = 10 * 60 * 1000

/**
 * One-time codes live in Postgres, hashed. Redis is an optional cache here, so
 * an outage there must never stop someone signing up or resetting a password.
 */
class OtpService {
  /** Creates a code, replacing any earlier code of the same type. */
  async issue(userId: string, type: OtpType): Promise<string> {
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString()

    await db.transaction(async (tx) => {
      await tx.orm.public.VerificationToken.where({ userId, type }).delete()
      await tx.orm.public.VerificationToken.create({
        userId,
        type,
        tokenHash: hashOtp(userId, type, otp),
        expiresAt,
      })
    })

    return otp
  }

  /** Returns true and spends the code when it is correct and unexpired. */
  async consume(userId: string, type: OtpType, otp: string): Promise<boolean> {
    const now = new Date().toISOString()
    const token = await db.orm.public.VerificationToken.where((row) =>
      and(row.userId.eq(userId), row.type.eq(type), row.expiresAt.gt(now))
    ).first()

    if (token?.tokenHash !== hashOtp(userId, type, otp)) {
      return false
    }

    await db.orm.public.VerificationToken.where({ id: token.id }).delete()
    return true
  }
}

export const otpService = new OtpService()
