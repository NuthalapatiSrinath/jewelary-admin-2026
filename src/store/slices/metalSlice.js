import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import metalService from "../../api/metalService";
import toast from "react-hot-toast";

// Fetch All Metals
export const fetchMetals = createAsyncThunk(
  "metals/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await metalService.getAllMetals();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch metals"
      );
    }
  }
);

// Create Metal
export const createMetal = createAsyncThunk(
  "metals/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await metalService.createMetal(data);
      toast.success("Metal created successfully");
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create metal");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Update Metal
export const updateMetal = createAsyncThunk(
  "metals/update",
  async ({ metalType, data }, { rejectWithValue }) => {
    try {
      const res = await metalService.updateMetal(metalType, data);
      toast.success("Metal updated successfully");
      // The controller returns { metal, changes, message }
      return res.metal;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update metal");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Delete Metal
export const deleteMetal = createAsyncThunk(
  "metals/delete",
  async (metalType, { rejectWithValue }) => {
    try {
      await metalService.deleteMetal(metalType);
      toast.success("Metal deleted successfully");
      return metalType; // Return the ID (metal_type) to filter it out
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete metal");
      return rejectWithValue(err.message);
    }
  }
);

const metalSlice = createSlice({
  name: "metals",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMetals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMetals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMetals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createMetal.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateMetal.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (m) => m.metal_type === action.payload.metal_type
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMetal.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (m) => m.metal_type !== action.payload
        );
      });
  },
});

export default metalSlice.reducer;
