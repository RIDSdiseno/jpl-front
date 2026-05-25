import axios from "axios";
import { useAuthStore } from "../../modules/auth/store/auth.store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { clearSession } = useAuthStore.getState();

      clearSession();

      window.alert(
        "Tu sesión ha expirado. Por favor vuelve a iniciar sesión."
      );

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;