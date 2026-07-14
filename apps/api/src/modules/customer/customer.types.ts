import { z } from "zod"
import { updateProfileSchema, createAddressSchema, updateAddressSchema } from "./customer.schema.js"

export type TUpdateProfile = z.infer<typeof updateProfileSchema>
export type TCreateAddress = z.infer<typeof createAddressSchema>
export type TUpdateAddress = z.infer<typeof updateAddressSchema>
