import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../api/orderService";
import toast from "react-hot-toast";

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await orderService.getAllOrders(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.getOrderById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await orderService.updateOrderStatus(id, data);
      toast.success("Order status updated");
      return res.order;
    } catch (err) {
      toast.error("Failed to update status");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  "orders/stats",
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getOrderStats();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    selectedOrder: null,
    stats: null,
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders || [];
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.order;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        // Update list item
        const index = state.items.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
        // Update selected detail if open
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
