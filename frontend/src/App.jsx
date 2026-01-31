import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './redux/store';
import theme from './theme';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './ProtectedRoute';
import Layout from './components/Layout';

// Static imports to prevent "Failed to fetch" errors on dynamic chunks during demo
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Manager1Dashboard from './pages/Manager1Dashboard';
import Manager2Dashboard from './pages/Manager2Dashboard';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={<div className="loading-screen">Loading HCL Bank...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                    <Layout>
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ProtectedRoute roles={['MANAGER', 'SUPER_ADMIN']}>
                    <Layout>
                      <ManagerDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager1"
                element={
                  <ProtectedRoute roles={['MANAGER1', 'SUPER_ADMIN']}>
                    <Layout>
                      <Manager1Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager2"
                element={
                  <ProtectedRoute roles={['MANAGER2', 'SUPER_ADMIN']}>
                    <Layout>
                      <Manager2Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;