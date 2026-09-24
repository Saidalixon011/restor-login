import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const userRole = localStorage.getItem('userRole');

  // Agar userRole bo'lmasa, loginga otib yuboradi
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // allowedRole massiv bo'lsa includes bilan, oddiy text bo'lsa tenglik bilan tekshiradi
  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(userRole)
    : allowedRole === userRole;

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;