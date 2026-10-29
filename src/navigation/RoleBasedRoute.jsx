import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleBasedRoute({ allowedRoles, children }) {
  // Kunin ang kasalukuyang user mula sa localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Kapag walang naka-log in, ibalik sa Login page
  if (!currentUser || !currentUser.email) {
    return <Navigate to="/" replace />;
  }

  // Tiyakin ang tamang papel (role)
  const userRole = (currentUser.role || 'customer').toLowerCase();

  // Suriin kung ang papel ng user ay kasama sa pinapayagang roles
  const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!isAllowed) {
    // Kapag ang Customer ay nagtangkang pumasok sa Admin Dashboard, idirekta sa Customer Dashboard
    if (userRole === 'customer') {
      return <Navigate to="/customer-dashboard" replace />;
    }
    if (userRole === 'organizer') {
      return <Navigate to="/organizer-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}