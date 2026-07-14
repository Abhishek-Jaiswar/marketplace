import { z } from "zod"

export const updateProfileSchema = z.object({
  phoneNumber: z.string().trim().min(5, { message: "Phone number is too short" }).optional(),
})

export const createAddressSchema = z.object({
  street1: z.string().trim().min(1, { message: "Street 1 is required" }),
  street2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(1, { message: "City is required" }),
  state: z.string().trim().min(1, { message: "State is required" }),
  postalCode: z.string().trim().min(1, { message: "Postal code is required" }),
  country: z.string().trim().min(1, { message: "Country is required" }),
  phoneNumber: z.string().trim().optional(),
})

export const updateAddressSchema = createAddressSchema.partial()
