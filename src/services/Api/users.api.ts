import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../../utils/AuthProtect";

export const usersApi = createApi({

  reducerPath: "userApi",

  baseQuery: baseQueryWithAuth,

  tagTypes: ["Users"],


  endpoints: (builder) => ({

    getUsers: builder.query<any, any>({
      query: ({ limit, offset }) => ({
        url: `/users/?limit=${limit}&offset=${offset}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<any, any>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<any, any>({
      query: ({ user_id, ...body }) => ({
        url: `/users/${user_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<any, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});


export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApi