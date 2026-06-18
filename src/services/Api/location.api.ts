import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../../env"
import baseQueryWithAuth from "../../utils/AuthProtect";


type locations = {
  id: string,
  name: string,
  description: string,
  status: string,
  activeDevices: number,
  icon: string,
  device_count: number,
  inactiveDevices: number,
  temperature: number,
  aqi: number,
  humidity: number
}

type Location = {
  total: number
  page_size: number
  offset: number
  locations: locations[]
}

interface paramsArgs {

  location_id?: number | string;
  offset?: number
  limit?: number
}


export const locationApi = createApi({
  reducerPath: "locationApi",

  baseQuery: baseQueryWithAuth,

  tagTypes: ["Locations", "Devices"],

  endpoints: (builder) => ({

    // GET locations
    getLocations: builder.query<Location, paramsArgs>({
      query: (args = {}) => {
        const params = new URLSearchParams();

        if (args.limit !== null) {
          params.append("limit", args.limit.toString());
        }

        if (args.offset !== null) {
          params.append("offset", args.offset.toString());
        }

        return {
          url: `/locations${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        }
      },

      providesTags: ["Locations"],
    }),

    // GET devices
    // getDevices: builder.query<any, string>({
    //    query: (locationId) => `/devices?locationId=${locationId}`,

    //   providesTags: ["Devices"],
    // }),

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



    // GET single location
    // getLocationById: builder.query<Location, string>({
    //   query: (id) => `/locations/${id}`,
    // }),

    // ADD location

    addLocation: builder.mutation<Location, any>({
      query: (body) => ({
        url: "/locations",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Locations"],
    }),

    // UPDATE location
    updateLocation: builder.mutation<any, any>({
      query: ({ location_id, ...body }) => ({
        url: `/locations/${location_id}`,
        method: "PUT",
        body,
      }),

      invalidatesTags: ["Locations"],
    }),

    // DELETE location
    deleteLocation: builder.mutation<any, any>({
      query: (location_id) => ({
        url: `/locations/${location_id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Locations", "Devices"],
    }),
  }),
});


export const {
  useGetLocationsQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useGetLocationIdDevicesQuery
} = locationApi;