import type {
  ApiResponse,
  PaginatedResponse,
} from "@workspace/contracts/common"
import type {
  AddCartItemRequest,
  CartView,
  CheckoutRequest,
  OrderDetailView,
  OrderSummaryView,
} from "@workspace/contracts/commerce"

import { baseApi } from "../baseApi"
import { toQueryString } from "../query-string"

export const commerceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<CartView>, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<ApiResponse<CartView>, AddCartItemRequest>({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      ApiResponse<CartView>,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<ApiResponse<CartView>, string>({
      query: (id) => ({ url: `/cart/items/${id}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    mergeCart: builder.mutation<
      ApiResponse<CartView>,
      { items: { sellerListingId: string; quantity: number }[] }
    >({
      query: (body) => ({ url: "/cart/merge", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    placeOrder: builder.mutation<
      ApiResponse<{ orderNumber: string }>,
      CheckoutRequest
    >({
      query: (body) => ({ url: "/orders/checkout", method: "POST", body }),
      invalidatesTags: ["Cart", "Order"],
    }),
    getOrders: builder.query<
      PaginatedResponse<OrderSummaryView>,
      { page?: number } | void
    >({
      query: (params) => `/orders${toQueryString(params)}`,
      providesTags: ["Order"],
    }),
    getOrder: builder.query<ApiResponse<OrderDetailView>, string>({
      query: (orderNumber) => `/orders/${orderNumber}`,
      providesTags: ["Order"],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
} = commerceApi
