import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { fetchWithAuth } from "../lib/fetchWithAuth";
import { ErrorBoundary } from "./ErrorBoundary";
import TopBar from "./TopBar";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function PrivateRoute() {
  const { isAuthenticated, loading, user, setUser } = useAuthContext()

  if (loading) return <>Please Wait...</>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  async function onSignOut() {
    const response = await fetchWithAuth(`${apiBaseUrl}/api/auth/signout`, {
      method: "POST",
    })
    if (response.ok) {
      setUser(null);
      window.location.href = '/signin';
    }
  }

  return (
    <ErrorBoundary>
      {user && <TopBar user={user} onSignOut={onSignOut} />}
      <Outlet />
    </ErrorBoundary>
  )

}
