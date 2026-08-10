import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";

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
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <div className="p-8 text-white">Admin Portal Dashboard Placeholder</div>,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["teacher"]} />,
    children: [
      {
        path: "/teacher",
        element: <div className="p-8 text-white">Teacher Portal Dashboard Placeholder</div>,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["student"]} />,
    children: [
      {
        path: "/student",
        element: <div className="p-8 text-white">Student Portal Dashboard Placeholder</div>,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["advisor"]} />,
    children: [
      {
        path: "/advisor",
        element: <div className="p-8 text-white">Advisor Portal Dashboard Placeholder</div>,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["parent"]} />,
    children: [
      {
        path: "/parent",
        element: <div className="p-8 text-white">Parent Portal Dashboard Placeholder</div>,
      },
    ],
  },
  {
    path: "*",
    element: <div className="p-8 text-white">404 - Page Not Found</div>,
  }
]);
