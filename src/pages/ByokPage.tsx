import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";

interface ByokPageProps {
  readonly className?: string;
}

const PROVIDERS = [
  {
    name: "AI21",
    icon: "neurology",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    status: "not-configured" as const,
  },
  {
    name: "Amazon Bedrock",
    icon: "cloud",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    status: "not-configured" as const,
  },
  {
    name: "Anthropic",
    icon: "psychology_alt",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    status: "active" as const,
  },
  {
    name: "Arcee AI",
    icon: "architecture",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    status: "not-configured" as const,
  },
  {
    name: "Azure",
    icon: "grid_view",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    status: "active" as const,
  },
  {
    name: "Baseten",
    icon: "view_compact",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    status: "not-configured" as const,
  },
];

const PROVIDER_MODELS: Record<string, string[]> = {
  "AI21": ["Jamba Large 1.7", "Jamba Mini 1.6", "Jamba Instruct"],
  "Amazon Bedrock": ["Claude 3.5 Sonnet", "Claude 3 Haiku", "Titan Express"],
  "Anthropic": ["Claude 4 Opus", "Claude 4 Sonnet", "Claude 3.5 Haiku"],
  "Arcee AI": ["Arcee Agent", "Arcee Spotlight"],
  "Azure": ["GPT-4o", "GPT-4o Mini", "GPT-4 Turbo"],
  "Baseten": ["Llama 3.1 70B", "Mistral 7B"],
};

