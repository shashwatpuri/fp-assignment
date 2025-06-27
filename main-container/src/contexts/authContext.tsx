import { createContext, useContext } from 'react'

export type User = {
  email: string;
  name: string;
  role: string;
}

export type authContextType = {
  loading: Boolean;
  isAuthenticated: Boolean;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const authContext = createContext<authContextType>({
  loading: true,
  isAuthenticated: false,
  user: null,
  setUser: () => { }
})

export const useAuthContext = () => {
  return useContext(authContext)
}