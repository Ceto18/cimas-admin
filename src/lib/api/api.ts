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
          localStorage.removeItem("cimas-auth");
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      const authStorage = localStorage.getItem("cimas-auth");

      const pathname = window.location.pathname;

      const segments = pathname.split("/").filter(Boolean);

      const supportedLocales = ["es", "en"];

      const locale = supportedLocales.includes(segments[0])
        ? segments[0]
        : "es";

      const loginPath = `/${locale}/login`;

      const isLoginPage =
        pathname === loginPath ||
        pathname === `${loginPath}/`;

      if (authStorage && !isLoginPage) {
        localStorage.removeItem("cimas-auth");

        window.location.replace(
          `${loginPath}?expired=1`
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;