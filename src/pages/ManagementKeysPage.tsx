import { useState, useCallback } from "react";
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


/* SCOPE_OPTIONS reserved for future scope selector UI */

export default function ManagementKeysPage() {
  const [keys, setKeys] = useState(MGMT_KEYS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState("Read Only");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revealedCopied, setRevealedCopied] = useState(false);

  const handleCreate = useCallback(() => {
    const name = newKeyName.trim() || `New Key ${keys.length + 1}`;
    const fullKey = `sk-nxai-v1-${Array.from({ length: 48 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`;
    const masked = `mgmt_${name.toLowerCase().replace(/\s+/g, "_").slice(0, 4)}_****${fullKey.slice(-4)}`;
    setKeys((prev) => [
      {
        name,
        prefix: masked,
        scope: newKeyScope,
        created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        lastUsed: "Never",
        status: "active" as const,
      },
      ...prev,
    ]);
    setRevealedKey(fullKey);
    setRevealedCopied(false);
    setNewKeyName("");
    setNewKeyScope("Read Only");
  }, [newKeyName, newKeyScope, keys.length]);

  const handleCopyRevealed = useCallback(() => {
    if (revealedKey) {
      navigator.clipboard.writeText(revealedKey).catch(() => {});
      setRevealedCopied(true);
      setTimeout(() => setRevealedCopied(false), 1500);
    }
  }, [revealedKey]);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setRevealedKey(null);
    setNewKeyName("");
    setNewKeyScope("Read Only");
  }, []);

  const handleCopy = useCallback((prefix: string) => {
    navigator.clipboard.writeText(prefix).catch(() => {});
    setCopiedKey(prefix);
    setTimeout(() => setCopiedKey(null), 1500);
  }, []);

  const handleRefresh = useCallback((prefix: string) => {
    const id = Math.random().toString(36).slice(2, 6);
    setKeys((prev) =>
      prev.map((k) =>
        k.prefix === prefix ? { ...k, prefix: `${k.prefix.slice(0, k.prefix.lastIndexOf("_") + 1)}****${id}`, lastUsed: "Just now" } : k
      )
    );
  }, []);

  const handleDelete = useCallback((prefix: string) => {
    setKeys((prev) => prev.filter((k) => k.prefix !== prefix));
  }, []);

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
          <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2 w-fit">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
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
          </div>
          <div>
            {keys.map((key) => (
              <div key={key.prefix} className="flex items-center justify-between px-5 py-4 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-container/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${key.status === "active" ? "bg-primary/8 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>
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
                    <button onClick={() => handleCopy(key.prefix)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Copy key">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{copiedKey === key.prefix ? "check" : "content_copy"}</span>
                    </button>
                    <button onClick={() => handleRefresh(key.prefix)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Rotate key">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                    </button>
                    <button onClick={() => handleDelete(key.prefix)} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors" title="Delete key">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
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
          </div>
          <div className="space-y-3">
            {keys.map((key) => (
              <div key={key.prefix} className="bg-surface-container-lowest rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${key.status === "active" ? "bg-primary/8 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>
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
                  <button onClick={() => handleCopy(key.prefix)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{copiedKey === key.prefix ? "check" : "content_copy"}</span>
                  </button>
                  <button onClick={() => handleRefresh(key.prefix)} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                  </button>
                  <button onClick={() => handleDelete(key.prefix)} className="ml-auto p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeCreateModal}>
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">Create a Management Key</h3>
              <button onClick={closeCreateModal} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {/* Step 1: Name input */}
            {!revealedKey && (
              <>
                <div className="px-6 py-5 space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm font-medium text-on-surface">Name</label>
                      <div className="relative group/tip">
                        <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 14 }}>info</span>
                        <div className="absolute left-0 bottom-full mb-2 w-52 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                          A descriptive name to identify this key in your dashboard.
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder='e.g. "Management Key"'
                      className="w-full px-3 py-2.5 bg-surface-container rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-end">
                  <button
                    onClick={handleCreate}
                    className="px-5 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    Create
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Reveal key */}
            {revealedKey && (
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm font-medium text-on-surface text-center">Your new management key:</p>
                <div className="flex items-center gap-2 bg-surface-container rounded-lg px-3 py-2.5">
                  <code className="flex-1 text-sm font-mono text-on-surface truncate">{revealedKey}</code>
                  <button
                    onClick={handleCopyRevealed}
                    className="shrink-0 p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                    title="Copy"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {revealedCopied ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
                <div className="space-y-2 text-sm text-on-surface leading-relaxed">
                  <p>
                    Please copy it now and write it down somewhere safe.{" "}
                    <strong>You will not be able to see it again.</strong>
                  </p>
                  <p className="text-error">
                    This is a management key. It can only be used to manage other API keys and cannot make model requests.
                  </p>
                  <p className="text-on-surface-variant">
                    You can use it with our admin API endpoints to manage API keys programmatically.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
