import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import type { AuthUser, adminApi } from "@/lib/api";
import { adminApi as api } from "@/lib/api";

type Theme = "light" | "dark";

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  // Auth
  user: AuthUser | null;
  loginUser: (userData: AuthUser) => void;
  logoutUser: () => void;
  // Settings
  settings: any;
  refreshSettings: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("staybnb-theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("staybnb-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  // Restore user session from localStorage on mount
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("staybnb-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [settings, setSettings] = useState<any>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("staybnb-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("staybnb-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const loginUser = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem("staybnb-user", JSON.stringify(userData));
    localStorage.setItem("staybnb-token", userData.token);
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("staybnb-user");
    localStorage.removeItem("staybnb-token");
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      wishlist,
      toggleWishlist: (id) =>
        setWishlist((list) =>
          list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
        ),
      isWished: (id) => wishlist.includes(id),
      user,
      loginUser,
      logoutUser,
      settings,
      refreshSettings: fetchSettings,
    }),
    [theme, wishlist, user, loginUser, logoutUser, settings, fetchSettings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};