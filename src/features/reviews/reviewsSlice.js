// src/features/reviews/reviewsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------

// Fetch reviews for a service
export const fetchReviews = createAsyncThunk("reviews/fetchReviews", async (serviceId, { rejectWithValue }) => {
    try {
        return await apiClient(`/reviews/${serviceId}`);
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// Add review with booking check
export const addReview = createAsyncThunk(
    "reviews/addReview",
    async ({ serviceId, bookingId, rating, comment }, { rejectWithValue }) => {
        try {
            const res = await apiClient("/reviews", {
                method: "POST",
                body: JSON.stringify({ serviceId, bookingId, rating, comment }),
                headers: { "Content-Type": "application/json" },
            });
            return res;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateReview = createAsyncThunk(
    "reviews/updateReview",
    async ({ id, rating, comment }, { rejectWithValue }) => {
        try {
            const body = JSON.stringify({ rating, comment });
            return await apiClient(`/reviews/${id}`, { method: "PUT", body });
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// 🗑️ Delete review
export const deleteReview = createAsyncThunk(
    "reviews/deleteReview",
     async ({ id }, { rejectWithValue }) => {
    try {
        await apiClient(`/reviews/${id}`, { method: "DELETE" });
        return id; // return the deleted ID
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

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
            // fetch reviews
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // add review
            .addCase(addReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews.push(action.payload);
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // in extraReducers add cases:
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.reviews = state.reviews.map((r) => (r.id === updated.id ? updated : r));
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // delete review
            .addCase(deleteReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((r) => r.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default reviewsSlice.reducer;
