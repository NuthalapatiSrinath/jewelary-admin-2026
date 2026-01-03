import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import diamondService from "../../api/diamondService";
import toast from "react-hot-toast";

// Fetch Actions
export const fetchDiamonds = createAsyncThunk(
  "diamonds/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await diamondService.getAllDiamonds(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchDiamondFilters = createAsyncThunk(
  "diamonds/filters",
  async (_, { rejectWithValue }) => {
    try {
      return await diamondService.getFilters();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CRUD Actions
export const createDiamond = createAsyncThunk(
  "diamonds/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await diamondService.createDiamond(data);
      toast.success("Diamond created successfully");
      return res;
    } catch (err) {
      toast.error("Failed to create diamond");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateDiamond = createAsyncThunk(
  "diamonds/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await diamondService.updateDiamond(id, data);
      toast.success("Diamond updated successfully");
      return res;
    } catch (err) {
      toast.error("Failed to update diamond");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteDiamond = createAsyncThunk(
  "diamonds/delete",
  async (id, { rejectWithValue }) => {
    try {
      await diamondService.deleteDiamond(id);
      toast.success("Diamond deleted");
      return id;
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.message);
    }
  }
);

// --- STATUS TOGGLE (Silent, no global loading) ---
export const toggleDiamondStatus = createAsyncThunk(
  "diamonds/status",
  async ({ id, currentStatus }, { rejectWithValue }) => {
    try {
      const targetStatus = !currentStatus;
      const res = await diamondService.toggleActivation(id, targetStatus);
      toast.success(`Diamond ${targetStatus ? "Activated" : "Deactivated"}`);
      return { id, changes: res.diamond };
    } catch (err) {
      toast.error("Status update failed");
      return rejectWithValue(err.message);
    }
  }
);

export const bulkUploadDiamonds = createAsyncThunk(
  "diamonds/bulk",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const res = await diamondService.bulkUpload(file);
      toast.success(res.message);
      dispatch(fetchDiamonds({ page: 1, limit: 10 }));
      return res;
    } catch (err) {
      toast.error("Bulk upload failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const diamondSlice = createSlice({
  name: "diamonds",
  initialState: {
    items: [],
    pagination: {},
    filters: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch - Uses Global Loading
      .addCase(fetchDiamonds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDiamonds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.diamonds;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDiamonds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Filters
      .addCase(fetchDiamondFilters.fulfilled, (state, action) => {
        state.filters = action.payload;
      })

      // Create
      .addCase(createDiamond.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiamond.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createDiamond.rejected, (state) => {
        state.loading = false;
      })

      // Update
      .addCase(updateDiamond.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiamond.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateDiamond.rejected, (state) => {
        state.loading = false;
      })

      // Delete
      .addCase(deleteDiamond.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d._id !== action.payload);
      })

      // Toggle Status - NO GLOBAL LOADING (handled locally in component)
      .addCase(toggleDiamondStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d._id === action.payload.id);
        if (index !== -1) {
          // Merge changes specifically
          state.items[index] = {
            ...state.items[index],
            ...action.payload.changes,
          };
        }
      });
  },
});

export default diamondSlice.reducer;
