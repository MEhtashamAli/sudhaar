import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Check if user exists in local storage (Mock Authentication)
  const isAuthenticated = localStorage.getItem("sudhaar_user");

  if (!isAuthenticated) {
    // If not logged in, redirect to Login page immediately
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow them to see the route (Outlet)
  return <Outlet />;
}