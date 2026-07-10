export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  status: string;
  emailVerified: boolean;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface RegisterResponse {
  message: string;
  user: UserProfile;
}

export interface VerifyOtpResponse {
  message: string;
  user: UserProfile;
}

export interface ResendOtpResponse {
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface GetMeResponse {
  user: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}