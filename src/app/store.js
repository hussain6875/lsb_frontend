// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";

// Import all slices
import authReducer from "../features/auth/authSlice";
import servicesReducer from "../features/services/servicesSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import reviewsReducer from "../features/reviews/reviewsSlice";
import paymentsReducer from "../features/payments/paymentsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    bookings: bookingsReducer,
    reviews: reviewsReducer,
    payments: paymentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // JWT token & API responses handle ചെയ്യാൻ
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
