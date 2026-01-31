import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['x-auth-token'] = token;

            return user;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-auth-token'];
    return null;
});

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        initializeAuth: (state) => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                state.user = JSON.parse(user);
                state.isAuthenticated = true;
                axios.defaults.headers.common['x-auth-token'] = token;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
