import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  // Placeholder routes for role portals
  {
    path: "/admin",
    element: <div className="p-8 text-white">Admin Portal Dashboard Placeholder</div>,
  },
  {
    path: "/teacher",
    element: <div className="p-8 text-white">Teacher Portal Dashboard Placeholder</div>,
  },
  {
    path: "/student",
    element: <div className="p-8 text-white">Student Portal Dashboard Placeholder</div>,
  },
  {
    path: "/advisor",
    element: <div className="p-8 text-white">Advisor Portal Dashboard Placeholder</div>,
  },
  {
    path: "/parent",
    element: <div className="p-8 text-white">Parent Portal Dashboard Placeholder</div>,
  },
  {
    path: "*",
    element: <div className="p-8 text-white">404 - Page Not Found</div>,
  }
]);
