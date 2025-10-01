// talking to the backend

import api from "../lib/api.tsx";

type JwtResponse = { access: string; refresh: string };

export async function login(email: string, password: string) {
  const { data } = await api.post<JwtResponse>("/auth/jwt/create/", { email, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function refresh() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refresh token");
  const { data } = await api.post<JwtResponse>("/auth/jwt/refresh/", { refresh: refreshToken });
  localStorage.setItem("access_token", data.access);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/users/me/");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}