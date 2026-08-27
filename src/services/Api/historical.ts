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
        getLocationHistory: builder.query({
            query: ({ location_id, from_date, to_date }) => 
                `/history/location/${location_id}?from_date=${from_date}&to_date=${to_date}`
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
    useGetLocationHistoryQuery,
    useGetTelemetryCsvQuery,
    useGetTelemetryExcelQuery,
    useGetLocationSummaryCsvQuery,
    useGetAlertsCsvQuery,
    useGetAggregatesCsvQuery 
} = historicalApi;
