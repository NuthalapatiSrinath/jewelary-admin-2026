import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../api/productService";
import toast from "react-hot-toast";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await productService.getAllProducts(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await productService.createProduct(data);
      toast.success("Product created");
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await productService.updateProduct(id, data);
      toast.success("Product updated");
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "products/status",
  async ({ id, currentStatus }, { rejectWithValue }) => {
    try {
      const res = await productService.toggleStatus(id, currentStatus);
      const newStatus = !currentStatus;
      toast.success(`Product ${newStatus ? "Activated" : "Deactivated"}`);
      return { id, changes: { active: newStatus } };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const bulkUploadProducts = createAsyncThunk(
  "products/bulk",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const res = await productService.bulkUpload(file);
      toast.success("Bulk upload processed");
      dispatch(fetchProducts({ page: 1, limit: 50 }));
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], pagination: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p._id === action.payload.id);
        if (index !== -1)
          state.items[index].active = action.payload.changes.active;
      });
  },
});

export default productSlice.reducer;
