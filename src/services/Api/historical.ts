import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BaseURL } from "../../env"


export const historicalApi = createApi({
    reducerPath: "historicalApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BaseURL + "/api/v1",
            prepareHeaders: (headers) => {
              const token = localStorage.getItem('token');
        
              if (token) {
                headers.set('Authorization', `Bearer ${token}`);
              }
        
              return headers;
            },
    }),
        
    endpoints: (builder) => ({
        getHistoricalHistory: builder.query({
            query: () => "/history"
        }),
        getTelemetryCsv: builder.query({
            query: () => "/telemetry/csv"
        }),
        getTelemetryExcel: builder.query({
            query: () => "/telemetry/excel"
        }),

        getLocationSummaryCsv: builder.query({
            query: () => "/location-summary/csv"
        }),

        getAlertsCsv: builder.query({
            query: () => "/alerts/csv"
        }),
        getAggregatesCsv: builder.query({
            query: () => "/aggregates/csv"
        }),

    })
})

export const { useGetHistoricalHistoryQuery,
    useGetTelemetryCsvQuery,
    useGetTelemetryExcelQuery,
    useGetLocationSummaryCsvQuery,
    useGetAlertsCsvQuery,
    useGetAggregatesCsvQuery 
} = historicalApi;
