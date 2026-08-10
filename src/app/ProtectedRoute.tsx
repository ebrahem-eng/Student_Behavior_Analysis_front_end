import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "@/lib/store";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const userRole = useAppStore((state) => state.userRole);

  // If user is not logged in at all, redirect to login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user does not match, redirect to unauthorized or their own dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={\`/\${userRole}\`} replace />;
  }

  return <Outlet />;
}
