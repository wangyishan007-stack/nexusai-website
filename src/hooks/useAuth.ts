import { useState, useCallback, useMemo } from "react";

const AUTH_KEY = "nexusai-logged-in";
const WALLET_KEY = "nexusai-wallet-address";
const METHOD_KEY = "nexusai-login-method";

function readLS(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeLS(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* */ }
}
function removeLS(key: string) {
  try { localStorage.removeItem(key); } catch { /* */ }
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => readLS(AUTH_KEY) === "true");
  const [walletAddress, setWalletAddress] = useState<string | null>(() => readLS(WALLET_KEY));
  const [loginMethod, setLoginMethod] = useState<"email" | "wallet" | null>(
    () => (readLS(METHOD_KEY) as "email" | "wallet" | null)
  );

  const login = useCallback(() => {
    setIsLoggedIn(true);
    setLoginMethod("email");
    writeLS(AUTH_KEY, "true");
    writeLS(METHOD_KEY, "email");
  }, []);

  const loginWithWallet = useCallback((address: string) => {
    setIsLoggedIn(true);
    setWalletAddress(address);
    setLoginMethod("wallet");
    writeLS(AUTH_KEY, "true");
    writeLS(WALLET_KEY, address);
    writeLS(METHOD_KEY, "wallet");
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setWalletAddress(null);
    setLoginMethod(null);
    removeLS(AUTH_KEY);
    removeLS(WALLET_KEY);
    removeLS(METHOD_KEY);
  }, []);

  const displayName = useMemo(() => {
    if (walletAddress) return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    return "WX";
  }, [walletAddress]);

  return { isLoggedIn, walletAddress, loginMethod, login, loginWithWallet, logout, displayName };
}
