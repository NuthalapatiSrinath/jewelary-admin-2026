import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice"; // <--- Import this
import diamondReducer from "./slices/diamondSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    diamonds: diamondReducer,
    theme: themeReducer, // <--- Add this line to enable the theme logic
  },
});

export default store;
