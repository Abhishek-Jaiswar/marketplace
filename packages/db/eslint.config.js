import { nodeConfig } from "@workspace/eslint-config/node"

/** @type {import("eslint").Linter.Config} */
export default [
  ...nodeConfig,
  { ignores: ["src/prisma/contract.d.ts", "migrations/**"] },
]
