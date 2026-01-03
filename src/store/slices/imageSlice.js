import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageService from "../../api/imageService";
import toast from "react-hot-toast";

const createMediaThunk = (type, apiMethod) =>
  createAsyncThunk(`images/${type}`, async (arg, { rejectWithValue }) => {
    try {
      return await apiMethod(arg);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Operation failed");
    }
  });

// --- Fetch Actions ---
export const fetchBanners = createMediaThunk(
  "fetchBanners",
  imageService.getBanners
);
export const fetchCollections = createMediaThunk(
  "fetchCollections",
  imageService.getCollections
);
export const fetchFeatured = createMediaThunk(
  "fetchFeatured",
  imageService.getFeatured
);
export const fetchReviews = createMediaThunk(
  "fetchReviews",
  imageService.getReviews
);
export const fetchDiamondTypes = createMediaThunk(
  "fetchDiamondTypes",
  imageService.getDiamondTypes
);
export const fetchEngagementBanner = createMediaThunk(
  "fetchEngagementBanner",
  imageService.getEngagementBanner
);

// --- Create/Upsert Action ---
export const createMedia = createAsyncThunk(
  "images/create",
  async ({ type, data }, { dispatch, rejectWithValue }) => {
    try {
      let res;
      switch (type) {
        case "banner":
          res = await imageService.createBanner(data);
          break;
        case "collection":
          res = await imageService.createCollection(data);
          break;
        case "featured":
          res = await imageService.createFeatured(data);
          break;
        case "review":
          res = await imageService.createReview(data);
          break;
        case "diamondType":
          res = await imageService.createDiamondType(data);
          break;
        case "engagementBanner":
          res = await imageService.createEngagementBanner(data);
          break;
        default:
          throw new Error("Invalid Type");
      }

      toast.success("Saved successfully");
      // Refresh
      if (type === "banner") dispatch(fetchBanners());
      if (type === "collection") dispatch(fetchCollections());
      if (type === "featured") dispatch(fetchFeatured());
      if (type === "review") dispatch(fetchReviews());
      if (type === "diamondType") dispatch(fetchDiamondTypes());
      if (type === "engagementBanner") dispatch(fetchEngagementBanner());

      return { type, data: res };
    } catch (err) {
      toast.error(err.message || "Failed to save");
      return rejectWithValue(err.message);
    }
  }
);

// --- Update Action ---
export const updateMedia = createAsyncThunk(
  "images/update",
  async ({ type, id, data }, { dispatch, rejectWithValue }) => {
    try {
      let res;
      switch (type) {
        case "banner":
          res = await imageService.updateBanner(id, data);
          break;
        case "collection":
          res = await imageService.updateCollection(id, data);
          break;
        case "featured":
          res = await imageService.updateFeatured(id, data);
          break;
        case "review":
          res = await imageService.updateReview(id, data);
          break;
        case "diamondType":
          res = await imageService.updateDiamondType(id, data);
          break;
        case "engagementBanner":
          res = await imageService.updateEngagementBanner(id, data);
          break;
        default:
          throw new Error("Invalid Type");
      }

      toast.success("Updated successfully");

      if (type === "banner") dispatch(fetchBanners());
      if (type === "collection") dispatch(fetchCollections());
      if (type === "featured") dispatch(fetchFeatured());
      if (type === "review") dispatch(fetchReviews());
      if (type === "diamondType") dispatch(fetchDiamondTypes());
      if (type === "engagementBanner") dispatch(fetchEngagementBanner());

      return { type, data: res };
    } catch (err) {
      toast.error(err.message || "Failed to update");
      return rejectWithValue(err.message);
    }
  }
);

// --- Delete Action ---
export const deleteMedia = createAsyncThunk(
  "images/delete",
  async ({ type, id }, { dispatch, rejectWithValue }) => {
    try {
      switch (type) {
        case "banner":
          await imageService.deleteBanner(id);
          break;
        case "collection":
          await imageService.deleteCollection(id);
          break;
        case "featured":
          await imageService.deleteFeatured(id);
          break;
        case "review":
          await imageService.deleteReview(id);
          break;
        case "diamondType":
          await imageService.deleteDiamondType(id);
          break;
        case "engagementBanner":
          await imageService.deleteEngagementBanner();
          break;
        default:
          throw new Error("Invalid Type");
      }

      toast.success("Deleted successfully");

      // We can manually filter state in reducers, OR just re-fetch for simplicity/safety
      if (type === "engagementBanner") dispatch(fetchEngagementBanner()); // Clear it
      return { type, id };
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.message);
    }
  }
);

const imageSlice = createSlice({
  name: "images",
  initialState: {
    banners: [],
    collections: [],
    featured: [],
    reviews: [],
    diamondTypes: [],
    engagementBanner: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 1. Success Cases
    builder.addCase(fetchBanners.fulfilled, (state, action) => {
      state.banners = action.payload.banners || [];
    });
    builder.addCase(fetchCollections.fulfilled, (state, action) => {
      state.collections = action.payload.images || [];
    });
    builder.addCase(fetchFeatured.fulfilled, (state, action) => {
      state.featured = action.payload.images || [];
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.reviews = action.payload.images || [];
    });
    builder.addCase(fetchDiamondTypes.fulfilled, (state, action) => {
      state.diamondTypes = action.payload.images || [];
    });
    builder.addCase(fetchEngagementBanner.fulfilled, (state, action) => {
      state.engagementBanner = action.payload.image || null;
    });

    // 2. Delete Updates (Optimistic)
    builder.addCase(deleteMedia.fulfilled, (state, action) => {
      const { type, id } = action.payload;
      if (type === "banner")
        state.banners = state.banners.filter((i) => i._id !== id);
      if (type === "collection")
        state.collections = state.collections.filter((i) => i._id !== id);
      if (type === "featured")
        state.featured = state.featured.filter((i) => i._id !== id);
      if (type === "review")
        state.reviews = state.reviews.filter((i) => i._id !== id);
      if (type === "diamondType")
        state.diamondTypes = state.diamondTypes.filter((i) => i._id !== id);
      if (type === "engagementBanner") state.engagementBanner = null;
    });

    // 3. Matchers for Loading
    builder.addMatcher(
      (action) =>
        action.type.startsWith("images/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("images/") &&
        (action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected")),
      (state) => {
        state.loading = false;
      }
    );
  },
});

export default imageSlice.reducer;
