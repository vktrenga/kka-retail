import axios, { AxiosInstance } from "axios";

export const createApi = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use((config:any) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        // ✅ safe way
        if (!config.headers) {
          config.headers = {};
        }
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  });

  return api;
};

