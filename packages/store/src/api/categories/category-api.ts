import { baseApi } from "../baseApi"
import type {
  GetCategoryTreeParams,
  GetCategoryTreeResponse,
  ListCategoriesParams,
  ListCategoriesResponse,
  GetCategoryByIdResponse,
  GetCategoryBySlugResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  ToggleCategoryStatusRequest,
  ToggleCategoryStatusResponse,
  DeleteCategoryResponse,
} from "./category-api.types"

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryTree: builder.query<GetCategoryTreeResponse, GetCategoryTreeParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.includeInactive !== undefined) {
          queryParams.append("includeInactive", String(params.includeInactive))
        }
        const queryString = queryParams.toString()
        return `/categories/tree${queryString ? `?${queryString}` : ""}`
      },
      providesTags: ["CategoryTree"],
    }),

    listCategories: builder.query<ListCategoriesResponse, ListCategoriesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append("page", String(params.page))
        if (params?.limit) queryParams.append("limit", String(params.limit))
        if (params?.search) queryParams.append("search", params.search)
        if (params?.parentId !== undefined && params.parentId !== null) {
          queryParams.append("parentId", params.parentId)
        }
        if (params?.isActive !== undefined) {
          queryParams.append("isActive", String(params.isActive))
        }
        const queryString = queryParams.toString()
        return `/categories${queryString ? `?${queryString}` : ""}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Category" as const, id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    getCategoryById: builder.query<GetCategoryByIdResponse, string>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    getCategoryBySlug: builder.query<GetCategoryBySlugResponse, string>({
      query: (slug) => `/categories/slug/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Category", id: slug }],
    }),

    createCategory: builder.mutation<CreateCategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }, "CategoryTree"],
    }),

    updateCategory: builder.mutation<UpdateCategoryResponse, UpdateCategoryRequest>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        "CategoryTree",
      ],
    }),

    toggleCategoryStatus: builder.mutation<
      ToggleCategoryStatusResponse,
      ToggleCategoryStatusRequest
    >({
      query: ({ id, isActive }) => ({
        url: `/categories/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        "CategoryTree",
      ],
    }),

    deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
        "CategoryTree",
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCategoryTreeQuery,
  useLazyGetCategoryTreeQuery,
  useListCategoriesQuery,
  useLazyListCategoriesQuery,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useLazyGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useToggleCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoryApi
