import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenReceived, loggedOut } from "../slices/authSlice";

class SimpleMutex {
  private promise: Promise<void> = Promise.resolve();
  private locked = false;

  isLocked() {
    return this.locked;
  }

  async waitForUnlock() {
    while (this.locked) {
      await this.promise;
    }
  }

  async acquire(): Promise<() => void> {
    this.locked = true;
    let release: () => void = () => {};
    const nextPromise = new Promise<void>((resolve) => {
      release = () => {
        this.locked = false;
        resolve();
      };
    });
    const currentPromise = this.promise;
    this.promise = currentPromise.then(() => nextPromise);
    await currentPromise;
    return release;
  }
}

const mutex = new SimpleMutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/users/refresh", method: "POST" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const data = refreshResult.data as { accessToken: string };
          api.dispatch(tokenReceived(data.accessToken));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Seller", "SellerList", "Customer"],
  endpoints: () => ({}),
});
