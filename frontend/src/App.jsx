import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './ProtectedRoute';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'));
const Manager1Dashboard = lazy(() => import('./pages/Manager1Dashboard'));
const Manager2Dashboard = lazy(() => import('./pages/Manager2Dashboard'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<div className="loading-screen">Loading HCL Bank...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <ProtectedRoute>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager1"
              element={
                <ProtectedRoute>
                  <Manager1Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager2"
              element={
                <ProtectedRoute>
                  <Manager2Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;