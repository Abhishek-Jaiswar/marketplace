import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import counterReducer from "./slices/counterSlice";
import authReducer from "./slices/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      counter: counterReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
