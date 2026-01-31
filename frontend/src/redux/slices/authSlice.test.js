import { describe, it, expect } from 'vitest';
import authReducer, { clearError, initializeAuth } from './authSlice';

describe('authSlice reducer', () => {
    const initialState = {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    };

    it('should handle initial state', () => {
        expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle clearError', () => {
        const stateWithError = { ...initialState, error: 'Some error' };
        const actual = authReducer(stateWithError, clearError());
        expect(actual.error).toBeNull();
    });

    it('should handle login.pending', () => {
        const actual = authReducer(initialState, { type: 'auth/login/pending' });
        expect(actual.loading).toBe(true);
        expect(actual.error).toBeNull();
    });

    it('should handle login.fulfilled', () => {
        const user = { username: 'test@gmail.com', role: 'USER' };
        const actual = authReducer(initialState, { type: 'auth/login/fulfilled', payload: user });
        expect(actual.loading).toBe(false);
        expect(actual.user).toEqual(user);
        expect(actual.isAuthenticated).toBe(true);
    });

    it('should handle login.rejected', () => {
        const error = 'Invalid credentials';
        const actual = authReducer(initialState, { type: 'auth/login/rejected', payload: error });
        expect(actual.loading).toBe(false);
        expect(actual.error).toBe(error);
        expect(actual.isAuthenticated).toBe(false);
    });

    it('should handle logout.fulfilled', () => {
        const loggedInState = {
            user: { username: 'test@gmail.com' },
            isAuthenticated: true,
            loading: false,
            error: null
        };
        const actual = authReducer(loggedInState, { type: 'auth/logout/fulfilled' });
        expect(actual.user).toBeNull();
        expect(actual.isAuthenticated).toBe(false);
    });
});
