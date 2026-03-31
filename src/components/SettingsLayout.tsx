import { type ReactNode, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";

const USER_MENU_ITEMS = [
  { icon: "bar_chart", label: "Activity", href: "/settings/activity" },
  { icon: "format_list_bulleted", label: "Logs", href: "/settings/logs" },
  { icon: "credit_card", label: "Credits", href: "/settings/credits" },
  { icon: "settings", label: "Settings", href: "/settings/preferences" },
];

interface NavItem {
  readonly icon: string;
  readonly label: string;
  readonly id: string;
  readonly href: string;
}

interface NavGroup {
  readonly title: string;
  readonly items: readonly NavItem[];
}

const NAV_GROUPS: readonly NavGroup[] = [
  {
    title: "Main",
    items: [
      { icon: "vpn_key", label: "API Keys", id: "api-keys", href: "/settings/api-keys" },
      { icon: "shield", label: "Guardrails", id: "guardrails", href: "/settings/guardrails" },
      { icon: "key_visualizer", label: "BYOK", id: "byok", href: "/settings/byok" },
      { icon: "alt_route", label: "Routing", id: "routing", href: "/settings/routing" },
      { icon: "tune", label: "Presets", id: "presets", href: "/settings/presets" },
      { icon: "extension", label: "Plugins", id: "plugins", href: "/settings/plugins" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { icon: "monitoring", label: "Observability", id: "observability", href: "/settings/observability" },
      { icon: "notes", label: "Logs", id: "logs", href: "/settings/logs" },
    ],
  },
  {
    title: "Billing",
    items: [
      { icon: "payments", label: "Activity", id: "activity", href: "/settings/activity" },
      { icon: "toll", label: "Credits", id: "credits", href: "/settings/credits" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "admin_panel_settings", label: "Management Keys", id: "management-keys", href: "/settings/management-keys" },
      { icon: "settings", label: "Preferences", id: "preferences", href: "/settings/preferences" },
    ],
  },
];

interface SettingsLayoutProps {
  readonly activeTab: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function SettingsLayout({ activeTab, children, className }: SettingsLayoutProps) {
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-bold px-3 mb-2">
                {group.title}
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
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
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
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
              <div className="relative w-48 sm:w-72">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="w-full h-8 pl-9 pr-12 bg-surface-container border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant outline-none"
                placeholder="Search..."
                type="text"
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
                  key={link.label}
                  className="text-on-surface-variant hover:text-on-surface px-2 py-1 rounded-lg transition-all"
                  to={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-surface-container-lowest shadow-sm cursor-pointer hover:opacity-90 transition-all"
                >
                  WX
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden py-1 z-50">
                    {/* User header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10">
                      <div className="w-9 h-9 rounded-full bg-rose-800 text-white flex items-center justify-center text-sm font-bold">
                        x
                      </div>
                      <span className="font-semibold text-on-surface">Personal</span>
                      <Link
                        to="/settings/preferences"
                        onClick={() => setShowUserMenu(false)}
                        className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">settings</span>
                      </Link>
                    </div>
                    {/* Menu items */}
                    <div className="py-1">
                      {USER_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl text-on-surface-variant">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    {/* Sign out */}
                    <div className="border-t border-outline-variant/10 py-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); navigate("/"); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-surface-container/60 transition-colors w-full"
                      >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        Sign Out
                      </button>
                    </div>
                    {/* Theme switcher */}
                    <div className="border-t border-outline-variant/10 px-3 py-2">
                      <div className="flex items-center bg-surface-container rounded-lg p-0.5">
                        <button className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-surface-container-lowest shadow-sm text-on-surface text-xs font-medium transition-all">
                          <span className="material-symbols-outlined text-base mr-1">light_mode</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:text-on-surface transition-all">
                          <span className="material-symbols-outlined text-base mr-1">dark_mode</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:text-on-surface transition-all">
                          <span className="material-symbols-outlined text-base mr-1">desktop_windows</span>
                        </button>
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
