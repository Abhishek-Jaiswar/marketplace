import { execFileSync, execSync } from "node:child_process"

import { repoRoot, resolveTestDatabaseUrl } from "./vitest.shared.ts"

/** Creates the test database if needed and brings it up to the contract. */
export default function setup(): void {
  const databaseUrl = resolveTestDatabaseUrl()
  const url = new URL(databaseUrl)
  const databaseName = url.pathname.slice(1)
  if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
    throw new Error(`Unsupported test database name '${databaseName}'`)
  }

  url.pathname = "/postgres"
  const psql = (sql: string) =>
    execFileSync("psql", [url.toString(), "-tAc", sql], {
      encoding: "utf8",
    }).trim()

  const exists = psql(
    `SELECT 1 FROM pg_database WHERE datname = '${databaseName}'`
  )
  if (!exists) {
    psql(`CREATE DATABASE "${databaseName}"`)
  }

  // --db keeps this from advancing the committed `db` migration ref.
  execSync(
    `pnpm --filter @workspace/db exec prisma db update --db "${databaseUrl}" --yes`,
    {
      cwd: repoRoot,
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: "pipe",
    }
  )
}
