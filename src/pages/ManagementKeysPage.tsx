import SettingsLayout from "../components/SettingsLayout";

const MGMT_KEYS = [
  {
    name: "Production Admin Key",
    prefix: "mgmt_prod_****xK9f",
    scope: "Full Access",
    created: "Jan 12, 2026",
    lastUsed: "2 hours ago",
    status: "active" as const,
  },
  {
    name: "CI/CD Pipeline",
    prefix: "mgmt_ci_****aB3m",
    scope: "Read + Deploy",
    created: "Feb 08, 2026",
    lastUsed: "18 min ago",
    status: "active" as const,
  },
  {
    name: "Staging Environment",
    prefix: "mgmt_stg_****pL7w",
    scope: "Read Only",
    created: "Mar 01, 2026",
    lastUsed: "3 days ago",
    status: "active" as const,
  },
  {
    name: "Legacy Integration",
    prefix: "mgmt_old_****zQ2n",
    scope: "Full Access",
    created: "Nov 20, 2025",
    lastUsed: "45 days ago",
    status: "expired" as const,
  },
];

const AUDIT_LOG = [
  { time: "2 hours ago", action: "Key rotated", key: "Production Admin Key", ip: "192.168.1.42", user: "wangxing" },
  { time: "18 min ago", action: "Deploy triggered", key: "CI/CD Pipeline", ip: "10.0.0.1", user: "github-actions" },
  { time: "1 day ago", action: "Permissions updated", key: "Staging Environment", ip: "192.168.1.42", user: "wangxing" },
  { time: "3 days ago", action: "Key created", key: "Staging Environment", ip: "192.168.1.42", user: "wangxing" },
  { time: "7 days ago", action: "Key revoked attempt", key: "Legacy Integration", ip: "203.0.113.50", user: "unknown" },
];

const SCOPE_OPTIONS = [
  { label: "Full Access", desc: "Create, read, update, delete all resources", icon: "admin_panel_settings" },
  { label: "Read + Deploy", desc: "Read resources and trigger deployments", icon: "rocket_launch" },
  { label: "Read Only", desc: "View resources without modification rights", icon: "visibility" },
  { label: "Billing Only", desc: "Access billing and usage data only", icon: "payments" },
];

export default function ManagementKeysPage() {
  return (
    <SettingsLayout activeTab="management-keys">
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">Management Keys</h2>
            <p className="text-on-surface-variant text-sm">
              Create and manage organization-level keys for programmatic access to account resources.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Key
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mb-8 bg-amber-50/80 rounded-xl p-4 flex items-start gap-4">
          <span className="material-symbols-outlined text-amber-600 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-900">Management keys have elevated privileges</p>
            <p className="text-xs text-amber-700 mt-1">
              These keys can manage your entire organization. Store them securely, rotate regularly, and never expose in client-side code.
            </p>
          </div>
        </div>

        {/* Keys - Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden mb-8">
          <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/10">
            <h4 className="font-headline font-bold text-lg">Active Keys</h4>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px] opacity-40">info</span>
              {MGMT_KEYS.filter((k) => k.status === "active").length} of 10 keys used
            </div>
          </div>
          <div>
            {MGMT_KEYS.map((key) => (
              <div key={key.prefix} className="flex items-center justify-between px-5 py-4 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-container/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${key.status === "active" ? "bg-primary/8 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[20px]">key</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{key.name}</p>
                      {key.status === "expired" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono mt-0.5">{key.prefix}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-medium">{key.scope}</p>
                    <p className="text-[10px] text-on-surface-variant">Created {key.created}</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-xs text-on-surface-variant">Last used</p>
                    <p className="text-xs font-medium">{key.lastUsed}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                    <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>
                    <button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keys - Mobile */}
        <div className="md:hidden mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-headline font-bold text-lg">Active Keys</h4>
            <span className="text-xs text-on-surface-variant">
              {MGMT_KEYS.filter((k) => k.status === "active").length} of 10 used
            </span>
          </div>
          <div className="space-y-3">
            {MGMT_KEYS.map((key) => (
              <div key={key.prefix} className="bg-surface-container-lowest rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${key.status === "active" ? "bg-primary/8 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{key.name}</p>
                      {key.status === "expired" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 shrink-0">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-mono">{key.prefix}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">{key.scope}</span>
                  <span className="text-on-surface-variant">Last used {key.lastUsed}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-outline-variant/10">
                  <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  </button>
                  <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                  </button>
                  <button className="ml-auto p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Audit Log - Desktop */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden hidden md:block">
            <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/10">
              <h4 className="font-headline font-bold text-lg">Audit Log</h4>
              <button className="text-xs text-primary font-semibold hover:underline">View all</button>
            </div>
            <div>
              {AUDIT_LOG.map((entry, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-container/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${entry.action.includes("revoked") ? "bg-red-400" : "bg-emerald-400"}`} />
                    <div>
                      <p className="text-sm">{entry.action}</p>
                      <p className="text-[10px] text-on-surface-variant">{entry.key}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant">{entry.time}</p>
                    <p className="text-[10px] font-mono text-on-surface-variant">{entry.ip} · {entry.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log - Mobile */}
          <div className="lg:col-span-2 md:hidden">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-headline font-bold text-lg">Audit Log</h4>
              <button className="text-xs text-primary font-semibold hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {AUDIT_LOG.map((entry, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${entry.action.includes("revoked") ? "bg-red-400" : "bg-emerald-400"}`} />
                    <p className="text-sm font-medium">{entry.action}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>{entry.key}</span>
                    <span>{entry.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scope Reference */}
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <h4 className="font-headline font-bold text-lg mb-4">Permission Scopes</h4>
            <div className="space-y-4">
              {SCOPE_OPTIONS.map((scope) => (
                <div key={scope.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container/40 transition-colors">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">{scope.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{scope.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{scope.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
