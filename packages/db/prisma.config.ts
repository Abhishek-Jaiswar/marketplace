import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"
import { definePrismaConfig } from "@prisma/cli-engine"
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config"
import type { PrismaNextConfig } from "@prisma/orm-framework/config/config-types"

for (const candidate of [
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), ".env"),
]) {
  dotenv.config({ path: candidate })
}

const schemaDir = path.resolve(process.cwd(), "src/prisma/schema")
const schemaFiles = fs
  .readdirSync(schemaDir)
  .filter((f) => f.endsWith(".prisma"))
  .map((f) => `./src/prisma/schema/${f}`)

const orm: PrismaNextConfig<"sql", "postgres"> = ormConfig({
  contract: "./src/prisma/contract.prisma",
  output: "./src/prisma",
  db: {
    connection: process.env["DATABASE_URL"]!,
  },
})

if (orm.contract) {
  ;(orm.contract.source as unknown as { inputs: string[] }).inputs = schemaFiles
}

export default definePrismaConfig({ orm })
