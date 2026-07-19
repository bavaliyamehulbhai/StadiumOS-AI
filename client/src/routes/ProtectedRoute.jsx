import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role isn't authorized, redirect them to their specific dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'Admin': return <Navigate to="/admin" replace />;
      case 'Organizer': return <Navigate to="/organizer" replace />;
      case 'Volunteer': return <Navigate to="/volunteer" replace />;
      default: return <Navigate to="/fan" replace />;
    }
  }

  // If authenticated and authorized, render children or Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
