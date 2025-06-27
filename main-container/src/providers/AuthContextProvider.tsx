import { useEffect, useState } from "react";
import { authContext, type authContextType, type User } from "../contexts/authContext";
import { useFetch } from "../hooks/useFetch";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { loading, data } = useFetch(`${apiBaseUrl}/api/auth/me`);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (data && data.user) setUser(data.user);
  }, [data]);

  let valueObj: authContextType;
  if (loading) {
    valueObj = {
      loading: true,
      isAuthenticated: false,
      user: null,
      setUser
    }
  } else {
    const isAuthenticated = !!(data && data.user);
    valueObj = {
      loading: false,
      isAuthenticated,
      user: isAuthenticated ? user : null,
      setUser
    }
  }

  return (
    <authContext.Provider value={valueObj}>
      {children}
    </authContext.Provider>
  );
}

export default AuthContextProvider;