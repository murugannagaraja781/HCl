import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Async thunk to fetch all customers/applications
export const fetchCustomers = createAsyncThunk(
    'customers/fetchAll',
    async (params = {}) => {
        const response = await axios.get(`${API_URL}/api/applications`, { params });
        return response.data; // { items, total, pages }
    }
);

// Async thunk to update customer
export const updateCustomerData = createAsyncThunk(
    'customers/update',
    async ({ id, updates, logEntry }) => {
        const response = await axios.patch(`${API_URL}/api/applications/${id}`, { updates, logEntry });
        return response.data;
    }
);

const initialState = {
    items: [], // Start empty, will be populated from API
    total: 0,
    pages: 0,
    loading: false,
    error: null,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        // Option to reset or clear for logout
        resetCustomers: (state) => {
            state.items = [];
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.pages = action.payload.pages;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update
            .addCase(updateCustomerData.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCustomerData.fulfilled, (state, action) => {
                state.loading = false;
                const updatedApp = action.payload;
                const index = state.items.findIndex(c => c._id === updatedApp._id);
                if (index !== -1) {
                    state.items[index] = updatedApp;
                }
            })
            .addCase(updateCustomerData.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Failed to update customer';
            });
    },
});

export const { resetCustomers } = customerSlice.actions;
export default customerSlice.reducer;
