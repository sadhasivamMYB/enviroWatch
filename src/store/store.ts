import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./index";

const reducers = Object.fromEntries(
  apiSlice.map((api) => [api.reducerPath, api.reducer])
);

export const store = configureStore({
  reducer: reducers as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...apiSlice.map((api) => api.middleware)
    ),
});