import { spawn } from "child_process"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env.production, or fallback to seller-central/.env
dotenv.config({ path: path.resolve(__dirname, "../../../.env.production") })
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../../seller-central/.env") })
}

console.log("🚀 Launching Prisma Studio connected to Production Database...")

const child = spawn("pnpm", ["exec", "prisma", "studio"], {
  cwd: path.resolve(__dirname, ".."),
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PRISMA_ENV: "production",
  },
})

child.on("exit", (code) => {
  process.exit(code ?? 0)
})
