import type { PaginatedResponse } from "@workspace/contracts/common"
import type {
  InventoryItem,
  InventoryLedgerEntry,
} from "@workspace/contracts/inventory"

export type {
  AdjustStockRequest,
  CreateLocationRequest,
  InventoryItem,
  InventoryLedgerEntry,
  InventoryLocation,
  ListInventoryParams,
  ListLedgerParams,
} from "@workspace/contracts/inventory"

export type ListInventoryResponse = PaginatedResponse<InventoryItem>
export type ListLedgerResponse = PaginatedResponse<InventoryLedgerEntry>
