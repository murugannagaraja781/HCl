import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * withRole HOC to protect components based on user roles
 * @param {React.Component} Component - Component to wrap
 * @param {Array|String} allowedRoles - Single role or array of allowed roles
 */
const withRole = (Component, allowedRoles) => {
    return (props) => {
        const { user, loading, hasRole } = useAuth();

        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div className="loader">Loading Dashboard...</div>
                </div>
            );
        }

        if (!user) {
            return <Navigate to="/login" replace />;
        }

        if (!hasRole(allowedRoles)) {
            return <Navigate to="/" replace />;
        }

        return <Component {...props} />;
    };
};

export default withRole;
