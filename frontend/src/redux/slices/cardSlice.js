import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Async thunk to fetch all cards
export const fetchCards = createAsyncThunk(
    'cards/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/cards`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch cards');
        }
    }
);

// Async thunk to add a new card
export const addCard = createAsyncThunk(
    'cards/add',
    async (cardData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/cards`, cardData);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add card');
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const cardSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCards.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCard.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default cardSlice.reducer;
