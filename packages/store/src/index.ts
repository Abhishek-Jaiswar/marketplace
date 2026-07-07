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

// Custom Typed Hooks & Types
export { useAppDispatch, useAppSelector, useAppStore } from "./hooks";
export type { RootState, AppDispatch, AppStore } from "./hooks";
