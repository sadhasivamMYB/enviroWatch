import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../../env";
import baseQueryWithAuth from "../../utils/AuthProtect";


export const sensorsApi = createApi({

    reducerPath: "sensorsApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getSensors: builder.query<any, void>({
            query: () => "/sensorType",
        }),
        createSensor: builder.mutation({
            query: (data: any) => ({
                url: "/sensorType",
                method: "POST",
                body: data,
            }),
        }),
        updateSensor: builder.mutation({
            query: ({ id, data }: { id: string, data: any }) => ({
                url: `/sensorType/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteSensor: builder.mutation({
            query: (id: string) => ({
                url: `/sensorType/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useGetSensorsQuery,
    useCreateSensorMutation,
    useUpdateSensorMutation,
    useDeleteSensorMutation } = sensorsApi;