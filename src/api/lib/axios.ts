import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const schemeId = localStorage.getItem("scheme_id");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (schemeId) {
    config.headers["scheme-id"] = schemeId;
  }

  return config;
});
