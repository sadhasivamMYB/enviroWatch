import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../../env";
import type { ApiResponse } from "../../types/common.type";
import type { IUser } from "../../types/login.type";



type LoginType = {
    username: string
    password: string
}

// type LoginResponse = {
//     access_token: string
//     token_type: string
// }

export const loginApi = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: BaseURL + "/api/v1/auth",
    }),
    endpoints: (builder) => ({
        login: builder.mutation<ApiResponse<IUser>, LoginType>({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
    }),
});


export const { useLoginMutation } = loginApi;