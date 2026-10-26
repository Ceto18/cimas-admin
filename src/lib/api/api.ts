import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("cimas-auth");

      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.accessToken;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // Ignorar storage inválido
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;