import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../../env";
import baseQueryWithAuth from "../../utils/AuthProtect";




export const devicesApi = createApi({
    reducerPath: "devicesApi",
    baseQuery: baseQueryWithAuth,
    tagTypes: ["Devices"],
    endpoints: (builder) => ({

        // Get Devices
        getDevices: builder.query<any, void>({
            query: () => `/devices`,
            providesTags: ["Devices"],
        }),

        // Get device based mertics

        getDeviceIdByMetrics: builder.query<any, any>({
            query: (device_id) => `/devices/${device_id}/metrics`,
            providesTags: ["Devices"],
        }),

        //Post Device
        addDevice: builder.mutation<any, any>({
            query: (body) => ({
                url: "/devices",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Devices"],
        }),

        //Update Device
        updateDevice: builder.mutation<any, any>({
            query: ({ device_id, ...body }) => ({
                url: `/devices/${device_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Devices"],
        }),

        //Delete Device
        deleteDevice: builder.mutation<any, string>({
            query: (id) => ({
                url: `/devices/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Devices"],
        }),
    }),
})

export const {
    useGetDevicesQuery,
    useAddDeviceMutation,
    useUpdateDeviceMutation,
    useDeleteDeviceMutation,
    useGetDeviceIdByMetricsQuery
} = devicesApi;