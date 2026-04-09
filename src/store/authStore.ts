import { create } from "zustand";

export type Locale = "ru" | "kk" | "en";

type User = {
  id: string;
  name: string;
  onboarded: boolean;
  locale: Locale;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User;
  login: () => void;
  logout: () => void;
  setOnboarded: (value: boolean) => void;
  setLocale: (locale: Locale) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: {
    id: "u1",
    name: "Aruzhan",
    onboarded: false,
    locale: "ru"
  },
  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: { id: "u1", name: "Aruzhan", onboarded: false, locale: "ru" }
    }),
  setOnboarded: (value) =>
    set((state) => ({ user: { ...state.user, onboarded: value } })),
  setLocale: (locale) => set((state) => ({ user: { ...state.user, locale } }))
}));
