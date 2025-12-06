import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import profileReducer from "./profileSlice";
import wishlistReducer from "./wishlistSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    profile: profileReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});

export default store;
