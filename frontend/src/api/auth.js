import axios from './axios';
import toast from 'react-hot-toast';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Registration successful!');
        return { success: true, user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful!');
        return { success: true, user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  },

  getProfile: async () => {
    try {
      const response = await axios.get('/auth/profile');
      if (response.data.success) {
        return { success: true, user: response.data.data.user };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } finally {
      localStorage.clear();
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  hasRole: (role) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.Role?.name === role;
  },

  hasAnyRole: (roles) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return roles.includes(user.Role?.name);
  }
};