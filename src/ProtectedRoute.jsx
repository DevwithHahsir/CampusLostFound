import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a loader

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isEmailVerified) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, reason: "verify" }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
