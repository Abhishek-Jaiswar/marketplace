import { baseApi } from "../baseApi";
import { tokenReceived, userProfileReceived } from "../../slices/authSlice";
import type {
  Seller,
  RegisterSellerRequest,
  OnboardRequest,
  UpdateStoreRequest,
  BankAccountRequest,
  VerifySellerRequest,
  PaginatedSellersResponse,
  Store,
  BankAccount,
  BusinessType,
} from "./seller-api.types";

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerSeller: builder.mutation<{ message: string; user: any; seller: Seller }, RegisterSellerRequest>({
      query: (payload) => ({
        url: "/sellers/register",
        method: "POST",
        body: payload,
      }),
    }),
    verifyGstin: builder.query<{ tradeName: string; legalName: string; businessType: BusinessType; state: string; status: string }, string>({
      query: (gstin) => `/sellers/verify-gstin?gstin=${gstin}`,
    }),
    onboardSeller: builder.mutation<{ message: string; user: any; seller: Seller; accessToken: string }, OnboardRequest>({
      query: (payload) => ({
        url: "/sellers/onboard",
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Dynamically update tokens and profile on the client
          dispatch(tokenReceived(data.accessToken));
          dispatch(userProfileReceived(data.user));
        } catch {
          // Ignore
        }
      },
      invalidatesTags: ["Seller"],
    }),
    getSellerMe: builder.query<{ seller: Seller }, void>({
      query: () => "/sellers/me",
      providesTags: ["Seller"],
    }),
    updateSellerProfile: builder.mutation<{ message: string; seller: Seller }, OnboardRequest>({
      query: (payload) => ({
        url: "/sellers/profile",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Seller"],
    }),
    updateStore: builder.mutation<{ message: string; store: Store }, UpdateStoreRequest>({
      query: (payload) => ({
        url: "/sellers/store",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Seller"],
    }),
    addBankAccount: builder.mutation<{ message: string; account: BankAccount }, BankAccountRequest>({
      query: (payload) => ({
        url: "/sellers/bank-accounts",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Seller"],
    }),
    uploadDocument: builder.mutation<{ message: string; document: any }, FormData>({
      query: (formData) => ({
        url: "/sellers/documents",
        method: "POST",
        body: formData,
        // FormData needs headers to be automatically set by the browser (multipart/form-data boundary)
      }),
      invalidatesTags: ["Seller"],
    }),
    submitOnboarding: builder.mutation<{ message: string; seller: Seller }, void>({
      query: () => ({
        url: "/sellers/submit",
        method: "POST",
      }),
      invalidatesTags: ["Seller"],
    }),
    getSellersAdmin: builder.query<PaginatedSellersResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/sellers",
        params: params || undefined,
      }),
      providesTags: ["SellerList"],
    }),
    verifySellerAdmin: builder.mutation<{ message: string; seller: Seller }, { sellerId: string; body: VerifySellerRequest }>({
      query: ({ sellerId, body }) => ({
        url: `/sellers/${sellerId}/verify`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Seller", "SellerList"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterSellerMutation,
  useVerifyGstinQuery,
  useLazyVerifyGstinQuery,
  useOnboardSellerMutation,
  useGetSellerMeQuery,
  useLazyGetSellerMeQuery,
  useUpdateSellerProfileMutation,
  useUpdateStoreMutation,
  useAddBankAccountMutation,
  useUploadDocumentMutation,
  useSubmitOnboardingMutation,
  useGetSellersAdminQuery,
  useVerifySellerAdminMutation,
} = sellerApi;
