import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  resolved: "light",
});

const STORAGE_KEY = "nexusai-theme";

function getSystemPref(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolve(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? getSystemPref() : mode;
}

function apply(resolved: "light" | "dark") {
  if (resolved === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeRaw] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === "light" || stored === "dark" || stored === "system") ? stored : "light";
  });

  const [resolved, setResolved] = useState<"light" | "dark">(() => resolve(theme));

  const setTheme = useCallback((mode: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    setThemeRaw(mode);
  }, []);

  // Apply theme whenever theme mode changes
  useEffect(() => {
    const r = resolve(theme);
    setResolved(r);
    apply(r);
  }, [theme]);

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const r = getSystemPref();
      setResolved(r);
      apply(r);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
