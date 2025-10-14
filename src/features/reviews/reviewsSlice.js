// src/features/reviews/reviewsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (serviceId, { rejectWithValue }) => {
    try {
      return await apiClient(`/reviews/${serviceId}`);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      return await apiClient("/reviews", { method: "POST", body: JSON.stringify(reviewData) });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------- Slice -------------------
const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload; })
      .addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addReview.fulfilled, (state, action) => { state.loading = false; state.reviews.push(action.payload); })
      .addCase(addReview.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default reviewsSlice.reducer;
