import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/features/landing/pages/LandingPage";
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
import AdvisorStudentViewPage from "@/features/advisor/pages/AdvisorStudentViewPage";
import StudentDashboardPage from "@/features/student/pages/StudentDashboardPage";
import StudentAlertsPage from "@/features/student/pages/StudentAlertsPage";
import StudentAcademicsPage from "@/features/student/pages/StudentAcademicsPage";
import StudentSettingsPage from "@/features/student/pages/StudentSettingsPage";
import StudentRegistrationPage from "@/features/student/pages/StudentRegistrationPage";
import ParentDashboardPage from "@/features/parent/pages/ParentDashboardPage";
import ParentCommunicationsPage from "@/features/parent/pages/ParentCommunicationsPage";
import ParentSettingsPage from "@/features/parent/pages/ParentSettingsPage";
import AccountSettingsPage from "@/features/profile/pages/AccountSettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/profile",
        element: <AccountSettingsPage />,
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          },
          {
            path: "/admin/profile",
            element: <AccountSettingsPage />,
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
            element: <StudentDashboardPage />,
          },
          {
            path: "/student/alerts",
            element: <StudentAlertsPage />,
          },
          {
            path: "/student/academics",
            element: <StudentAcademicsPage />,
          },
          {
            path: "/student/settings",
            element: <StudentSettingsPage />,
          },
          {
            path: "/student/registration",
            element: <StudentRegistrationPage />,
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
          {
            path: "/advisor/student",
            element: <AdvisorStudentViewPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["parent"]} />,
        children: [
          {
            path: "/parent",
            element: <ParentDashboardPage />,
          },
          {
            path: "/parent/communications",
            element: <ParentCommunicationsPage />,
          },
          {
            path: "/parent/settings",
            element: <ParentSettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div className="p-8 text-foreground text-center">404 - Page Not Found</div>,
  }
]);
