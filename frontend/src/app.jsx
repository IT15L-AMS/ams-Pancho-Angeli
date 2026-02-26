import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './utils/privateRoute';

// Layout Components
import Navbar from './components/Layout/Navbar';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Protected Components
import Dashboard from './components/Protected/Dashboard';
import Profile from './components/Protected/Profile';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? 'py-6' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* Role-specific routes */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['Admin']}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                  <p>Admin controls and settings will appear here.</p>
                </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/registrar" element={
            <PrivateRoute allowedRoles={['Registrar']}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Registrar Panel</h1>
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                  <p>Enrollment management tools will appear here.</p>
                </div>
              </div>
            </PrivateRoute>
          } />

          <Route path="/instructor" element={
            <PrivateRoute allowedRoles={['Instructor']}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Instructor Panel</h1>
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                  <p>Course and grade management tools will appear here.</p>
                </div>
              </div>
            </PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;