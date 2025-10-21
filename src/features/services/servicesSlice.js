// src/features/services/servicesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

// ------------------- Async Thunks -------------------

// Fetch all services
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient("/services");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single service by ID
export const fetchServiceById = createAsyncThunk(
  "services/fetchServiceById",
  async (serviceId, { rejectWithValue }) => {
    try {
      return await apiClient(`/services/${serviceId}`); // ✅ just call apiClient
    } catch (err) {
      return rejectWithValue(err.message); // simplify
    }
  }
);



// Add new service (only admin/provider)
export const addService = createAsyncThunk(
  "services/addService",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await apiClient("/services/create", {
        method: "POST",
        body: formData,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// Update service (only admin/provider)
export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ serviceId, formData, role }, { rejectWithValue }) => {
    try {
      // Only allow if role is admin or provider
      if (role !== "admin" && role !== "provider") {
        throw new Error("You do not have permission to update this service");
      }
      return await apiClient(`/services/${serviceId}`, {
        method: "PUT",
        body: formData,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete service (optional)
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async ({ serviceId, role }, { rejectWithValue }) => {
    try {
      if (role !== "admin") {
        throw new Error("Only admin can delete service");
      }
      await apiClient(`/services/${serviceId}`, { method: "DELETE" });
      return serviceId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ------------------- Slice -------------------
const servicesSlice = createSlice({
  name: "services",
  initialState: {
    services: [],
    service: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearServiceState: (state) => {
      state.service = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all services
    builder.addCase(fetchServices.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload;
    });
    builder.addCase(fetchServices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch single service
    builder.addCase(fetchServiceById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchServiceById.fulfilled, (state, action) => {
      state.loading = false;
      state.service = action.payload;
    });
    builder.addCase(fetchServiceById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add service
    builder.addCase(addService.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addService.fulfilled, (state, action) => {
      state.loading = false;
      state.services.push(action.payload);
    });
    builder.addCase(addService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update service
    builder.addCase(updateService.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateService.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.services.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) state.services[index] = action.payload;
      if (state.service?.id === action.payload.id) state.service = action.payload;
    });
    builder.addCase(updateService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete service
    builder.addCase(deleteService.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteService.fulfilled, (state, action) => {
      state.loading = false;
      state.services = state.services.filter((s) => s.id !== action.payload);
    });
    builder.addCase(deleteService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearServiceState } = servicesSlice.actions;
export default servicesSlice.reducer;
