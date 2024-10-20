import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, page }) => ({
        url: '/api/v1/products',
        params: {
          keyword,
          page
        }
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5
    }),
    getProductById: builder.query({
      query: (productId) => ({
        url: `/api/v1/products/${productId}`
      }),
      keepUnusedDataFor: 5
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: '/api/v1/product/create',
        method: 'POST'
      }),
      invalidatesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query: ({id, updatedProduct}) => ({
        url: `/api/v1/products/${id}`,
        method: 'PUT',
        body: {...updatedProduct}
      }),
      invalidatesTags: ['Products']
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/api/v1/upload/',
        method: 'POST',
        body: data
      })
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/v1/products/${productId}`,
        method: 'DELETE'
      })
    }),
    addReview: builder.mutation({
      query: ({ productId, data}) => ({
        url: `/api/v1/review/${productId}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Product']
    }),

    // admin
    adminGetProducts: builder.query({
      query: ({ keyword, page }) => ({
        url: '/api/v1/admin/products',
        params: {
          keyword, page
        }
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: '/api/v1/products/top'
      }),
      keepUnusedDataFor: 5
    }),
  })
})

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation, useUploadProductImageMutation, useDeleteProductMutation, useAddReviewMutation, useAdminGetProductsQuery, useGetTopProductsQuery} = productApiSlice