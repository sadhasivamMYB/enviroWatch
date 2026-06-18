import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../../env";
import baseQueryWithAuth from "../../utils/AuthProtect";


export const alertsApi = createApi({

    reducerPath: "alertsApi",
    baseQuery: baseQueryWithAuth,


    tagTypes: ["alerts"],

    endpoints: (builder) => ({

        // GET - Alert Rules
        getAlertRules: builder.query<any, void>({
            query: () => "/alert-rules",
            providesTags: ["alerts"]
        }),

        getActiveAlerts: builder.query<any, void>({
            query: () => "/alerts/active-alerts",
            providesTags: ["alerts"]
        }),

        // POST - ADD Alert Rule
        addAlertRule: builder.mutation<any, any>({
            query: (body) => ({
                url: "/alerts/alert-rules",
                method: "POST",
                body,
            }),
            invalidatesTags: ["alerts"]
        }),

        updateAlertRule: builder.mutation<any, any>({
            query: ({ id, body }) => ({
                url: `/alerts/alert-rules/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["alerts"]
        }),

        deleteAlertRule: builder.mutation<any, string>({
            query: (id) => ({
                url: `/alerts/alert-rules/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["alerts"]
        })
    })
})

export const { useGetAlertRulesQuery, useGetActiveAlertsQuery, useAddAlertRuleMutation, useUpdateAlertRuleMutation } = alertsApi