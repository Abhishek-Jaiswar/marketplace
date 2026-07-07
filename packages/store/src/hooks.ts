import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import counterReducer from "./slices/counterSlice";

// Create a reference store configuration to infer types
const referenceStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof referenceStore.getState>;
export type AppDispatch = typeof referenceStore.dispatch;
export type AppStore = typeof referenceStore;

// Use throughout your client components for type-safe state access
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();
