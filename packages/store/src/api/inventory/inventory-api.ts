import type { ApiResponse } from "@workspace/contracts/common"

import { baseApi } from "../baseApi"
import { toQueryString } from "../query-string"
import type {
  AdjustStockRequest,
  CreateLocationRequest,
  InventoryItem,
  InventoryLedgerEntry,
  InventoryLocation,
  ListInventoryParams,
  ListInventoryResponse,
  ListLedgerParams,
  ListLedgerResponse,
} from "./inventory-api.types"

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<ApiResponse<InventoryLocation[]>, void>({
      query: () => "/inventory/locations",
      providesTags: ["Location"],
    }),

    createLocation: builder.mutation<
      ApiResponse<InventoryLocation>,
      CreateLocationRequest
    >({
      query: (body) => ({
        url: "/inventory/locations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Location"],
    }),

    adjustStock: builder.mutation<
      ApiResponse<{ item: InventoryItem; ledgerEntry: InventoryLedgerEntry }>,
      AdjustStockRequest
    >({
      query: (body) => ({
        url: "/inventory/adjust",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Inventory", "Listing"],
    }),

    getInventory: builder.query<
      ListInventoryResponse,
      ListInventoryParams | void
    >({
      query: (params) => `/inventory/items${toQueryString(params)}`,
      providesTags: ["Inventory"],
    }),

    getLedger: builder.query<ListLedgerResponse, ListLedgerParams | void>({
      query: (params) => `/inventory/ledger${toQueryString(params)}`,
      providesTags: ["Inventory"],
    }),
  }),
})

export const {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useAdjustStockMutation,
  useGetInventoryQuery,
  useGetLedgerQuery,
} = inventoryApi
