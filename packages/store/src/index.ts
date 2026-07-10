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
