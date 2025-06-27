import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) return <>Please Wait...</>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />

}