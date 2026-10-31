import path from "node:path"
import dotenv from "dotenv"

for (const candidate of [
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../../.env"),
]) {
  dotenv.config({ path: candidate })
}

export const dbEnv = {
  get DATABASE_URL(): string {
    return process.env.DATABASE_URL ?? ""
  },
  get SLOW_QUERY_THRESHOLD(): number {
    return Number.parseInt(process.env.SLOW_QUERY_THRESHOLD_MS ?? "500", 10)
  },
}
