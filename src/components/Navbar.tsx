import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDisconnect } from "wagmi";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import { LoginModal } from "./LoginModal";

const USER_MENU_ITEMS = [
  { icon: "bar_chart", labelKey: "userMenu.activity", href: "/settings/activity" },
  { icon: "format_list_bulleted", labelKey: "userMenu.logs", href: "/settings/logs" },
  { icon: "credit_card", labelKey: "userMenu.credits", href: "/settings/credits" },
  { icon: "settings", labelKey: "userMenu.settings", href: "/settings/preferences" },
];

interface NavbarProps {
  readonly className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { isLoggedIn, login, loginWithWallet, logout, walletAddress, loginMethod, displayName } = useAuth();
  const { disconnect } = useDisconnect();
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogin = useCallback(() => {
    login();
    setShowLogin(false);
  }, [login]);

  const handleWalletLogin = useCallback((address: string) => {
    loginWithWallet(address);
    setShowLogin(false);
  }, [loginWithWallet]);

  const handleLogout = useCallback(() => {
    if (loginMethod === "wallet") disconnect();
    logout();
    setShowUserMenu(false);
  }, [loginMethod, disconnect, logout]);

  // Close menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const visibleLinks = isLoggedIn
    ? NAV_LINKS.filter((link) => link.href !== "/pricing")
    : NAV_LINKS;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 ${className}`}>
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobileNav((prev) => !prev)}
              className="md:hidden p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {showMobileNav ? "close" : "menu"}
              </span>
            </button>
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">
              NexusAI
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.labelKey}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-sm hover:opacity-90 transition-all"
              >
                {walletAddress ? (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
                ) : "WX"}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04),0px_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-[100]">
                  {/* Header */}
                  <div className="p-3 bg-surface-container-low flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                      {walletAddress ? (
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>account_balance_wallet</span>
                      ) : "WX"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface leading-tight">
                        {walletAddress ? displayName : t("userMenu.personal")}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        {loginMethod === "wallet" ? t("userMenu.walletConnected") : t("userMenu.freePlan")}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5 space-y-0.5">
                    {USER_MENU_ITEMS.map((item) => (
                      <Link
                        key={item.labelKey}
                        to={item.href}
                        onClick={() => setShowUserMenu(false)}
                        className="group flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" style={{ fontSize: 20 }}>{item.icon}</span>
                        {t(item.labelKey)}
                      </Link>
                    ))}
                  </div>

                  {/* Sign out */}
                  <div className="h-[1px] bg-surface-container-high mx-3" />
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="group flex items-center gap-3 px-3 py-2 text-sm text-error/70 hover:text-error hover:bg-error/5 rounded-lg transition-colors w-full"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                      <span className="font-medium">{t("common.sign_out")}</span>
                    </button>
                  </div>

                  {/* Theme & Language switcher */}
                  <div className="bg-surface-container-low p-3 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant tracking-wider mb-2.5">{t("userMenu.systemAppearance")}</p>
                      <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-xl">
                        {([["light", "light_mode"], ["dark", "dark_mode"], ["system", "desktop_windows"]] as const).map(([mode, icon]) => (
                          <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                              theme === mode
                                ? "bg-surface-container-lowest shadow-sm text-primary"
                                : "text-on-surface-variant hover:bg-surface-container-low"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 18, ...(theme === mode ? { fontVariationSettings: "'FILL' 1" } : {}) }}
                            >{icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant tracking-wider mb-2.5">{t("userMenu.language")}</p>
                      <div className="grid grid-cols-2 gap-1 bg-surface-container p-1 rounded-xl">
                        {([["en", "English"], ["zh", "中文"]] as const).map(([lng, label]) => (
                          <button
                            key={lng}
                            onClick={() => i18n.changeLanguage(lng)}
                            className={`flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                              i18n.language.startsWith(lng)
                                ? "bg-surface-container-lowest shadow-sm text-primary"
                                : "text-on-surface-variant hover:bg-surface-container-low"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
              >
                {t("common.sign_in")}
              </button>
              <Link
                to="/settings/api-keys"
                className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all"
              >
                {t("common.get_api_key")}
              </Link>
            </div>
          )}
        </div>
        {/* Mobile nav dropdown */}
        {showMobileNav && (
          <div className="md:hidden border-t border-outline-variant/10 px-4 py-3 flex flex-col gap-1 bg-surface-container-lowest/95 backdrop-blur-md">
            {visibleLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.labelKey}
                  to={link.href}
                  onClick={() => setShowMobileNav(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
        onLoginWithWallet={handleWalletLogin}
      />
    </>
  );
};
