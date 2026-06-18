import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./index"

const apiReducers = apiSlice.reduce(
  (acc, api) => {
    acc[api.reducerPath] = api.reducer;
    return acc;
  },
  {} as Record<string, (typeof apiSlice)[number]['reducer']>
);


export const store = configureStore({
  reducer: apiReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      [
        ...apiSlice.map(api => api.middleware),
      ]
    ),

});


