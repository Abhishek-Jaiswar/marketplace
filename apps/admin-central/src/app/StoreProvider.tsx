/* eslint-disable react-hooks/refs */
"use client";

import { useRef } from "react";
import { Provider, setupListeners, makeStore, AppStore } from "@workspace/store";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore() as AppStore;
    setupListeners(storeRef.current.dispatch);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
