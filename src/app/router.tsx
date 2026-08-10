import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";

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
            element: <div className="text-white bg-card p-6 rounded-xl border border-white/10 shadow-lg">Admin Portal Dashboard Placeholder</div>,
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
