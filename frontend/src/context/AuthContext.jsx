    // =============================================
// context/AuthContext.jsx
// Global Authentication State Manager
// =============================================
// This file manages login/logout state
// across the entire app using React Context

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Base URL for our backend API
const API_URL = 'http://localhost:5000/api';

// =============================================
// AuthProvider — Wraps the entire app
// =============================================
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  // Fetch logged in user data from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.user);
    } catch (error) {
      // Token invalid or expired — logout
      logout();
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // REGISTER
  // =============================================
  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    // Save token to localStorage
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  // =============================================
  // LOGIN
  // =============================================
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    // Save token to localStorage
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    return res.data;
  };

  // =============================================
  // LOGOUT
  // =============================================
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);