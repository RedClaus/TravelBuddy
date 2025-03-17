import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/users/me');
        setUser(res.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError('Authentication failed. Please log in again.');
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/users/register', formData);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      setLoading(false);
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      setLoading(false);
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put('/api/users/profile', formData);
      
      setUser(res.data);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      setLoading(false);
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Reset password request
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/users/reset-password', { email });
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to request password reset. Please try again.'
      );
      setLoading(false);
      return { success: false, error: err.response?.data?.message };
    }
  };

  // Reset password with token
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post(`/api/users/reset-password/${token}`, { password });
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
      setLoading(false);
      return { success: false, error: err.response?.data?.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        requestPasswordReset,
        resetPassword,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
