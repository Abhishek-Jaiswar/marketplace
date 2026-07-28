import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import counterReducer from "./slices/counterSlice";
import authReducer from "./slices/authSlice";
import onboardingReducer from "./slices/onboardingSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      counter: counterReducer,
      auth: authReducer,
      onboarding: onboardingReducer,
    },
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
