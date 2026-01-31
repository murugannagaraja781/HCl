import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        // --- DUMMY LOGIN FOR DEMO PURPOSES ---
        const dummyUsers = [
            { email: 'admin@gmail.com', password: 'Admin@2026', role: 'SUPER_ADMIN', name: 'Super Admin' },
            { email: 'manager1@gmail.com', password: 'pass1', role: 'MANAGER1', name: 'Manager Level 1' },
            { email: 'manager2@gmail.com', password: 'pass2', role: 'MANAGER2', name: 'Manager Level 2' },
            { email: 'manager@gmail.com', password: 'Manager@2026', role: 'MANAGER', name: 'Generic Manager' },
            { email: 'user@gmail.com', password: 'User@2026', role: 'USER', name: 'Regular User' }
        ];

        const dummyUser = dummyUsers.find(u => u.email === username && u.password === password);
        if (dummyUser) {
            const mockToken = 'dummy-token-' + Math.random().toString(36).substr(2);
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(dummyUser));
            axios.defaults.headers.common['x-auth-token'] = mockToken;
            return dummyUser;
        }
        // ---------------------------------------

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
