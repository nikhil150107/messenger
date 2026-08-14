import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from '../pages/Signup';
import VerifyOTP from '../pages/VerifyOTP';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
};

export default AppRoutes;
