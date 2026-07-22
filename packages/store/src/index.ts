// Base API and RTK Query
export { baseApi } from "./api/baseApi";

// Counter Slice and Actions
export {
  counterSlice,
  increment,
  decrement,
  incrementByAmount,
} from "./slices/counterSlice";
export { default as counterReducer } from "./slices/counterSlice";

// Auth Slice and Actions
export {
  authSlice,
  tokenReceived,
  userProfileReceived,
  loggedOut,
} from "./slices/authSlice";
export { default as authReducer } from "./slices/authSlice";
export type { AuthState } from "./slices/authSlice";

// Auth API types
export type {
  UserProfile,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LogoutResponse,
  GetMeResponse,
} from "./api/auth/auth-api.types";

// Auth API and Hooks
export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} from "./api/auth/auth-api";

// Custom Typed Hooks & Types
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";
export type { RootState, AppDispatch, AppStore } from "./hooks";

// Seller API Types
export type {
  BusinessType,
  SellerStatus,
  VerificationStatus,
  SellerDocumentType,
  Address,
  Store,
  BankAccount,
  Media,
  SellerDocument,
  SellerVerification,
  Seller,
  RegisterSellerRequest,
  OnboardRequest,
  UpdateStoreRequest,
  BankAccountRequest,
  VerifySellerRequest,
  PaginatedSellersResponse,
} from "./api/seller/seller-api.types";

// Seller API and Hooks
export {
  sellerApi,
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
} from "./api/seller/seller-api";

// Customer API Types
export type {
  Address as CustomerAddress,
  User as CustomerUser,
  Customer,
  UpdateCustomerProfileRequest,
  CreateAddressRequest,
  UpdateAddressRequest,
} from "./api/customer/customer-api.types";

// Customer API and Hooks
export {
  customerApi,
  useGetCustomerProfileQuery,
  useLazyGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useCreateCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
  useSetDefaultShippingAddressMutation,
  useSetDefaultBillingAddressMutation,
} from "./api/customer/customer-api";


