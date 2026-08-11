import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import AccountsPage from "@/features/admin/pages/AccountsPage";
import InstitutionsPage from "@/features/admin/pages/InstitutionsPage";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import SystemSettingsPage from "@/features/admin/pages/SystemSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/accounts",
            element: <AccountsPage />,
          },
          {
            path: "/admin/institutions",
            element: <InstitutionsPage />,
          },
          {
            path: "/admin/settings",
            element: <SystemSettingsPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["teacher"]} />,
        children: [
          {
            path: "/teacher",
            element: <div className="text-white bg-card p-6 rounded-xl border border-white/10 shadow-lg">Teacher Portal Dashboard Placeholder</div>,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            path: "/student",
            element: <div className="text-white bg-card p-6 rounded-xl border border-white/10 shadow-lg">Student Portal Dashboard Placeholder</div>,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["advisor"]} />,
        children: [
          {
            path: "/advisor",
            element: <div className="text-white bg-card p-6 rounded-xl border border-white/10 shadow-lg">Advisor Portal Dashboard Placeholder</div>,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["parent"]} />,
        children: [
          {
            path: "/parent",
            element: <div className="text-white bg-card p-6 rounded-xl border border-white/10 shadow-lg">Parent Portal Dashboard Placeholder</div>,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div className="p-8 text-white text-center">404 - Page Not Found</div>,
  }
]);
