import { create } from "zustand";
import { persist } from "zustand/middleware";

import { loginRequest } from "../services/auth.service";
import type {
  AuthUser,
  LoginPayload,
} from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresIn: null,

      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      login: async (payload) => {
        set({ isLoading: true });

        try {
          const response = await loginRequest(payload);

          set({
            user: response.data.user,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresIn: null,
          isAuthenticated: false,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("cimas-auth");
        }
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "cimas-auth",

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);