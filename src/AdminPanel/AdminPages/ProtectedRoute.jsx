import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("authUser"));

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role_id)) {

    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized → render children (Layout + Outlet)
  return <Outlet />;
}
