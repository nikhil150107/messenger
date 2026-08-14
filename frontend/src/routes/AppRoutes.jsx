import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from '../pages/Signup';
import VerifyOTP from '../pages/VerifyOTP';
import Login from '../pages/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
};

export default AppRoutes;
