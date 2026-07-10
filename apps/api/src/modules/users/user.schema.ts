import { z } from "zod"

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, { error: "First name is required" }),
  lastName: z.string().trim().min(1, { error: "Last name is required" }),
  email: z.string().trim().email({ error: "Valid email is required" }),
  password: z.string().trim().min(8, { error: "Password is required" }),
})

export const loginSchema = z.object({
  email: z.string().trim().email({ error: "Valid email is required" }),
  password: z.string().trim().min(8, { error: "Password is required" }),
})

export const resendOtpSchema = z.object({
  email: z.string().trim().email({ error: "Valid email is required" }),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ error: "Valid email is required" }),
})

export const resetPasswordSchema = z.object({
  email: z.string().trim().email({ error: "Valid email is required" }),
  otp: z.string().trim().length(6, { error: "OTP must be exactly 6 digits" }),
  newPassword: z.string().trim().min(8, { error: "New password must be at least 8 characters" }),
})
