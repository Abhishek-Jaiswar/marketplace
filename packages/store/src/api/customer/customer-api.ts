import { baseApi } from "../baseApi";
import type {
  Customer,
  Address,
  UpdateCustomerProfileRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "./customer-api.types";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerProfile: builder.query<{ customer: Customer }, void>({
      query: () => "/customers/profile",
      providesTags: ["Customer"],
    }),
    updateCustomerProfile: builder.mutation<{ message: string; customer: Customer }, UpdateCustomerProfileRequest>({
      query: (payload) => ({
        url: "/customers/profile",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    createCustomerAddress: builder.mutation<{ message: string; address: Address }, CreateAddressRequest>({
      query: (payload) => ({
        url: "/customers/addresses",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomerAddress: builder.mutation<{ message: string; address: Address }, { addressId: string; body: UpdateAddressRequest }>({
      query: ({ addressId, body }) => ({
        url: `/customers/addresses/${addressId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCustomerAddress: builder.mutation<{ message: string }, string>({
      query: (addressId) => ({
        url: `/customers/addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    setDefaultShippingAddress: builder.mutation<{ message: string; customer: Customer }, string>({
      query: (addressId) => ({
        url: `/customers/addresses/${addressId}/default-shipping`,
        method: "PATCH",
      }),
      invalidatesTags: ["Customer"],
    }),
    setDefaultBillingAddress: builder.mutation<{ message: string; customer: Customer }, string>({
      query: (addressId) => ({
        url: `/customers/addresses/${addressId}/default-billing`,
        method: "PATCH",
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCustomerProfileQuery,
  useLazyGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
  useSetDefaultShippingAddressMutation,
  useSetDefaultBillingAddressMutation,
} = customerApi;
