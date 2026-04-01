import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";

interface ApiKeysPageProps {
  readonly className?: string;
}

interface ApiKey {
  name: string;
  key: string;
  fullKey: string;
  created: string;
  lastUsed: string;
}

const INITIAL_KEYS: ApiKey[] = [
  {
    name: "Default Key",
    key: "sk-nx-****...4a8f",
    fullKey: "sk-nx-a1b2c3d4e5f6g7h8i9j0k1l2m3n4a8f",
    created: "Jan 15, 2026",
    lastUsed: "2 hours ago",
  },
  {
    name: "Production App",
    key: "sk-nx-****...7c2d",
    fullKey: "sk-nx-p9q8r7s6t5u4v3w2x1y0z9a8b7c27c2d",
    created: "Feb 3, 2026",
    lastUsed: "5 min ago",
  },
  {
    name: "Testing",
    key: "sk-nx-****...9e1b",
    fullKey: "sk-nx-t1e2s3t4k5e6y7f8o9r0d1e2v3e9e1b",
    created: "Mar 1, 2026",
    lastUsed: "3 days ago",
  },
];

function generateKey(): string {
  const chars = "abcdef0123456789";
  let result = "sk-nx-";
  for (let i = 0; i < 32; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function maskKey(full: string): string {
  return `sk-nx-****...${full.slice(-4)}`;
}

export default function ApiKeysPage({ className }: ApiKeysPageProps) {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyCreditLimit, setNewKeyCreditLimit] = useState("");
  const [newKeyResetLimit, setNewKeyResetLimit] = useState("N/A");
  const [newKeyExpiration, setNewKeyExpiration] = useState("No expiration");
  const [createdFullKey, setCreatedFullKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreate = () => {
    const full = generateKey();
    const newKey: ApiKey = {
      name: newKeyName || "Untitled Key",
      key: maskKey(full),
      fullKey: full,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never",
    };
    setKeys((prev) => [...prev, newKey]);
    setCreatedFullKey(full);
    setNewKeyName("");
    setNewKeyCreditLimit("");
    setNewKeyResetLimit("N/A");
    setNewKeyExpiration("No expiration");
  };

  const handleDelete = (fullKey: string) => {
    setKeys((prev) => prev.filter((k) => k.fullKey !== fullKey));
    setDeleteConfirm(null);
    setMenuOpen(null);
  };

  const handleRename = (fullKey: string) => {
    setKeys((prev) => prev.map((k) => (k.fullKey === fullKey ? { ...k, name: editName } : k)));
    setEditingKey(null);
    setMenuOpen(null);
  };

  return (
    <SettingsLayout activeTab="api-keys" className={className}>
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">{t("apiKeys.title")}</h2>
          <p className="text-on-surface-variant text-sm">
            {t("apiKeys.info_banner")}
          </p>
        </header>

        {/* Info Banner */}
        <div className="bg-primary p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>info</span>
            </div>
            <div>
              <p className="text-white font-semibold text-base sm:text-lg">
                Your default API key has full access to all models.
              </p>
              <p className="text-white/70 text-sm">
                Keep your keys secure and do not share them in public repositories.
              </p>
            </div>
          </div>
          <button
            className="bg-white text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2 w-fit"
            onClick={() => { setShowCreate(true); setCreatedFullKey(null); }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
            {t("apiKeys.create_key")}
          </button>
        </div>

        {/* Create Key Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => { setShowCreate(false); setCreatedFullKey(null); }}>
            <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
              {createdFullKey ? (
                /* Key Created State */
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold font-headline">{t("apiKeys.modal_key_created")}</h3>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                      onClick={() => { setShowCreate(false); setCreatedFullKey(null); }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                    </button>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-3">
                    {t("apiKeys.copy_now_warning")}
                  </p>
                  <div className="flex items-center gap-2 bg-surface-container rounded-lg p-3">
                    <code className="text-xs font-mono text-on-surface flex-1 break-all">{createdFullKey}</code>
                    <button
                      className="shrink-0 p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded transition-colors"
                      onClick={() => copyToClipboard(createdFullKey, "new-key")}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                        {copiedKey === "new-key" ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                  {copiedKey === "new-key" && (
                    <p className="text-xs text-emerald-600 mt-2 font-medium">{t("apiKeys.copied_to_clipboard")}</p>
                  )}
                  <div className="flex justify-end mt-6">
                    <button
                      className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                      onClick={() => { setShowCreate(false); setCreatedFullKey(null); }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Create Form State */
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold font-headline">{t("apiKeys.modal_create_title")}</h3>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                      onClick={() => setShowCreate(false)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                    </button>
                  </div>
                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="text-sm font-semibold text-on-surface block mb-2">{t("apiKeys.label_name")}</label>
                      <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder='e.g. "Chatbot Key"'
                        className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-on-surface-variant"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      />
                    </div>

                    {/* Credit limit */}
                    <div>
                      <label className="text-sm font-semibold text-on-surface block mb-2">{t("apiKeys.label_credit_limit")}</label>
                      <input
                        type="text"
                        value={newKeyCreditLimit}
                        onChange={(e) => setNewKeyCreditLimit(e.target.value)}
                        placeholder="Leave blank for unlimited"
                        className="w-full bg-surface-container rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-on-surface-variant"
                      />
                    </div>

                    {/* Reset limit every */}
                    <div>
                      <label className="text-sm font-semibold text-on-surface block mb-2">{t("apiKeys.label_reset_every")}</label>
                      <div className="relative">
                        <select
                          value={newKeyResetLimit}
                          onChange={(e) => setNewKeyResetLimit(e.target.value)}
                          className="w-full appearance-none bg-surface-container rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                        >
                          <option>N/A</option>
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 18 }}>expand_more</span>
                      </div>
                    </div>

                    {/* Expiration */}
                    <div>
                      <label className="text-sm font-semibold text-on-surface block mb-2">{t("apiKeys.label_expiration")}</label>
                      <div className="relative">
                        <select
                          value={newKeyExpiration}
                          onChange={(e) => setNewKeyExpiration(e.target.value)}
                          className="w-full appearance-none bg-surface-container rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                        >
                          <option>No expiration</option>
                          <option>7 days</option>
                          <option>30 days</option>
                          <option>90 days</option>
                          <option>1 year</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 18 }}>expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      className="px-5 py-2.5 bg-surface-container text-on-surface-variant font-semibold rounded-lg text-sm hover:bg-surface-container-high transition-colors"
                      onClick={() => setShowCreate(false)}
                    >
                      {t("apiKeys.cancel")}
                    </button>
                    <button
                      className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                      onClick={handleCreate}
                    >
                      {t("apiKeys.create")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {editingKey && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setEditingKey(null)}>
            <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                <h3 className="text-lg font-bold font-headline">{t("apiKeys.modal_rename")}</h3>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                  onClick={() => setEditingKey(null)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>
              <div className="px-6 py-5">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded-lg px-3 py-2.5 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleRename(editingKey)}
                />
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant/10">
                <button className="px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" onClick={() => setEditingKey(null)}>
                  {t("apiKeys.cancel")}
                </button>
                <button className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity" onClick={() => handleRename(editingKey)}>
                  {t("apiKeys.save")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
            <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                <h3 className="text-lg font-bold font-headline text-error">{t("apiKeys.modal_delete")}</h3>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                  onClick={() => setDeleteConfirm(null)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-on-surface-variant">
                  Are you sure? Any applications using this key will immediately lose access. This cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-outline-variant/10">
                <button className="px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors" onClick={() => setDeleteConfirm(null)}>
                  {t("apiKeys.cancel")}
                </button>
                <button className="px-5 py-2.5 bg-error text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity" onClick={() => handleDelete(deleteConfirm)}>
                  {t("apiKeys.delete")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table - Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{t("apiKeys.col_name")}</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{t("apiKeys.col_key")}</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{t("apiKeys.col_created")}</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{t("apiKeys.col_last_used")}</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">{t("apiKeys.col_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((apiKey) => (
                <tr key={apiKey.fullKey} className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors group">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-on-surface text-sm">{apiKey.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-surface-container font-mono text-xs px-2 py-1 rounded text-on-surface-variant">
                        {apiKey.key}
                      </code>
                      <button
                        className={`transition-all ${copiedKey === apiKey.fullKey ? "text-emerald-500" : "text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100"}`}
                        onClick={() => copyToClipboard(apiKey.fullKey, apiKey.fullKey)}
                        title="Copy full key"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                          {copiedKey === apiKey.fullKey ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs">{apiKey.created}</td>
                  <td className="px-5 py-4 text-on-surface-variant text-xs">{apiKey.lastUsed}</td>
                  <td className="px-5 py-4 text-right relative">
                    <button
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                      onClick={() => setMenuOpen(menuOpen === apiKey.fullKey ? null : apiKey.fullKey)}
                    >
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                    {menuOpen === apiKey.fullKey && (
                      <div ref={menuRef} className="absolute right-6 top-full mt-1 w-44 bg-surface-container-lowest rounded-xl shadow-xl py-1 z-50">
                        <button
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                          onClick={() => copyToClipboard(apiKey.fullKey, apiKey.fullKey)}
                        >
                          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>content_copy</span>
                          {t("apiKeys.copy_key")}
                        </button>
                        <button
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                          onClick={() => { setEditingKey(apiKey.fullKey); setEditName(apiKey.name); setMenuOpen(null); }}
                        >
                          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>edit</span>
                          {t("apiKeys.rename")}
                        </button>
                        <div className="border-t border-outline-variant/10 my-1" />
                        <button
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                          onClick={() => { setDeleteConfirm(apiKey.fullKey); setMenuOpen(null); }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                          {t("apiKeys.delete")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-on-surface-variant/30 mb-2 block" style={{ fontSize: 40 }}>key_off</span>
                    <p className="text-sm">{t("apiKeys.no_keys_yet")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {keys.map((apiKey) => (
            <div key={apiKey.fullKey} className="bg-surface-container-lowest rounded-xl p-4 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-on-surface text-sm">{apiKey.name}</span>
                <button
                  className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                  onClick={() => setMenuOpen(menuOpen === apiKey.fullKey ? null : apiKey.fullKey)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_horiz</span>
                </button>
              </div>
              {/* Mobile context menu */}
              {menuOpen === apiKey.fullKey && (
                <div ref={menuRef} className="absolute right-4 top-12 w-44 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 py-1 z-50">
                  <button
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                    onClick={() => { copyToClipboard(apiKey.fullKey, apiKey.fullKey); setMenuOpen(null); }}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>content_copy</span>
                    {t("apiKeys.copy_key")}
                  </button>
                  <button
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                    onClick={() => { setEditingKey(apiKey.fullKey); setEditName(apiKey.name); setMenuOpen(null); }}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>edit</span>
                    {t("apiKeys.rename")}
                  </button>
                  <div className="border-t border-outline-variant/10 my-1" />
                  <button
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                    onClick={() => { setDeleteConfirm(apiKey.fullKey); setMenuOpen(null); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    {t("apiKeys.delete")}
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <code className="bg-surface-container font-mono text-xs px-2 py-1 rounded text-on-surface-variant">
                  {apiKey.key}
                </code>
                <button
                  className={`transition-all ${copiedKey === apiKey.fullKey ? "text-emerald-500" : "text-on-surface-variant hover:text-primary"}`}
                  onClick={() => copyToClipboard(apiKey.fullKey, apiKey.fullKey)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {copiedKey === apiKey.fullKey ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Created {apiKey.created}</span>
                <span>Last used {apiKey.lastUsed}</span>
              </div>
            </div>
          ))}
          {keys.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-on-surface-variant/30 mb-2 block" style={{ fontSize: 40 }}>key_off</span>
              <p className="text-sm">No API keys yet. Create one to get started.</p>
            </div>
          )}
        </div>
      </main>
    </SettingsLayout>
  );
}
