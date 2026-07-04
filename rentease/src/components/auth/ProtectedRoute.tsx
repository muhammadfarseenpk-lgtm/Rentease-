import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "@/hooks/useApp";

interface ProtectedRouteProps {
  allowedRoles?: ("user" | "vendor" | "admin")[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useApp();

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
