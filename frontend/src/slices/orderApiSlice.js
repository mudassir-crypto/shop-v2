import { apiSlice } from './apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/api/v1/order/create',
        method: 'POST',
        body: data
      }),
    }),
    getMyOrderById: builder.query({
      query: (id) => ({
        url: `/api/v1/myorder/${id}`
      }),
      keepUnusedDataFor: 5
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: '/api/v1/myorders'
      }),
      keepUnusedDataFor: 5
    }),
    payOrder: builder.mutation({
      query: (id) => ({
        url: `/api/v1/order/${id}/pay`,
        method: 'PATCH',
      }),
      keepUnusedDataFor: 5
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: '/api/v1/config/paypal',
      }),
      keepUnusedDataFor: 5
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: '/api/v1/order/all',
      }),
      keepUnusedDataFor: 5
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `/api/v1/order/${id}`
      }),
      keepUnusedDataFor: 5
    }),
    updateOrderToDelivered: builder.mutation({
      query: (id) => ({
        url: `/api/v1/order/${id}/deliver`,
        method: 'PATCH'
      })
    }),
    getRazorpayKey: builder.query({
      query: () => ({
        url: '/api/v1/payment/razorpaykey',
      }),
      keepUnusedDataFor: 5
    }),
    createRazorpayOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/v1/payment/create-order/${orderId}`,
        method: 'POST',
      })
    }),
    verifyRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: `/api/v1/payment/verify-payment/${data.orderId}`,
        method: 'POST',
        body: data
      })
    }),
  })
})

export const { useCreateOrderMutation, useGetMyOrderByIdQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useGetMyOrdersQuery, useGetAllOrdersQuery, useGetOrderByIdQuery, useUpdateOrderToDeliveredMutation, useGetRazorpayKeyQuery, useCreateRazorpayOrderMutation, useVerifyRazorpayOrderMutation } = orderApiSlice