// src/components/UserRoute.jsx
// Giriş etmiş istənilən istifadəçi üçün (müştəri + admin)

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.userSlice);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default UserRoute;
