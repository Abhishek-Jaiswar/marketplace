import path from "node:path"
import dotenv from "dotenv"
import { execSync } from "node:child_process"

for (const candidate of [
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), ".env"),
]) {
  dotenv.config({ path: candidate })
}

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  console.error("DATABASE_URL is not set")
  process.exit(1)
}

console.log("Connecting to PostgreSQL and resetting public schema...")
const sql =
  "DROP SCHEMA public CASCADE; CREATE SCHEMA public; DROP SCHEMA IF EXISTS prisma_contract CASCADE;"
execSync(`psql "${dbUrl}" -c "${sql}"`, { stdio: "inherit" })
console.log("Schema reset complete.")
