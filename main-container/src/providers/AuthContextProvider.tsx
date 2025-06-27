import { authContext, type authContextType } from "../contexts/authContext";
import { useFetch } from "../hooks/useFetch";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { loading, data } = useFetch(`${apiBaseUrl}/api/auth/me`);

  let valueObj: authContextType;
  if (loading) {
    valueObj = {
      loading: true,
      isAuthenticated: false,
      user: null
    }
  } else {
    const isAuthenticated = !!(data && data.user);
    valueObj = {
      loading: false,
      isAuthenticated,
      user: isAuthenticated ? data.user : null
    }
  }

  return (
    <authContext.Provider value={valueObj}>
      {children}
    </authContext.Provider>
  );
}

export default AuthContextProvider;