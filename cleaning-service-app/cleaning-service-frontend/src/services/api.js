import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

// Authentication is intentionally not fabricated.
// When the backend supplies JWT authentication, add the real token here.
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;