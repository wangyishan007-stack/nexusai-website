import { useState, useRef, useEffect } from "react";
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
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
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
      <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="font-headline font-extrabold text-4xl text-on-background tracking-tight mb-2">
            API Keys
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Create and manage your API keys for accessing NexusAI.
          </p>
        </header>

        {/* Info Banner */}
        <div className="bg-blue-700 p-6 rounded-xl flex items-center justify-between mb-12 shadow-lg shadow-blue-700/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[28px]">info</span>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                Your default API key has full access to all models.
              </p>
              <p className="text-blue-100/80 text-sm">
                Keep your keys secure and do not share them in public repositories.
              </p>
            </div>
          </div>
          <button
            className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            onClick={() => { setShowCreate(true); setCreatedFullKey(null); }}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New Key
          </button>
        </div>

        {/* Create Key Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => { setShowCreate(false); setCreatedFullKey(null); }}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-headline">
                  {createdFullKey ? "Key Created" : "Create New API Key"}
                </h3>
                <button
                  className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  onClick={() => { setShowCreate(false); setCreatedFullKey(null); }}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="px-6 py-5">
                {createdFullKey ? (
                  <div>
                    <p className="text-sm text-on-surface-variant mb-3">
                      Copy this key now. You won't be able to see it again.
                    </p>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <code className="text-xs font-mono text-on-surface flex-1 break-all">{createdFullKey}</code>
                      <button
                        className="shrink-0 p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                        onClick={() => copyToClipboard(createdFullKey, "new-key")}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copiedKey === "new-key" ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>
                    {copiedKey === "new-key" && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">Copied to clipboard!</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Key Name
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. Production App"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                {createdFullKey ? (
                  <button
                    className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                    onClick={() => { setShowCreate(false); setCreatedFullKey(null); }}
                  >
                    Done
                  </button>
                ) : (
                  <>
                    <button
                      className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      onClick={() => setShowCreate(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                      onClick={handleCreate}
                    >
                      Create Key
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {editingKey && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setEditingKey(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-headline">Rename Key</h3>
                <button
                  className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  onClick={() => setEditingKey(null)}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="px-6 py-5">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleRename(editingKey)}
                />
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setEditingKey(null)}>
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity" onClick={() => handleRename(editingKey)}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-headline text-red-600">Delete Key</h3>
                <button
                  className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  onClick={() => setDeleteConfirm(null)}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-on-surface-variant">
                  Are you sure? Any applications using this key will immediately lose access. This cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700 transition-colors" onClick={() => handleDelete(deleteConfirm)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden ring-1 ring-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Key</th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">Last Used</th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((apiKey) => (
                <tr key={apiKey.fullKey} className="hover:bg-surface-container-high/30 transition-colors group border-t border-slate-50">
                  <td className="px-6 py-5">
                    <span className="font-semibold text-on-surface">{apiKey.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <code className="bg-surface-container font-mono text-xs px-2 py-1 rounded border border-outline-variant/30 text-on-surface-variant">
                        {apiKey.key}
                      </code>
                      <button
                        className={`transition-all ${copiedKey === apiKey.fullKey ? "text-emerald-500" : "text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100"}`}
                        onClick={() => copyToClipboard(apiKey.fullKey, apiKey.fullKey)}
                        title="Copy full key"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copiedKey === apiKey.fullKey ? "check" : "content_copy"}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm">{apiKey.created}</td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm">{apiKey.lastUsed}</td>
                  <td className="px-6 py-5 text-right relative">
                    <button
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                      onClick={() => setMenuOpen(menuOpen === apiKey.fullKey ? null : apiKey.fullKey)}
                    >
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                    {menuOpen === apiKey.fullKey && (
                      <div ref={menuRef} className="absolute right-6 top-full mt-1 w-44 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50">
                        <button
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => copyToClipboard(apiKey.fullKey, apiKey.fullKey)}
                        >
                          <span className="material-symbols-outlined text-[18px] text-slate-400">content_copy</span>
                          Copy Key
                        </button>
                        <button
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => { setEditingKey(apiKey.fullKey); setEditName(apiKey.name); setMenuOpen(null); }}
                        >
                          <span className="material-symbols-outlined text-[18px] text-slate-400">edit</span>
                          Rename
                        </button>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => { setDeleteConfirm(apiKey.fullKey); setMenuOpen(null); }}
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {keys.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[40px] text-slate-300 mb-2 block">key_off</span>
                    <p className="text-sm">No API keys yet. Create one to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </SettingsLayout>
  );
}
