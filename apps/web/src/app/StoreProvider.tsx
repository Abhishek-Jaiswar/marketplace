/* eslint-disable react-hooks/refs */
"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore, AppStore } from "../lib/store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    
    // Optional: enable refetchOnFocus/refetchOnReconnect behaviors for RTK Query
    setupListeners(storeRef.current.dispatch);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
