// src/features/payments/paymentsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------
export const fetchPaymentsByBooking = createAsyncThunk(
  "payments/fetchPaymentsByBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await apiClient(`/payments/${bookingId}`);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await apiClient("/payments", { method: "POST", body: JSON.stringify(paymentData) });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------- Slice -------------------
const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    payments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentsByBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPaymentsByBooking.fulfilled, (state, action) => { state.loading = false; state.payments = action.payload; })
      .addCase(fetchPaymentsByBooking.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createPayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createPayment.fulfilled, (state, action) => { state.loading = false; state.payments.push(action.payload); })
      .addCase(createPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default paymentsSlice.reducer;
