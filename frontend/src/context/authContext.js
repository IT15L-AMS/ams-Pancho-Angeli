import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = authAPI.getCurrentUser();
    if (storedUser && authAPI.isAuthenticated()) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const result = await authAPI.login(credentials);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = async (userData) => {
    const result = await authAPI.register(userData);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => {
    return user?.Role?.name === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.Role?.name);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};