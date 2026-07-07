import { configureStore } from "@reduxjs/toolkit";
import { baseApi, counterReducer } from "@workspace/store";
import type { AppStore } from "@workspace/store";

export const makeStore = (): AppStore => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      counter: counterReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  }) as AppStore;
};

// Re-export the typed store definitions directly from the store package
export type { AppStore, RootState, AppDispatch } from "@workspace/store";
