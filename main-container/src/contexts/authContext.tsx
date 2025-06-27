import { createContext, useContext } from 'react'


export type authContextType = {
  loading: Boolean;
  isAuthenticated: Boolean;
  user: {
    email: string;
    role: string;
  } | null;
}

export const authContext = createContext<authContextType>({
  loading: true,
  isAuthenticated: false,
  user: null
})

export const useAuthContext = () => {
  return useContext(authContext)
}