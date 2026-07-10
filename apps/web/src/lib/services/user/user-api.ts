import { baseApi } from "@workspace/store";
import type { User, CreateUserRequest } from "./user-api.types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),
    createUser: build.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
