import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get base URL from environment or default to local API server port 4000
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side execution
    return window.location.protocol + "//" + window.location.hostname + ":4000/api";
  }
  // Server-side execution
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      // Common headers can be set here (e.g., Auth token from localStorage/cookies)
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: () => ({}), // Endpoints are injected by feature slices or apps
});
