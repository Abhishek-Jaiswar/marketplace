/* eslint-disable react-hooks/refs */
"use client";

import { useRef } from "react";
import { Provider, setupListeners, makeStore, AppStore, useGetMeQuery, useGetSellerMeQuery } from "@workspace/store";

function SellerPreloader() {
  const { data: userData } = useGetMeQuery();
  useGetSellerMeQuery(undefined, {
    skip: !userData?.user,
  });
  return null;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore() as AppStore;
    setupListeners(storeRef.current.dispatch);
  }

  return (
    <Provider store={storeRef.current}>
      <SellerPreloader />
      {children}
    </Provider>
  );
}
