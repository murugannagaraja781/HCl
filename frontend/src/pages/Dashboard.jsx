import React from 'react';
import { useAuth } from '../hooks/useAuth';

import CardList from '../components/CardList';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1rem 2rem', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div>
           <h1 style={{ margin: 0, fontSize: '1.5rem' }}>HCL Credit Card Portal</h1>
           <p style={{ margin: 0, color: '#666' }}>Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={logout}
          style={{ padding: '0.6rem 1.2rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Logout
        </button>
      </header>

      <section>
        <h2 style={{ paddingLeft: '2rem' }}>Exclusive Offers for You</h2>
        <CardList />
      </section>

      {user?.role === 'SUPER_ADMIN' && (
        <div style={{ marginTop: '2rem', background: '#e3f2fd', padding: '1.5rem', borderRadius: '15px', textAlign: 'center' }}>
          <h3>Super Admin Controls</h3>
          <p>As a Super Admin, you can manage credit card offerings and user roles.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
