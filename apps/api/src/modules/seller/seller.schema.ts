import { z } from "zod"

export const BusinessTypeEnum = z.enum([
  "INDIVIDUAL",
  "SOLE_PROPRIETORSHIP",
  "PARTNERSHIP",
  "LLP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
])

export const registerSellerSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().optional(),
  email: z.string().trim().email({ message: "Valid email is required" }),
  password: z.string().trim().min(8, { message: "Password must be at least 8 characters" }),
})

export const onboardSchema = z.object({
  businessName: z.string().trim().min(1, { message: "Business name is required" }),
  businessType: BusinessTypeEnum,
  gstin: z
    .string()
    .trim()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: "Invalid GSTIN format",
    })
    .optional(),
  contactPhone: z.string().trim().optional(),
  contactEmail: z.string().trim().email({ message: "Valid contact email is required" }).optional(),
})

export const addressSchema = z.object({
  street1: z.string().trim().min(1, { message: "Address Line 1 is required" }),
  street2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(1, { message: "City is required" }),
  state: z.string().trim().min(1, { message: "State is required" }),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  phoneNumber: z.string().trim().optional(),
})

export const storeSchema = z.object({
  displayName: z.string().trim().min(1, { message: "Store display name is required" }),
  slug: z
    .string()
    .trim()
    .min(3, { message: "Slug must be at least 3 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug must only contain lowercase letters, numbers, and hyphens" }),
  description: z.string().trim().optional(),
  address: addressSchema,
})

export const bankAccountSchema = z.object({
  accountHolderName: z.string().trim().min(1, { message: "Account holder name is required" }),
  accountNumber: z.string().trim().min(1, { message: "Account number is required" }),
  ifscCode: z
    .string()
    .trim()
    .min(1, { message: "IFSC code is required" })
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format" }),
  bankName: z.string().trim().min(1, { message: "Bank name is required" }),
})

export const verifySellerSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  remarks: z.string().trim().optional(),
})
