import { existsSync } from "node:fs"
import path from "node:path"

export const repoRoot = path.resolve(import.meta.dirname, "../..")

export const testEnv = {
  NODE_ENV: "development",
  LOG_LEVEL: "silent",
  DISABLE_FILE_LOGGING: "true",
  DATABASE_URL: "postgresql://test:test@localhost:5432/not_used_test",
  REDIS_URL: "redis://localhost:6379",
  CLOUDINARY_CLOUD_NAME: "test",
  CLOUDINARY_CLOUD_API_KEY: "test",
  CLOUDINARY_CLOUD_API_SECRET: "test",
  MAIL_USER: "test@example.com",
  MAIL_PASS: "test",
  JWT_SECRET: "test-only-jwt-secret-with-enough-length",
}

/**
 * Resolves the integration database: TEST_DATABASE_URL when set, otherwise
 * DATABASE_URL with `_test` appended to its name. Refuses any other database
 * so tests can never write to development data.
 */
export function resolveTestDatabaseUrl(): string {
  const envFile = path.join(repoRoot, ".env")
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile)
  }

  const configured = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL
  if (!configured) {
    throw new Error(
      "Set TEST_DATABASE_URL or DATABASE_URL to run integration tests"
    )
  }

  const url = new URL(configured)
  if (!process.env.TEST_DATABASE_URL) {
    url.pathname = `${url.pathname}_test`
  }
  if (!url.pathname.endsWith("_test")) {
    throw new Error(
      `Refusing to use non-test database '${url.pathname.slice(1)}'`
    )
  }
  return url.toString()
}
