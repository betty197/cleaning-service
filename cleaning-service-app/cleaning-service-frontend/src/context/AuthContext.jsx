import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      // These functions are placeholders until the backend exposes real authentication.
      login: async () => {
        throw new Error("Authentication is not available because the backend has no login endpoint.");
      },
      logout: () => {
        setUser(null);
        setToken(null);
      },
      setAuthenticatedSession: (nextUser, nextToken) => {
        setUser(nextUser);
        setToken(nextToken);
      }
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}