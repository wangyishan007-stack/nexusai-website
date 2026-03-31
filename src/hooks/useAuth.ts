import { useState, useCallback } from "react";

const AUTH_KEY = "nexusai-logged-in";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === "true";
    } catch {
      return false;
    }
  });

  const login = useCallback(() => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem(AUTH_KEY, "true");
    } catch {
      // silently fail
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // silently fail
    }
  }, []);

  return { isLoggedIn, login, logout };
}
