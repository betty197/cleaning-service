import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cleanpro_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/login")) {
      // Clear token if expired or invalid
      localStorage.removeItem("cleanpro_token");
      localStorage.removeItem("cleanpro_user");
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("cleanpro_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("cleanpro_token");
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;