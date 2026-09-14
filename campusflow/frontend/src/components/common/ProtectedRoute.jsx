import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';

/**
 * Route protection wrapper:
 * 1. Requires valid JWT token in localStorage.
 * 2. Optionally validates role ('STUDENT' or 'ADMIN').
 * 3. Redirects unauthenticated visitors to /login with state.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const location = useLocation();
  const token = api.auth.getToken();
  const user = api.auth.getUser();

  // If no token exists in localStorage, redirect to /login
  if (!token) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Please sign in to access your portal.' 
        }} 
        replace 
      />
    );
  }

  // If role is restricted and user's role does not match
  if (allowedRole && user && user.role !== allowedRole) {
    const fallbackPath = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
