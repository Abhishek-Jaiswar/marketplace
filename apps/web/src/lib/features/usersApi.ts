import { baseApi } from "@workspace/store";

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

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
    createUser: build.mutation<User, { name: string; email: string }>({
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
