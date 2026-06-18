import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseURL } from "../env";

const baseQuery = fetchBaseQuery({
    baseUrl: BaseURL + "/api/v1",
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        alert("Session expired. Please login again.");

        localStorage.clear();

        window.location.href = "/login";
    }

    return result;
};

export default baseQueryWithAuth;