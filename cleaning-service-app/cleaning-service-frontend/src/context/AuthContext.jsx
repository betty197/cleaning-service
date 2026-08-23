import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cleanpro_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("cleanpro_token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync token with axios on startup
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post("/users/login", { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    setUser(receivedUser);
    setToken(receivedToken);

    localStorage.setItem("cleanpro_user", JSON.stringify(receivedUser));
    setAuthToken(receivedToken);

    return receivedUser;
  };

  const register = async (userData) => {
    const response = await api.post("/users", userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    if (receivedToken && receivedUser) {
      setUser(receivedUser);
      setToken(receivedToken);
      localStorage.setItem("cleanpro_user", JSON.stringify(receivedUser));
      setAuthToken(receivedToken);
    }

    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cleanpro_user");
    setAuthToken(null);
  };

  const updateUserProfile = (updatedUser) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedUser };
      localStorage.setItem("cleanpro_user", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      updateUserProfile,
      setAuthenticatedSession: (nextUser, nextToken) => {
        setUser(nextUser);
        setToken(nextToken);
        if (nextUser && nextToken) {
          localStorage.setItem("cleanpro_user", JSON.stringify(nextUser));
          setAuthToken(nextToken);
        } else {
          localStorage.removeItem("cleanpro_user");
          setAuthToken(null);
        }
      }
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}