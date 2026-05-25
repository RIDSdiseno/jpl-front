import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/auth.store";

export default function PublicRoute() {
  const token = useAuthStore((state) => state.accessToken);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}