import argon2 from "argon2"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { Env } from "../config/env.config.js"

export interface AccessTokenPayload {
  userId: string
  email: string
  roles: string[]
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await argon2.verify(hash, password)
}

export function generateOtp(): string {
  // Generate a cryptographically secure 6-digit number
  const otpVal = crypto.randomInt(100000, 1000000)
  return otpVal.toString()
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, Env.JWT_SECRET, { expiresIn: "15m" })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, Env.JWT_SECRET) as AccessTokenPayload
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex")
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}
