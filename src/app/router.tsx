import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import AccountsPage from "@/features/admin/pages/AccountsPage";
import InstitutionsPage from "@/features/admin/pages/InstitutionsPage";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import SystemSettingsPage from "@/features/admin/pages/SystemSettingsPage";
import TeacherGradesPage from "@/features/teacher/pages/TeacherGradesPage";
import TeacherAttendancePage from "@/features/teacher/pages/TeacherAttendancePage";
import TeacherDashboardPage from "@/features/teacher/pages/TeacherDashboardPage";
import TeacherIncidentsPage from "@/features/teacher/pages/TeacherIncidentsPage";
import AdvisorDashboardPage from "@/features/advisor/pages/AdvisorDashboardPage";
import AdvisorInboxPage from "@/features/advisor/pages/AdvisorInboxPage";
import AdvisorCommunicationsPage from "@/features/advisor/pages/AdvisorCommunicationsPage";
import AdvisorAnalyticsPage from "@/features/advisor/pages/AdvisorAnalyticsPage";

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
            element: <TeacherDashboardPage />,
          },
          {
            path: "/teacher/grades",
            element: <TeacherGradesPage />,
          },
          {
            path: "/teacher/attendance",
            element: <TeacherAttendancePage />,
          },
          {
            path: "/teacher/incidents",
            element: <TeacherIncidentsPage />,
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
            element: <AdvisorDashboardPage />,
          },
          {
            path: "/advisor/inbox",
            element: <AdvisorInboxPage />,
          },
          {
            path: "/advisor/communications",
            element: <AdvisorCommunicationsPage />,
          },
          {
            path: "/advisor/analytics",
            element: <AdvisorAnalyticsPage />,
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
