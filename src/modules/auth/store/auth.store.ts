import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types/auth.types";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setSession: (user, token) =>
        set({
          user,
          accessToken: token,
        }),

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);