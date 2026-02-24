import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/Admin/UserManagement'; // Admin only
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - Any Logged In User */}
          <Route element={<PrivateRoute allowedRoles={['Admin', 'Registrar', 'Instructor', 'Student']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>

          {/* Admin & Registrar Only Routes */}
          <Route element={<PrivateRoute allowedRoles={['Admin', 'Registrar']} />}>
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;