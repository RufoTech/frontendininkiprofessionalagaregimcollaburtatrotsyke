import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import paymentReducer from '../slices/paymentSlice';
import userSlice from "./features/userSlice";
import orderReducer from '../slices/orderSlice';
import commissionReducer from '../slices/commissionSlice';
import languageReducer from '../slices/languageSlice';
<<<<<<< HEAD
import notificationReducer from '../slices/Notificationslice';
=======
import notificationReducer from '../slices/notificationSlice';
>>>>>>> 6be8c6eaa041b725fcf76f0450c01ecfcfddc93e

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    payment: paymentReducer,
    userSlice: userSlice,
    order: orderReducer,
    commission: commissionReducer,
<<<<<<< HEAD
    language: languageReducer,
    notifications: notificationReducer, // ✅ YENİ
=======
    language: languageReducer, // ✅ YENİ
    notifications: notificationReducer,
>>>>>>> 6be8c6eaa041b725fcf76f0450c01ecfcfddc93e
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productApi.middleware, authApi.middleware]),
});