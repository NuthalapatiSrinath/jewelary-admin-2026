import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import couponService from "../../api/couponService";
import toast from "react-hot-toast";

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await couponService.getAllCoupons(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupons/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await couponService.createCoupon(data);
      toast.success("Coupon created successfully");
      return res.coupon;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await couponService.updateCoupon(id, data);
      toast.success("Coupon updated successfully");
      return res.coupon;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update coupon");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const toggleCouponStatus = createAsyncThunk(
  "coupons/status",
  async ({ id, currentStatus }, { rejectWithValue }) => {
    try {
      const res = await couponService.toggleStatus(id, currentStatus);
      toast.success(
        `Coupon ${res.coupon.status === "active" ? "Activated" : "Deactivated"}`
      );
      return res.coupon;
    } catch (err) {
      toast.error("Status update failed");
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/delete",
  async (id, { rejectWithValue }) => {
    try {
      await couponService.deleteCoupon(id);
      toast.success("Coupon deleted");
      return id;
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.message);
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: { items: [], pagination: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.coupons || [];
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      });
  },
});

export default couponSlice.reducer;
