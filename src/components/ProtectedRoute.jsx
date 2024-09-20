import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); 
  const token = localStorage.getItem('currentToken');

  const hasAllowedRole = (roles, allowedRoles) => {
    return roles.some(role => allowedRoles.includes(role.name));
  };

  // Cek jika token atau currentUser tidak ada, atau jika pengguna tidak memiliki role yang diizinkan
  if (!token || !currentUser || !hasAllowedRole(currentUser.roles, allowedRoles)) {
    console.log("User role not allowed or user not authenticated");
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default RoleProtectedRoute;
