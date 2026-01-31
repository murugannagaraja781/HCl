import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cardReducer from './slices/cardSlice';
import customerReducer from './slices/customerSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cards: cardReducer,
        customers: customerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Useful when working with complex API responses
        }),
});

export default store;
