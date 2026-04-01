import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";

interface PluginsPageProps {
  readonly className?: string;
}

const PLUGINS = [
  {
    name: "Web Search",
    description: "Augment LLM responses with real-time web search results",
    icon: "language",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    status: "Active",
    statusBg: "bg-green-100",
    statusColor: "text-green-700",
    hasToggle: false,
  },
  {
    name: "PDF Inputs",
    description: "Parse and extract content from uploaded PDF files",
    icon: "picture_as_pdf",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    status: "Enabled",
    statusBg: "bg-surface-container",
    statusColor: "text-on-surface-variant",
    hasToggle: false,
  },
  {
    name: "Response Healing",
    description: "Automatically fix malformed JSON responses from LLMs",
    icon: "auto_fix",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    status: null,
    statusBg: "",
    statusColor: "",
    hasToggle: true,
  },
];

const SEARCH_ENGINES = ["Native or Exa", "Google", "Bing", "Exa Only", "Native Only"];

function WebSearchModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"engine" | "domain">("engine");
  const [engine, setEngine] = useState("Native or Exa");
  const [engineOpen, setEngineOpen] = useState(false);
  const [maxResults, setMaxResults] = useState("");
  const [searchPrompt, setSearchPrompt] = useState("");
  const [preventOverrides, setPreventOverrides] = useState(false);
  const [domainFilter, setDomainFilter] = useState("");
  const [domains, setDomains] = useState<string[]>([]);

  const addDomain = useCallback(() => {
    const d = domainFilter.trim();
    if (d && !domains.includes(d)) {
      setDomains([...domains, d]);
      setDomainFilter("");
    }
  }, [domainFilter, domains]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">Configure Web Search</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Augment LLM responses with real-time web search results
              </p>
              <a href="/docs" className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1">
                Learn more
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              </a>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border border-outline-variant/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setTab("engine")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === "engine" ? "bg-surface-container-lowest text-on-surface" : "bg-surface-container text-on-surface-variant hover:text-on-surface"}`}
            >
              Engine
            </button>
            <button
              onClick={() => setTab("domain")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === "domain" ? "bg-surface-container-lowest text-on-surface" : "bg-surface-container text-on-surface-variant hover:text-on-surface"}`}
            >
              Domain Filters
            </button>
          </div>

          {tab === "engine" ? (
            <div className="space-y-5">
              {/* Search Engine */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <label className="text-sm font-semibold text-on-surface">Search Engine</label>
                  <div className="relative group/tip">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                    <div className="absolute left-0 bottom-full mb-2 w-56 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                      Choose which search engine to use for web search queries.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setEngineOpen(!engineOpen)}
                    className="w-full flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span>{engine}</span>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>unfold_more</span>
                  </button>
                  {engineOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1">
                      {SEARCH_ENGINES.map((e) => (
                        <button
                          key={e}
                          onClick={() => { setEngine(e); setEngineOpen(false); }}
                          className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${engine === e ? "text-primary bg-primary/5" : "text-on-surface hover:bg-surface-container"}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Max Results */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Max Results</label>
                <input
                  type="text"
                  value={maxResults}
                  onChange={(e) => setMaxResults(e.target.value)}
                  placeholder="Default"
                  className="w-full bg-surface-container border-none rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                />
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Maximum number of search results to include (1-20). See docs for default.
                </p>
              </div>

              {/* Search Prompt */}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">Search Prompt</label>
                <textarea
                  value={searchPrompt}
                  onChange={(e) => setSearchPrompt(e.target.value)}
                  placeholder="Default"
                  rows={4}
                  className="w-full bg-surface-container border-none rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Custom prompt injected with search results. Default instructs the model to incorporate results and cite sources using markdown links.
                </p>
              </div>

              {/* Prevent overrides */}
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-on-surface">Prevent overrides</span>
                  <div className="relative group/tip">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                    <div className="absolute left-0 bottom-full mb-2 w-56 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                      When enabled, individual API requests cannot override these default settings.
                    </div>
                  </div>
                </div>
                <label className="relative inline-block w-11 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preventOverrides}
                    onChange={() => setPreventOverrides(!preventOverrides)}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">
                Restrict search results to specific domains, or exclude certain domains from results.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addDomain(); }}
                  placeholder="e.g. example.com"
                  className="flex-1 bg-surface-container border-none rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                />
                <button
                  onClick={addDomain}
                  className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add
                </button>
              </div>
              {domains.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {domains.map((d) => (
                    <span key={d} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-mono px-2.5 py-1.5 rounded-lg">
                      {d}
                      <button onClick={() => setDomains(domains.filter((x) => x !== d))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">No domain filters configured. All domains are allowed.</p>
              )}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button onClick={onClose} className="px-6 py-2.5 border border-outline-variant/30 text-on-surface font-semibold rounded-lg text-sm hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button onClick={onClose} className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfModal({ onClose }: { onClose: () => void }) {
  const [maxPages, setMaxPages] = useState("");
  const [ocrEnabled, setOcrEnabled] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">Configure PDF Inputs</h3>
              <p className="text-sm text-on-surface-variant mt-1">Parse and extract content from uploaded PDF files</p>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Max Pages</label>
              <input
                type="text"
                value={maxPages}
                onChange={(e) => setMaxPages(e.target.value)}
                placeholder="Default (100)"
                className="w-full bg-surface-container border-none rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
              />
              <p className="text-xs text-on-surface-variant mt-1.5">Maximum number of pages to process per PDF file.</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
              <div>
                <span className="text-sm font-semibold text-on-surface">OCR Processing</span>
                <p className="text-xs text-on-surface-variant mt-0.5">Enable optical character recognition for scanned documents.</p>
              </div>
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={ocrEnabled} onChange={() => setOcrEnabled(!ocrEnabled)} />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button onClick={onClose} className="px-6 py-2.5 border border-outline-variant/30 text-on-surface font-semibold rounded-lg text-sm hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button onClick={onClose} className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponseHealingModal({ onClose }: { onClose: () => void }) {
  const [maxRetries, setMaxRetries] = useState("3");
  const [strictMode, setStrictMode] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold font-headline text-on-surface">Configure Response Healing</h3>
              <p className="text-sm text-on-surface-variant mt-1">Automatically fix malformed JSON responses from LLMs</p>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">Max Retries</label>
              <input
                type="text"
                value={maxRetries}
                onChange={(e) => setMaxRetries(e.target.value)}
                placeholder="3"
                className="w-full bg-surface-container border-none rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
              />
              <p className="text-xs text-on-surface-variant mt-1.5">Number of attempts to fix malformed JSON before returning an error.</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
              <div>
                <span className="text-sm font-semibold text-on-surface">Strict Mode</span>
                <p className="text-xs text-on-surface-variant mt-0.5">Require valid JSON schema compliance in addition to syntax.</p>
              </div>
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={strictMode} onChange={() => setStrictMode(!strictMode)} />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button onClick={onClose} className="px-6 py-2.5 border border-outline-variant/30 text-on-surface font-semibold rounded-lg text-sm hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button onClick={onClose} className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PluginsPage({ className }: PluginsPageProps) {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    "Response Healing": false,
  });
  const [showSettings, setShowSettings] = useState<string | null>(null);

  const handleToggle = useCallback((name: string) => {
    setToggleStates((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return (
    <SettingsLayout activeTab="plugins" className={className}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8">
        {/* Page Header */}
        <div className="max-w-4xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
            Plugins
          </h2>
          <p className="text-on-surface-variant text-sm">
            Extend your LLM capabilities with modular integrations and specialized tools.
          </p>
        </div>

        {/* Bento Layout Section */}
        <section className="max-w-4xl space-y-6">
          {/* Section Descriptor Card */}
          <div className="bg-surface-container-low rounded-xl p-6 flex items-start space-x-4">
            <div className="p-2 bg-primary/8 rounded-lg text-primary">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Default Plugin Settings
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">
                Configure default plugin behavior for your API requests. These settings apply
                globally unless overridden in specific request payloads.
              </p>
            </div>
          </div>

          {/* Plugin Vertical List */}
          <div className="space-y-3">
            {PLUGINS.map((plugin) => (
              <div
                key={plugin.name}
                className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-300 p-5 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${plugin.iconBg} flex items-center justify-center ${plugin.iconColor} group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{plugin.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface">{plugin.name}</h4>
                    <p className="text-on-surface-variant text-sm">{plugin.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {plugin.status && (
                    <span
                      className={`px-2.5 py-1 ${plugin.statusBg} ${plugin.statusColor} text-[10px] font-bold uppercase tracking-wider rounded-md`}
                    >
                      {plugin.status}
                    </span>
                  )}
                  {plugin.hasToggle && (
                    <div className="flex items-center cursor-pointer" onClick={() => handleToggle(plugin.name)}>
                      <div className={`relative w-11 h-6 rounded-full transition-colors ${toggleStates[plugin.name] ? "bg-primary" : "bg-surface-container-highest"}`}>
                        <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${toggleStates[plugin.name] ? "right-1" : "left-1"}`} />
                      </div>
                      <span className="ml-3 text-xs font-medium text-on-surface-variant">{toggleStates[plugin.name] ? "ON" : "OFF"}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowSettings(plugin.name)}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">settings</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      {showSettings === "Web Search" && <WebSearchModal onClose={() => setShowSettings(null)} />}
      {showSettings === "PDF Inputs" && <PdfModal onClose={() => setShowSettings(null)} />}
      {showSettings === "Response Healing" && <ResponseHealingModal onClose={() => setShowSettings(null)} />}
    </SettingsLayout>
  );
}
