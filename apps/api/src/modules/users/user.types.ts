import { z } from "zod"
import { registerSchema, loginSchema, resetPasswordSchema } from "./user.schema.js"

export type TRegister = z.infer<typeof registerSchema>
export type TLogin = z.infer<typeof loginSchema>
export type TResetPassword = z.infer<typeof resetPasswordSchema>
