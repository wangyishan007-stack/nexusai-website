import { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div className={`bg-background text-on-background font-body antialiased ${className ?? ""}`}>
      {/* Side Navigation Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-slate-200 bg-slate-50 flex flex-col py-6 px-4 z-50">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <span
            className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-slate-900 transition-colors"
            onClick={() => navigate("/")}
          >
            arrow_back
          </span>
          <Link to="/" className="font-headline font-bold text-lg text-slate-900 tracking-tight">
            NexusAI
          </Link>
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
                    className={
                      isActive
                        ? "flex items-center gap-3 px-3 py-2 bg-white text-primary shadow-sm rounded-lg font-semibold transition-all duration-200"
                        : "flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-all duration-200"
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

        {/* Sidebar Footer */}
        <div className="mt-auto px-2">
          <button className="w-full py-2 px-4 border border-primary text-primary text-xs font-bold tracking-widest rounded-lg hover:bg-primary/5 transition-colors uppercase">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="flex justify-between items-center h-14 px-4 w-full">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                className="w-full h-8 pl-9 pr-12 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-500"
                placeholder="Search..."
                type="text"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                <span className="px-1 py-0.5 border border-slate-300 rounded text-[9px] text-slate-500 bg-white font-medium">⌘</span>
                <span className="px-1 py-0.5 border border-slate-300 rounded text-[9px] text-slate-500 bg-white font-medium">K</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6 font-body text-sm font-medium">
              <Link className="text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg transition-all" to="/chat">Playground</Link>
              <Link className="text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg transition-all" to="/docs">Docs</Link>
              <a className="text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg transition-all" href="#">Changelog</a>
            </nav>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">help</span>
              </button>
              <div className="ml-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-sm cursor-pointer">
                WX
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