export default function ByokPage({ className }: ByokPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [keyEnabled, setKeyEnabled] = useState(true);
  const [alwaysUse, setAlwaysUse] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testModel, setTestModel] = useState("");
  const testRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 6;

  const filteredProviders = useMemo(() => {
    if (!searchQuery.trim()) return PROVIDERS;
    const q = searchQuery.trim().toLowerCase();
    return PROVIDERS.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);
  const paginatedProviders = filteredProviders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (!testOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (testRef.current && !testRef.current.contains(e.target as Node)) {
        setTestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [testOpen]);

  const handleEdit = useCallback((name: string) => {
    setEditingProvider(name);
    setShowKey(false);
    setKeyEnabled(true);
    setAlwaysUse(false);
    setTestOpen(false);
    setTestModel(PROVIDER_MODELS[name]?.[0] ?? "");
  }, []);

  return (
    <SettingsLayout activeTab="byok" className={className}>
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* BYOK Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
              BYOK
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="text-sm">Use your own provider API keys on NexusAI</span>
              <div className="relative flex items-center cursor-pointer hover:text-primary transition-colors group/info">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
                <div className="absolute left-0 top-full mt-2 w-72 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-4 z-30 opacity-0 pointer-events-none group-hover/info:opacity-100 group-hover/info:pointer-events-auto transition-opacity text-on-surface text-sm leading-relaxed space-y-3">
                  <p>Using your own key allows you to manage rate limits and expenses directly through your provider account.</p>
                  <p>The first 1M BYOK requests per-month are free. All subsequent usage is billed at <strong>5% of the upstream provider's cost</strong>.</p>
                  <p>Your keys are always prioritized, with optional fallback to NexusAI credits for increased reliability.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Search Input for Providers */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-on-surface-variant"
              placeholder="Search providers..."
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Provider Table - Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Provider
                </th>
                <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Integration Status
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProviders.map((provider) => (
                <tr
                  key={provider.name}
                  className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${provider.iconBg} flex items-center justify-center ${provider.iconColor}`}
                      >
                        <span className="material-symbols-outlined">{provider.icon}</span>
                      </div>
                      <span className="font-semibold text-on-surface">{provider.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          provider.status === "active" ? "bg-emerald-500" : "bg-surface-container-highest"
                        }`}
                      />
                      {provider.status === "active" ? (
                        <span className="text-sm text-on-surface-variant font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-sm text-on-surface-variant italic">Not configured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleEdit(provider.name)}
                      className={`p-2 rounded-lg transition-all ${editingProvider === provider.name ? "text-primary bg-primary/8" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{editingProvider === provider.name ? "close" : "edit"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Footer */}
          <div className="px-5 py-4 border-t border-outline-variant/10 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">
              Showing {paginatedProviders.length} of {filteredProviders.length} providers
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Provider Cards - Mobile */}
        <div className="md:hidden space-y-3 mb-8">
          {paginatedProviders.map((provider) => (
            <div key={provider.name} className="bg-surface-container-lowest rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${provider.iconBg} flex items-center justify-center ${provider.iconColor}`}>
                  <span className="material-symbols-outlined">{provider.icon}</span>
                </div>
                <span className="font-semibold text-on-surface flex-1">{provider.name}</span>
                <button onClick={() => handleEdit(provider.name)} className={`p-1.5 rounded-lg transition-all ${editingProvider === provider.name ? "text-primary bg-primary/8" : "text-on-surface-variant hover:text-primary hover:bg-surface-container"}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{editingProvider === provider.name ? "close" : "edit"}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${provider.status === "active" ? "bg-emerald-500" : "bg-surface-container-highest"}`} />
                <span className="text-xs text-on-surface-variant">
                  {provider.status === "active" ? "Active" : "Not configured"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Provider Key Modal */}
        {editingProvider && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
            onClick={() => setEditingProvider(null)}
          >
            <div
              className="w-full max-w-md mx-4 bg-surface-container-high rounded-xl shadow-2xl border border-outline-variant/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative px-6 pt-6 pb-4">
                <h3 className="text-lg font-bold text-on-surface text-center">
                  Enable {editingProvider} Key
                </h3>
                <button
                  onClick={() => setEditingProvider(null)}
                  className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 pb-6 space-y-5">
                {/* Supported models link */}
                <div className="text-right">
                  <a
                    href="/models"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View {editingProvider} supported models
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                  </a>
                </div>

                {/* Key input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-on-surface">
                    Key
                    <span className="relative group/tip">
                      <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-inverse-surface text-inverse-on-surface text-[11px] rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-50">
                        Your provider API key, encrypted and stored securely.
                      </span>
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      className="w-full px-4 py-2.5 bg-surface-container rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all pr-10"
                      placeholder="ncc1701abcdefg ... 47vwxyz"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                        {showKey ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Enabled toggle */}
                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-on-surface">
                    Enabled
                    <span className="relative group/tip">
                      <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-inverse-surface text-inverse-on-surface text-[11px] rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-50">
                        Toggle to activate or deactivate this key.
                      </span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setKeyEnabled((v) => !v)}
                    className="relative inline-block w-11 h-6 cursor-pointer"
                  >
                    <div className={`w-11 h-6 rounded-full transition-colors ${keyEnabled ? "bg-primary" : "bg-surface-container-highest"}`}>
                      <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${keyEnabled ? "translate-x-5" : ""}`} />
                    </div>
                  </button>
                </div>

                {/* Always use toggle */}
                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-on-surface">
                    Always use for this provider
                    <span className="relative group/tip">
                      <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-inverse-surface text-inverse-on-surface text-[11px] rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity z-50">
                        Always route requests through your own key.
                      </span>
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAlwaysUse((v) => !v)}
                    className="relative inline-block w-11 h-6 cursor-pointer"
                  >
                    <div className={`w-11 h-6 rounded-full transition-colors ${alwaysUse ? "bg-primary" : "bg-surface-container-highest"}`}>
                      <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${alwaysUse ? "translate-x-5" : ""}`} />
                    </div>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <div ref={testRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setTestOpen((v) => !v)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>science</span>
                      Test
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>expand_more</span>
                    </button>
                    {testOpen && (
                      <div className="absolute bottom-full right-0 mb-1 w-64 bg-surface-container-high rounded-xl shadow-xl border border-outline-variant/20 p-4 z-50 space-y-3">
                        <p className="text-sm text-on-surface-variant">Select model to test</p>
                        <div className="relative">
                          <select
                            value={testModel}
                            onChange={(e) => setTestModel(e.target.value)}
                            className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2.5 text-sm text-on-surface pr-8 focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer"
                          >
                            {(PROVIDER_MODELS[editingProvider ?? ""] ?? []).map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 16 }}>unfold_more</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTestOpen(false)}
                          className="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                        >
                          Run Test
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingProvider(null)}
                    className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insight Card */}
        <div className="p-6 rounded-xl bg-surface-container-lowest">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lightbulb
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-1">
                AI Recommendation
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                You currently have <strong>Azure</strong> and <strong>Anthropic</strong> configured.
                Consider connecting <strong>Amazon Bedrock</strong> to increase your model redundancy
                and optimize routing costs across regions.
              </p>
              <div className="mt-4 flex gap-3">
                <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                  View Savings Estimate
                </button>
                <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-wider transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SettingsLayout>
  );
}
