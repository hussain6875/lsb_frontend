import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------

// 📥 Fetch Bookings (role-based)
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

// 🆕 Create Booking
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      return await apiClient("/bookings", {
        method: "POST",
        body: JSON.stringify(bookingData),
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✍️ Update Booking Status (admin/provider only)
export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ id, status, message }, { rejectWithValue }) => {
    try {
      const res = await apiClient(`/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, message }),
      });
      return res; // 🔥 important: must return updated booking object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// src/features/bookings/bookingsSlice.js
export const selectTopProviders = (state) => {
  const map = {};
  state.bookings.bookings.forEach((b) => {
    const name = b.provider?.name || "Unknown";
    map[name] = map[name] || {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      serviceCount: {},
    };

    map[name].total += 1;
    map[name][b.status] += 1;

    if (b.service?.name) {
      map[name].serviceCount[b.service.name] =
        (map[name].serviceCount[b.service.name] || 0) + 1;
    }
  });

  return Object.entries(map)
    .map(([provider, data]) => ({
      provider,
      total: data.total,
      pending: data.pending,
      confirmed: data.confirmed,
      completed: data.completed,
      cancelled: data.cancelled,
      topService:
        Object.entries(data.serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        null,
    }))
    .sort((a, b) => b.completed - a.completed) // Most completed first
    .slice(0, 10);
};


// ------------------- Slice -------------------
const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    recentlyUpdatedId: null, // 🔹 for flash highlight
  },
  reducers: {
    optimisticStatusUpdate: (state, action) => {
      const { id, status } = action.payload;
      const index = state.bookings.findIndex((b) => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
        state.recentlyUpdatedId = id; // 🔹 trigger highlight
      }
    },
    clearRecentlyUpdatedId: (state) => {
      state.recentlyUpdatedId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = [...state.bookings, action.payload]; // ✅ better than push
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // Update booking status — 
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.bookings.findIndex((b) => b.id === updated.id);
        if (index !== -1) state.bookings[index] = { ...state.bookings[index], ...updated };
        state.recentlyUpdatedId = updated.id; // 🔹 highlight updated booking
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { optimisticStatusUpdate, clearRecentlyUpdatedId } = bookingsSlice.actions;

export default bookingsSlice.reducer;
