import { useSelector, useDispatch } from 'react-redux';
import { login as loginThunk, logout as logoutThunk, clearError } from '../redux/slices/authSlice';
import { useCallback, useMemo } from 'react';

/**
 * Bridge hook for Redux Authentication state
 */
export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const login = useCallback(async (username, password) => {
        const resultAction = await dispatch(loginThunk({ username, password }));
        if (loginThunk.fulfilled.match(resultAction)) {
            return { success: true };
        } else {
            return { success: false, message: resultAction.payload };
        }
    }, [dispatch]);

    const logout = useCallback(() => {
        dispatch(logoutThunk());
    }, [dispatch]);

    const hasRole = useCallback((roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    }, [user]);

    const authHelpers = useMemo(() => ({
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        hasRole,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        isAdmin: user?.role === 'ADMIN',
        isManager: user?.role === 'MANAGER',
        isManager1: user?.role === 'MANAGER1',
        isManager2: user?.role === 'MANAGER2',
        isUser: user?.role === 'USER'
    }), [user, loading, error, isAuthenticated, login, logout, hasRole]);

    return authHelpers;
};

export default useAuth;
