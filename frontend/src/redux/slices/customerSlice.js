import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const DUMMY_CUSTOMERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', creditScore: 720, limitStatus: 'Pending', approvedLimit: 0, finalStatus: 'Pending', phone: '9876543210' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', creditScore: 650, limitStatus: 'Pending', approvedLimit: 0, finalStatus: 'Pending', phone: '9876543211' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', creditScore: 810, limitStatus: 'Limit Set', approvedLimit: 500000, finalStatus: 'Pending', phone: '9876543212' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', creditScore: 750, limitStatus: 'Approved', approvedLimit: 300000, finalStatus: 'Active', phone: '9876543213' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', creditScore: 690, limitStatus: 'Limit Set', approvedLimit: 150000, finalStatus: 'Pending', phone: '9876543214' },
    { id: 6, name: 'Diana Evans', email: 'diana@example.com', creditScore: 780, limitStatus: 'Pending', approvedLimit: 0, finalStatus: 'Pending', phone: '9876543215' },
    { id: 7, name: 'Ethan Fox', email: 'ethan@example.com', creditScore: 620, limitStatus: 'Rejected', approvedLimit: 0, finalStatus: 'Rejected', phone: '9876543216' },
    { id: 8, name: 'Fiona Gill', email: 'fiona@example.com', creditScore: 740, limitStatus: 'Pending', approvedLimit: 0, finalStatus: 'Pending', phone: '9876543217' },
    { id: 9, name: 'George Harris', email: 'george@example.com', creditScore: 710, limitStatus: 'Limit Set', approvedLimit: 200000, finalStatus: 'Pending', phone: '9876543218' },
    { id: 10, name: 'Hannah Ives', email: 'hannah@example.com', creditScore: 760, limitStatus: 'Pending', approvedLimit: 0, finalStatus: 'Pending', phone: '9876543219' },
];

// Async thunk to update customer (simulating API call)
export const updateCustomerData = createAsyncThunk(
    'customers/update',
    async ({ id, updates }, { dispatch }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id, updates };
    }
);

const initialState = {
    items: DUMMY_CUSTOMERS,
    loading: false,
    error: null,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateCustomerData.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCustomerData.fulfilled, (state, action) => {
                state.loading = false;
                const { id, updates } = action.payload;
                const index = state.items.findIndex(c => c.id === id);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], ...updates };
                }
            })
            .addCase(updateCustomerData.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Failed to update customer';
            });
    },
});

export default customerSlice.reducer;
