import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../../utils/AuthProtect";

interface paramsArgs {
    location_id?: number | string;
    offset?: number;
    limit?: number;
}

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

        // Location ID based Devices
        getLocationIdDevices: builder.query<any, paramsArgs>({
            query: (args = {}) => {
                const params = new URLSearchParams();

                if (args.limit !== undefined) {
                    params.append("limit", args.limit.toString());
                }

                if (args.offset !== undefined) {
                    params.append("offset", args.offset.toString());
                }

                return {
                    url: `/locations/${args?.location_id}/devices${params.toString() ? `?${params.toString()}` : ""}`,
                    method: "GET",
                }
            },
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
    useGetDeviceIdByMetricsQuery,
    useGetLocationIdDevicesQuery,
} = devicesApi;