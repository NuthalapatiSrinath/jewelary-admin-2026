import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contactService from "../../api/contactService";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await contactService.getAllContacts(params);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    items: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.contacts || [];
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
