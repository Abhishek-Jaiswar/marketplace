import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform(
      (value) =>
        value
          ?.split(",")
          .map((origin) => origin.trim())
          .filter(Boolean) ?? []
    ),
  JSON_BODY_LIMIT: z.string().default("1mb"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  REDIS_URL: z.url().default("redis://localhost:6379"),
  REDIS_CONNECT_TIMEOUT_MS: z.coerce.number().int().positive().default(5_000),
  TRUST_PROXY: z.coerce.boolean().default(false),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_CLOUD_API_KEY: z.string().min(1),
  CLOUDINARY_CLOUD_API_SECRET: z.string().min(1),

  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  JWT_SECRET: z.string().default("cbs-marketplace-super-secret-key-123456!@#"),
})

const parseEnv = () => {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ")

    throw new Error(`Invalid environment configuration: ${details}`)
  }

  return result.data
}

export const Env = parseEnv()

export const isDevelopment = Env.NODE_ENV === "development"
export const isProduction = Env.NODE_ENV === "production"
