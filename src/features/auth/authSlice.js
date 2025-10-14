// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------

// User Registration
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response; // { message: "User registered successfully" }
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

// User Login
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await apiClient("/users/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Save token and role to localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);

      return {
        user: res.user,
        token: res.token,
        role: res.user.role,
      };
    } catch (err) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  return null;
});

// ------------------- Slice -------------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // -------- Register User --------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Login User --------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Logout User --------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
