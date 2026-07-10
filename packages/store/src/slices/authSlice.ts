import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../api/auth/auth-api.types";

export interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    tokenReceived: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    userProfileReceived: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { tokenReceived, userProfileReceived, loggedOut } = authSlice.actions;

export default authSlice.reducer;
