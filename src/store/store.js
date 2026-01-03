import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice"; // <--- Import this
import diamondReducer from "./slices/diamondSlice";
import metalReducer from "./slices/metalSlice";
import productReducer from "./slices/productSlice";
import variantReducer from "./slices/variantSlice";
import orderReducer from "./slices/orderSlice";
import couponReducer from "./slices/couponSlice";
import imageReducer from "./slices/imageSlice";
import contactReducer from "./slices/contactSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    diamonds: diamondReducer,
    theme: themeReducer, // <--- Add this line to enable the theme logic
    metals: metalReducer,
    products: productReducer,
    variants: variantReducer,
    orders: orderReducer,
    coupons: couponReducer,
    images: imageReducer,
    contacts: contactReducer,
  },
});

export default store;
