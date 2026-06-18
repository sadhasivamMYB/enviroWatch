import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../../utils/AuthProtect";

export const metricsApi = createApi({
    reducerPath: "metricsApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["metrics"],
    endpoints: (builder) => ({
        getMetrics: builder.query({
            query: () => "/metrics",
            providesTags: ["metrics"],
        }),

        // POST metrics
        addMetrics: builder.mutation<any, any>({
            query: (body) => ({
                url: "/metrics",
                method: "POST",
                body,
            }),
            invalidatesTags: ["metrics"],
        }),
    }),
})

export const { useGetMetricsQuery } = metricsApi;