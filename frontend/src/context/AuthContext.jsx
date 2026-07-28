import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMeApi, getCartApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Helper for showing toast notifications
  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch cart count for badge in Navbar
  const refreshCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await getCartApi();
      if (res.success && res.data && res.data.cart) {
        const items = res.data.cart.items || [];
        const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItemsCount);
      }
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
    }
  }, [token]);

  // Check auth status on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await getMeApi();
          if (response.success && response.data && response.data.user) {
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Refresh cart count whenever token/user updates
  useEffect(() => {
    if (user && token) {
      refreshCartCount();
    }
  }, [user, token, refreshCartCount]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.data) {
        const { accessToken, user: userData } = res.data;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(userData);
        showToast(res.message || 'Login successful!', 'success');
        return res;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Invalid email or password';
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  // Register function
  const register = async (name, email, password, role = 'user') => {
    try {
      const res = await registerUser({ name, email, password, role });
      if (res.success && res.data) {
        const { accessToken, user: userData } = res.data;
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(userData);
        showToast(res.message || 'Registration successful!', 'success');
        return res;
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      showToast(errorMsg, 'error');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setCartCount(0);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        cartCount,
        toast,
        login,
        register,
        logout,
        refreshCartCount,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
