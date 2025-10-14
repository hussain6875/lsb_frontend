// src/features/bookings/bookingsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------
export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      let url = "/bookings";
      if (role === "customer") url += `?userId=${userId}`;
      return await apiClient(url);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      return await apiClient("/bookings", { method: "POST", body: JSON.stringify(bookingData) });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ bookingId, status, role }, { rejectWithValue }) => {
    try {
      if (role !== "admin" && role !== "technician") {
        throw new Error("You do not have permission to update booking status");
      }
      return await apiClient(`/bookings/${bookingId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------- Slice -------------------
const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload; })
      .addCase(fetchBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => { state.loading = false; state.bookings.push(action.payload); })
      .addCase(createBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateBookingStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) state.bookings[index] = action.payload;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default bookingsSlice.reducer;
