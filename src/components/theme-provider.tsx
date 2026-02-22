"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  const hour = new Date().getHours();
  if (hour >= 18 || hour < 6) return "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

let currentTheme: Theme = "light";
const listeners = new Set<() => void>();

function initTheme() {
  if (typeof window === "undefined") return;
  currentTheme = getInitialTheme();
  applyTheme(currentTheme);
}

function setTheme(theme: Theme) {
  currentTheme = theme;
  applyTheme(theme);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "light";
}

initTheme();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
