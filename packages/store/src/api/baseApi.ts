import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get base URL from environment or default to local API server port 4000
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    prepareHeaders: (headers) => {
      // Common headers can be set here (e.g., Auth token from localStorage/cookies)
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}), // Endpoints are injected by feature slices or apps
});
