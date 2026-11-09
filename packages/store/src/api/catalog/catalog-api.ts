import { baseApi } from "../baseApi"
import type {
  ListBrandsParams,
  ListBrandsResponse,
  CreateBrandRequest,
  Brand,
  ListProductsParams,
  ListProductsResponse,
  Product,
  CreateProductRequest,
  ReviewProductRequest,
  CreateVariantRequest,
  ProductVariant,
  ListListingsParams,
  ListListingsResponse,
  SellerListing,
  CreateListingRequest,
  UpdateListingRequest,
} from "./catalog-api.types"

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<ListBrandsResponse, ListBrandsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.page) queryParams.append("page", String(params.page))
        if (params?.limit) queryParams.append("limit", String(params.limit))
        if (params?.search) queryParams.append("search", params.search)
        if (params?.isVerified !== undefined)
          queryParams.append("isVerified", String(params.isVerified))
        const qs = queryParams.toString()
        return `/catalog/brands${qs ? `?${qs}` : ""}`
      },
      providesTags: ["Brand"],
    }),

    createBrand: builder.mutation<
      { data: Brand; message: string },
      CreateBrandRequest
    >({
      query: (body) => ({
        url: "/catalog/brands",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Brand"],
    }),

    getProducts: builder.query<ListProductsResponse, ListProductsParams | void>(
      {
        query: (params) => {
          const queryParams = new URLSearchParams()
          if (params?.page) queryParams.append("page", String(params.page))
          if (params?.limit) queryParams.append("limit", String(params.limit))
          if (params?.search) queryParams.append("search", params.search)
          if (params?.categoryId)
            queryParams.append("categoryId", params.categoryId)
          if (params?.brandId) queryParams.append("brandId", params.brandId)
          if (params?.status) queryParams.append("status", params.status)
          const qs = queryParams.toString()
          return `/catalog/products${qs ? `?${qs}` : ""}`
        },
        providesTags: ["Product"],
      }
    ),

    getProductById: builder.query<{ data: Product }, string>({
      query: (id) => `/catalog/products/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Product", id }],
    }),

    getProductBySlug: builder.query<{ data: Product }, string>({
      query: (slug) => `/catalog/products/slug/${slug}`,
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation<
      { data: Product; message: string },
      CreateProductRequest
    >({
      query: (body) => ({
        url: "/catalog/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    reviewProduct: builder.mutation<
      { data: Product; message: string },
      ReviewProductRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/catalog/products/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    createProductVariant: builder.mutation<
      { data: ProductVariant; message: string },
      CreateVariantRequest
    >({
      query: ({ productId, ...body }) => ({
        url: `/catalog/products/${productId}/variants`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    getListings: builder.query<ListListingsResponse, ListListingsParams | void>(
      {
        query: (params) => {
          const queryParams = new URLSearchParams()
          if (params?.page) queryParams.append("page", String(params.page))
          if (params?.limit) queryParams.append("limit", String(params.limit))
          if (params?.variantId)
            queryParams.append("variantId", params.variantId)
          if (params?.status) queryParams.append("status", params.status)
          if (params?.sellerId) queryParams.append("sellerId", params.sellerId)
          const qs = queryParams.toString()
          return `/catalog/listings${qs ? `?${qs}` : ""}`
        },
        providesTags: ["Listing"],
      }
    ),

    createListing: builder.mutation<
      { data: SellerListing; message: string },
      CreateListingRequest
    >({
      query: (body) => ({
        url: "/catalog/listings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Listing", "Inventory"],
    }),

    updateListing: builder.mutation<
      { data: SellerListing; message: string },
      UpdateListingRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/catalog/listings/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Listing"],
    }),
  }),
})

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useReviewProductMutation,
  useCreateProductVariantMutation,
  useGetListingsQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
} = catalogApi
