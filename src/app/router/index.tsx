import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../../shared/layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PlaceholderPage from "../../shared/components/common/PlaceholderPage";
import { LoginPage } from "../../modules/auth/pages/LoginPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import MonitoringPage from "../../modules/monitoring/pages/MonitoringPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/monitoring",
            element: <MonitoringPage />,
          },
          {
            path: "/control",
            element: <PlaceholderPage title="Control" />,
          },
          {
            path: "/events",
            element: <PlaceholderPage title="Eventos" />,
          },
          {
            path: "/gis",
            element: <PlaceholderPage title="GIS" />,
          },
          {
            path: "/alerts",
            element: <PlaceholderPage title="Alertas" />,
          },
          {
            path: "/audit",
            element: <PlaceholderPage title="Auditoría" />,
          },
          {
            path: "/devices",
            element: <PlaceholderPage title="Dispositivos" />,
          },
          {
            path: "/smart-locks",
            element: <PlaceholderPage title="Candados inteligentes" />,
          },
          {
            path: "/history",
            element: <PlaceholderPage title="Historial" />,
          },
          {
            path: "/reports",
            element: <PlaceholderPage title="Reportes" />,
          },
          {
            path: "/maintenance",
            element: <PlaceholderPage title="Mantenimiento" />,
          },
          {
            path: "/user-center",
            element: <PlaceholderPage title="Centro de usuarios" />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);