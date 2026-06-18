import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../../env";
import baseQueryWithAuth from "../../utils/AuthProtect";

export const roleApi = createApi({

    reducerPath: "roleApi",

    baseQuery: baseQueryWithAuth,

    tagTypes: ["Roles"],

    endpoints: (builder) => ({

        getRoles: builder.query<any, void>({
            query: () => ({
                url: "/roles",
                method: "GET",
            }),
            providesTags: ["Roles"],
        }),

        createRole: builder.mutation<any, any>({
            query: (body) => ({
                url: "/roles",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        updateRole: builder.mutation<any, any>({
            query: ({ role_id, ...body }) => ({
                url: `/roles/${role_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Roles"],
        }),

        deleteRole: builder.mutation<any, number>({
            query: (role_id) => ({
                url: `/roles/${role_id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Roles"],
        }),
    }),

});


export const {
    useGetRolesQuery,
    useUpdateRoleMutation,
    useCreateRoleMutation,
    useDeleteRoleMutation
} = roleApi