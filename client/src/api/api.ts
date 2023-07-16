import { StateI, StoreDataI, StoreI } from "@/types/Types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders(headers, { getState }) {
      const { persistedReducer } = getState() as StateI;

      if (persistedReducer.token) {
        headers.set("Authorization", `Bearer ${persistedReducer.token}`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (basicAuthToken) => ({
        url: "/auth/login",
        method: "POST",
        headers: { Authorization: `Basic ${basicAuthToken}` },
      }),
    }),
    register: builder.mutation({
      query: (values) => ({
        url: "/auth/register",
        method: "POST",
        body: values,
      }),
    }),
    verifyToken: builder.query({
      query: () => "/auth/verify-token",
    }),
    getProductsByStore: builder.mutation<
      StoreDataI,
      { storeId: string; page: number }
    >({
      query: ({ storeId, page }) => ({
        url: `/api/v1/products/store/${storeId}`,
        method: "GET",
        params: { page },
      }),
    }),
    getStores: builder.query<Array<StoreI>, null>({
      query: () => "/api/v1/store",
    }),
    getParentCategories: builder.query({
      query: () => "/api/v1/parent-category",
    }),
    createNewProduct: builder.mutation<null, FormData>({
      query: (formData) => ({
        url: `/api/v1/products`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/api/v1/products/${productId}`,
        method: "DELETE",
      }),
    }),
    getProductById: builder.mutation({
      query: ({ productId }) => ({
        url: `/api/v1/products/${productId}`,
        method: "GET",
      }),
    }),
    getSubCategoryByParentId: builder.mutation({
      query: ({ parentId }) => ({
        url: `/api/v1/sub-category/parent-category/${parentId}`,
        method: "GET",
      }),
    }),
    getAllStores: builder.mutation({
      query: () => ({
        url: `/api/v1/store`,
        method: "GET",
      }),
    }),
    getAllParentCategories: builder.mutation({
      query: () => ({
        url: `/api/v1/parent-category`,
        method: "GET",
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/api/v1/products/${productId}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    addStore: builder.mutation({
      query: (formData) => ({
        url: `/api/v1/store`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteStore: builder.mutation({
      query: ({ storeId }) => ({
        url: `/api/v1/store/${storeId}`,
        method: "DELETE",
      }),
    }),
    addParentCategory: builder.mutation({
      query: (formData) => ({
        url: `/api/v1/parent-category`,
        method: "POST",
        body: formData,
      }),
    }),
    deleteParentCategory: builder.mutation({
      query: ({ parentCategoryId }) => ({
        url: `/api/v1/parent-category/${parentCategoryId}`,
        method: "DELETE",
      }),
    }),
    deleteSubCategory: builder.mutation({
      query: ({ subCategoryId }) => ({
        url: `/api/v1/sub-category/${subCategoryId}`,
        method: "DELETE",
      }),
    }),
    addSubCategory: builder.mutation({
      query: (formData) => ({
        url: `/api/v1/sub-category`,
        method: "POST",
        body: formData,
      }),
    }),
    getSubCategory: builder.mutation({
      query: ({ subCategoryId }) => ({
        url: `/api/v1/sub-category/${subCategoryId}`,
        method: "GET",
      }),
    }),
    updateSubCategory: builder.mutation({
      query: ({ subCategoryId, formData }) => ({
        url: `/api/v1/sub-category/${subCategoryId}`,
        method: "PATCH",
        body: formData,
      }),
    }),
    getSubCategoryParentIsNull: builder.mutation({
      query: () => ({
        url: `/api/v1/sub-category/null-parent-categories`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyTokenQuery,
  useGetProductsByStoreMutation,
  useGetStoresQuery,
  useGetParentCategoriesQuery,
  useCreateNewProductMutation,
  useDeleteProductMutation,
  useGetProductByIdMutation,
  useGetSubCategoryByParentIdMutation,
  useGetAllParentCategoriesMutation,
  useGetAllStoresMutation,
  useUpdateProductMutation,
  useAddStoreMutation,
  useDeleteStoreMutation,
  useAddParentCategoryMutation,
  useDeleteSubCategoryMutation,
  useDeleteParentCategoryMutation,
  useAddSubCategoryMutation,
  useGetSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useGetSubCategoryParentIsNullMutation,
} = api;
