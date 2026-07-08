import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import baseQueryWithAuth from "../../utils/AuthProtect";
export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithAuth,

    endpoints: (builder) => (

        {
            getDashboard: builder.query<any, void>({
                query: () => "/dashboard",
            }),

            getDashboardLocationHealth: builder.query<any, void>({
                query: () => "/dashboard/location-health",
            }),

            getDashboardDeviceHealth: builder.query<any, void>({
                query: () => "/dashboard/device-health",
            }),

            getDashboardAlertSummary: builder.query<any, void>({
                query: () => "/dashboard/alert-summary",
            }),

            getDashboardLatestTelemetry: builder.query<any, void>({
                query: () => "/dashboard/latest-telemetry",
            }),

            getDashboardLocationByIdLatest: builder.query<any, string>({
                query: (id: string) => `/dashboard/location/${id}/latest`
            }),

        }),
})

export const {
    useGetDashboardQuery,
    useGetDashboardLocationHealthQuery,
    useGetDashboardDeviceHealthQuery,
    useGetDashboardAlertSummaryQuery,
    useGetDashboardLatestTelemetryQuery,
    useGetDashboardLocationByIdLatestQuery
} = dashboardApi