import postgres from "@prisma/orm-postgres/runtime"
import type { PostgresClient } from "@prisma/orm-postgres/runtime"
import { contractFromJson } from "@prisma/orm-postgres/static"
import { budgets, lints } from "@prisma/orm-postgres/family-runtime"
import type { Contract } from "./contract.js"
import contractJson from "./contract.json" with { type: "json" }
import { dbEnv } from "../env.js"

export const contract = contractFromJson<Contract>(contractJson)

export const db: PostgresClient<Contract> = postgres({
  contract,
  // Budgets below are severity warn; strict mode would throw on them anyway.
  mode: "permissive",
  ...(dbEnv.DATABASE_URL ? { url: dbEnv.DATABASE_URL } : {}),
  middleware: [
    lints({
      severities: {
        selectStar: "warn",
        deleteWithoutWhere: "error",
        updateWithoutWhere: "error",
        readOnlyMutation: "error",
      },
    }),
    budgets({
      maxRows: 25_000,
      defaultTableRows: 25_000,
      maxLatencyMs: dbEnv.SLOW_QUERY_THRESHOLD,
      severities: { rowCount: "warn", latency: "warn" },
    }),
  ],
})
