import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/auth.store";

export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}