import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import variantService from "../../api/variantService";
import toast from "react-hot-toast";

// Fetch variants for a specific product
export const fetchVariantsByProduct = createAsyncThunk(
  "variants/fetchByProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await variantService.getVariantsByProduct(productId);
      return res.variants || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch variants"
      );
    }
  }
);

export const createVariant = createAsyncThunk(
  "variants/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await variantService.createVariant(data);
      toast.success("Variant created");
      return res;
    } catch (err) {
      toast.error("Create failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateVariant = createAsyncThunk(
  "variants/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await variantService.updateVariant(id, data);
      toast.success("Variant updated");
      return res;
    } catch (err) {
      toast.error("Update failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteVariant = createAsyncThunk(
  "variants/delete",
  async (id, { rejectWithValue }) => {
    try {
      await variantService.deleteVariant(id);
      toast.success("Variant deleted");
      return id;
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.message);
    }
  }
);

const variantSlice = createSlice({
  name: "variants",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearVariants: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVariantsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVariantsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVariant.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateVariant.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteVariant.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v._id !== action.payload);
      });
  },
});

export const { clearVariants } = variantSlice.actions;
export default variantSlice.reducer;
