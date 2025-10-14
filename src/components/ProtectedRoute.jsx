import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
