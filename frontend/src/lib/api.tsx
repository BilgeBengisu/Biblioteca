import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `JWT ${token}`;
  return config;
});

// token refresh on 401 responses
let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  r => r,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config.__isRetry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const { data } = await api.post("/auth/jwt/refresh/", { refresh: refreshToken });
            localStorage.setItem("access_token", data.access);
            queue.forEach(fn => fn());
            queue = [];
          } else {
            throw new Error("No refresh token");
          }
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        } finally {
          isRefreshing = false;
        }
      }
      return new Promise((resolve) => {
        queue.push(async () => {
          config.__isRetry = true;
          config.headers.Authorization = `JWT ${localStorage.getItem("access_token") || ""}`;
          resolve(api(config));
        });
      });
    }
    return Promise.reject(error);
  }
);