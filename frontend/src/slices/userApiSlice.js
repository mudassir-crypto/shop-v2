import { apiSlice } from './apiSlice'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/api/v1/login',
        method: 'POST',
        body: data
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/api/v1/register',
        method: 'POST',
        body: data
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/v1/logout',
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/api/v1/user/profile',
        method: 'PUT',
        body: data
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: '/api/v1/users',
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/v1/user/${userId}`,
        method: 'DELETE'
      })
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `/api/v1/user/${userId}`,
      }),
      keepUnusedDataFor: 5
    }),
    updateUserById: builder.mutation({
      query: ({ id, details }) => ({
        url: `/api/v1/user/${id}`,
        method: 'PUT',
        body: { ...details }
      }),
      invalidatesTags: ['Users']
    })
  }),
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateProfileMutation, useGetUsersQuery, useDeleteUserMutation, useGetUserByIdQuery, useUpdateUserByIdMutation } = userApiSlice