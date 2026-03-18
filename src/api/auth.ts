import { api } from "./lib/axios";

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post("/api/login", credentials);
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get("/api/verify-token");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/api/logout");
  return response.data;
};

