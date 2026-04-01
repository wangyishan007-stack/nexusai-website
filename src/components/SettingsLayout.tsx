import { type ReactNode, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDisconnect } from "wagmi";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

const USER_MENU_ITEMS = [
  { icon: "bar_chart", labelKey: "userMenu.activity", href: "/settings/activity" },
  { icon: "format_list_bulleted", labelKey: "userMenu.logs", href: "/settings/logs" },
  { icon: "credit_card", labelKey: "userMenu.credits", href: "/settings/credits" },
  { icon: "settings", labelKey: "userMenu.settings", href: "/settings/preferences" },
];

interface NavItem {
  readonly icon: string;
  readonly labelKey: string;
  readonly id: string;
  readonly href: string;
}

interface NavGroup {
  readonly titleKey: string;
  readonly items: readonly NavItem[];
}

const NAV_GROUPS: readonly NavGroup[] = [
  {
    titleKey: "settings.main",
    items: [
      { icon: "vpn_key", labelKey: "settings.apiKeys", id: "api-keys", href: "/settings/api-keys" },
      { icon: "shield", labelKey: "settings.guardrails", id: "guardrails", href: "/settings/guardrails" },
      { icon: "key_visualizer", labelKey: "settings.byok", id: "byok", href: "/settings/byok" },
      { icon: "alt_route", labelKey: "settings.routing", id: "routing", href: "/settings/routing" },
      { icon: "tune", labelKey: "settings.presets", id: "presets", href: "/settings/presets" },
      { icon: "extension", labelKey: "settings.plugins", id: "plugins", href: "/settings/plugins" },
    ],
  },
  {
    titleKey: "settings.monitoring",
    items: [
      { icon: "monitoring", labelKey: "settings.observability", id: "observability", href: "/settings/observability" },
      { icon: "notes", labelKey: "settings.logs", id: "logs", href: "/settings/logs" },
    ],
  },
  {
    titleKey: "settings.billing",
    items: [
      { icon: "payments", labelKey: "settings.activity", id: "activity", href: "/settings/activity" },
      { icon: "toll", labelKey: "settings.credits", id: "credits", href: "/settings/credits" },
    ],
  },
  {
    titleKey: "settings.account",
    items: [
      { icon: "admin_panel_settings", labelKey: "settings.managementKeys", id: "management-keys", href: "/settings/management-keys" },
      { icon: "settings", labelKey: "settings.preferences", id: "preferences", href: "/settings/preferences" },
    ],
  },
];

interface SettingsLayoutProps {
  readonly activeTab: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function SettingsLayout({ activeTab, children, className }: SettingsLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, login, logout, walletAddress, loginMethod, displayName } = useAuth();
  const { disconnect } = useDisconnect();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(() => {
    if (loginMethod === "wallet") disconnect();
    logout();
    setShowUserMenu(false);
    navigate("/");
  }, [loginMethod, disconnect, logout, navigate]);

  // Settings pages are always logged-in state
  useEffect(() => {
    if (!isLoggedIn) login();
  }, [isLoggedIn, login]);

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

  const visibleLinks = NAV_LINKS.filter((link) => link.href !== "/pricing");

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return NAV_GROUPS;
    const q = searchQuery.trim().toLowerCase();
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => t(item.labelKey).toLowerCase().includes(q)),
    })).filter((group) => group.items.length > 0);
  }, [searchQuery, t]);

  return (
    <div className={`bg-background text-on-background font-body antialiased ${className ?? ""}`}>
      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Side Navigation Shell */}
      <aside className={`h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/10 bg-surface-container-low flex flex-col py-6 px-4 z-50 transition-transform duration-200 ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <span
            className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors"
            onClick={() => { navigate("/"); setShowMobileSidebar(false); }}
          >
            arrow_back
          </span>
          <Link to="/" className="font-headline font-bold text-lg text-on-surface tracking-tight">
            NexusAI
          </Link>
          <button
            className="ml-auto md:hidden text-on-surface-variant hover:text-on-surface"
            onClick={() => setShowMobileSidebar(false)}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Main Items Cluster */}
        <nav className="flex-1 space-y-6 overflow-y-auto">
          {filteredGroups.map((group) => (
            <div key={group.titleKey} className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-bold px-3 mb-2">
                {t(group.titleKey)}
              </p>
              {group.items.map((item) => {
                const isActive = item.id === activeTab;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setShowMobileSidebar(false)}
                    className={
                      isActive
                        ? "flex items-center gap-3 px-3 py-2 bg-surface-container-lowest text-primary shadow-sm rounded-lg font-semibold transition-all duration-200"
                        : "flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg transition-all duration-200"
                    }
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                    <span className="text-sm">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

      </aside>

      {/* Main Wrapper */}
      <div className="pl-0 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="w-full sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10">
          <div className="flex justify-between items-center h-16 px-4 w-full">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-on-surface-variant hover:text-on-surface"
                onClick={() => setShowMobileSidebar(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
              </button>
              <div className="relative w-48 sm:w-72">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>
                search
              </span>
              <input
                className="w-full h-8 pl-9 pr-12 bg-surface-container border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant outline-none"
                placeholder={t("settings.search")}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 pointer-events-none">
                <span className="px-1 py-0.5 border border-outline-variant/30 rounded text-[9px] text-on-surface-variant bg-surface-container-lowest font-medium">⌘</span>
                <span className="px-1 py-0.5 border border-outline-variant/30 rounded text-[9px] text-on-surface-variant bg-surface-container-lowest font-medium">K</span>
              </div>
            </div>
            </div>
            <nav className="hidden lg:flex items-center gap-6 font-body text-sm font-medium">
              {visibleLinks.map((link) => (
                <Link
                  key={link.labelKey}
                  className="text-on-surface-variant hover:text-on-surface px-2 py-1 rounded-lg transition-all"
                  to={link.href}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-sm cursor-pointer hover:opacity-90 transition-all"
                >
                  {walletAddress ? (
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
                  ) : "WX"}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04),0px_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50">
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
                    {/* Theme switcher */}
                    <div className="bg-surface-container-low p-3">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
