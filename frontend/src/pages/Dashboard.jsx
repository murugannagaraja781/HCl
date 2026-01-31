import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: <strong>{user?.role}</strong></p>
      <div style={{ marginTop: '2rem' }}>
        {user?.role === 'SUPER_ADMIN' && (
          <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
            <h3>Super Admin Panel</h3>
            <p>You have full access to manage the application.</p>
          </div>
        )}
        <button
          onClick={logout}
          style={{ padding: '0.8rem 1.5rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
