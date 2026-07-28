import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;
