import { useState, useCallback, useRef, useEffect } from "react";
import SettingsLayout from "../components/SettingsLayout";

interface GuardrailsPageProps {
  readonly className?: string;
}

const ALL_PROVIDERS = [
  "OpenAI", "Anthropic", "Google", "Meta", "Mistral", "DeepSeek",
  "Qwen", "xAI", "Cohere", "Zhipu AI", "Together AI", "Fireworks AI",
  "Groq", "Perplexity", "Replicate", "AWS Bedrock",
];

const ELIGIBILITY_MODELS = [
  { name: "MiniMax M2.5 (free)", color: "bg-rose-400" },
  { name: "gpt-oss-120b (free)", color: "bg-gray-400" },
  { name: "gpt-oss-20b (free)", color: "bg-gray-400" },
  { name: "Olmo 2 32B Instruct", color: "bg-gray-600" },
];

function ProviderAddDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const available = ALL_PROVIDERS.filter((p) => !selected.includes(p));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant/20 rounded-lg text-sm text-on-surface hover:bg-surface-container/40 transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
        Add
      </button>
      {open && available.length > 0 && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-surface-container-high rounded-lg shadow-xl border border-outline-variant/20 z-20 max-h-48 overflow-y-auto py-1">
          {available.map((p) => (
            <button
              key={p}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
              onClick={() => { onChange([...selected, p]); setOpen(false); }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SENSITIVE_PATTERNS = [
  { label: "Email address", key: "email", slow: false },
  { label: "Phone number", key: "phone", slow: false },
  { label: "Social Security number", key: "ssn", slow: false },
  { label: "Credit card number", key: "cc", slow: false },
  { label: "IP address", key: "ip", slow: false },
  { label: "Person name", key: "name", slow: true },
  { label: "Address", key: "address", slow: true },
];

const ELIGIBILITY_MODELS_FULL = [
  { name: "Grok 4.20 Multi-Agent", color: "bg-gray-800" },
  { name: "Grok 4.20", color: "bg-gray-800" },
  { name: "Lyria 3 Pro Preview", color: "bg-blue-500" },
  { name: "Lyria 3 Clip Preview", color: "bg-blue-500" },
  { name: "Qwen3.6 Plus Preview (free)", color: "bg-purple-400" },
  { name: "Wan 2.6 (experimental)", color: "bg-amber-400" },
];

interface GuardrailItem {
  name: string;
  budget: string;
  zdr: string;
  keyCount: number;
  memberCount: number;
}

function NewGuardrailView({ onBack, onSave }: { onBack: () => void; onSave: (item: GuardrailItem) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [resetFreq, setResetFreq] = useState("");
  const [zdrPolicy, setZdrPolicy] = useState("Default (Disabled)");
  const [paidTrainPolicy, setPaidTrainPolicy] = useState("Default (Disallowed)");
  const [freeTrainPolicy, setFreeTrainPolicy] = useState("Default (Allowed)");
  const [publishPolicy, setPublishPolicy] = useState("Default (Disallowed)");
  const [sensitiveChecked, setSensitiveChecked] = useState<Record<string, boolean>>({});
  const [customPatterns, setCustomPatterns] = useState<{ regex: string; action: string }[]>([]);
  const [testInput, setTestInput] = useState("");
  const [providerDropdown, setProviderDropdown] = useState<"allow" | "ignore" | null>(null);
  const [providerSearch, setProviderSearch] = useState("");
  const [allowedProvs, setAllowedProvs] = useState<string[]>([]);
  const [ignoredProvs, setIgnoredProvs] = useState<string[]>([]);
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const provDropRef = useRef<HTMLDivElement>(null);
  const [newFilterMode, setNewFilterMode] = useState<"all" | "available" | "unavailable">("all");
  const [newSortMode, setNewSortMode] = useState<"az" | "new">("az");
  const [apiKeyOpen, setApiKeyOpen] = useState(false);
  const [apiKeySearch, setApiKeySearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const apiKeyRef = useRef<HTMLDivElement>(null);

  const toggleSensitive = (key: string) => {
    setSensitiveChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const enableAll = () => {
    const all: Record<string, boolean> = {};
    SENSITIVE_PATTERNS.forEach((p) => { all[p.key] = true; });
    setSensitiveChecked(all);
  };

  useEffect(() => {
    if (!providerDropdown) return;
    const handler = (e: MouseEvent) => {
      if (provDropRef.current && !provDropRef.current.contains(e.target as Node)) {
        setProviderDropdown(null);
        setProviderSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [providerDropdown]);

  const usedProviders = [...allowedProvs, ...ignoredProvs];
  const filteredProviders = ALL_PROVIDERS.filter(
    (p) => !usedProviders.includes(p) && p.toLowerCase().includes(providerSearch.toLowerCase())
  );

  useEffect(() => {
    if (!apiKeyOpen) return;
    const handler = (e: MouseEvent) => {
      if (apiKeyRef.current && !apiKeyRef.current.contains(e.target as Node)) {
        setApiKeyOpen(false);
        setApiKeySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [apiKeyOpen]);

  const MOCK_API_KEYS = [
    { name: "key", prefix: "sk-or-v1-e83...aae" },
    { name: "production", prefix: "sk-or-v1-f42...b7c" },
    { name: "staging", prefix: "sk-or-v1-a19...d5e" },
  ];

  const filteredApiKeys = MOCK_API_KEYS.filter(
    (k) => !selectedKeys.includes(k.name) && (k.name.toLowerCase().includes(apiKeySearch.toLowerCase()) || k.prefix.includes(apiKeySearch))
  );

  const handleSelectProvider = (name: string) => {
    if (providerDropdown === "allow") {
      setAllowedProvs((prev) => [...prev, name]);
    } else {
      setIgnoredProvs((prev) => [...prev, name]);
    }
    setProviderDropdown(null);
    setProviderSearch("");
  };

  const PolicySelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-3 pr-8 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer"
      >
        <option>Default (Disabled)</option>
        <option>Default (Allowed)</option>
        <option>Default (Disallowed)</option>
        <option>Always Enabled</option>
        <option>Always Disabled</option>
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 14 }}>unfold_more</span>
    </div>
  );

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold font-headline tracking-tight">New Guardrail</h2>
        </div>
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({
              name: name.trim(),
              budget: creditLimit || "No Budget",
              zdr: zdrPolicy.includes("Disabled") ? "ZDR Inherited" : "ZDR Enforced",
              keyCount: selectedKeys.length,
              memberCount: 0,
            });
          }}
          className="px-5 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Save
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-8 bg-surface-container-lowest rounded-xl p-5 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 20 }}>lightbulb</span>
        <div className="text-sm text-on-surface-variant leading-relaxed">
          <p>Guardrails allow setting budgets, privacy, model, and provider restrictions on specific API keys.</p>
          <p className="mt-1">By default, your global settings apply. Guardrails help to apply further restrictions, at a more granular level.</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* ── Model Eligibility ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">Model Eligibility</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Providers and models available with this guardrail and your global privacy settings.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-on-surface-variant">
                <span className="font-medium">380 available</span> | 4 unavailable
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNewFilterMode((v) => v === "all" ? "available" : v === "available" ? "unavailable" : "all")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${newFilterMode !== "all" ? "bg-surface-container text-on-surface font-medium" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {newFilterMode === "unavailable" ? "visibility_off" : "visibility"}
                  </span>
                  {newFilterMode === "all" ? "Show All" : newFilterMode === "available" ? "Available" : "Unavailable"}
                </button>
                <button
                  onClick={() => setNewSortMode((v) => v === "az" ? "new" : "az")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${newSortMode === "new" ? "bg-surface-container text-on-surface font-medium" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sort</span>
                  {newSortMode === "az" ? "A-Z" : "New"}
                </button>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              {ELIGIBILITY_MODELS_FULL.map((m, i, arr) => (
                <div key={m.name} className={`flex items-center justify-between px-5 py-3 hover:bg-surface-container/40 transition-colors ${i < arr.length - 1 ? "border-b border-outline-variant/10" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${m.color}`} />
                    <span className="text-sm text-on-surface">{m.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>check_circle</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* ── Basic Info ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">Basic Info</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Guardrail name and description for identification and organization.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-on-surface mb-1.5 block">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/10 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                placeholder='e.g., "$5/day" or "Team Weekly Limit"'
              />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface mb-1.5 block">Description (optional)</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/10 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:ring-1 focus:ring-primary/30 focus:outline-none"
              />
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* ── Budget ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">Budget</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Set a spending limit applied individually to each assigned API key.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-on-surface mb-1.5 block">Credit Limit (USD)</label>
              <input
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/10 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                placeholder="Leave blank for unlimited"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-on-surface mb-1.5">
                Reset limit every...
                <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 14 }}>info</span>
              </label>
              <div className="relative">
                <select
                  value={resetFreq}
                  onChange={(e) => setResetFreq(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-2.5 text-sm text-on-surface pr-8 focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer"
                >
                  <option value="">Select reset frequency</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 16 }}>unfold_more</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* ── Privacy ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">Privacy</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Privacy and data usage settings. Account-level defaults are inherited unless overridden.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm text-on-surface mb-0.5">Always enforce ZDR</h4>
                <p className="text-xs text-on-surface-variant">Reject requests that cannot be processed without data retention.</p>
              </div>
              <PolicySelect value={zdrPolicy} onChange={setZdrPolicy} />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm text-on-surface mb-0.5">Paid endpoints that may train on request data</h4>
                <p className="text-xs text-on-surface-variant">Some providers may anonymously use your data for training purposes.</p>
              </div>
              <PolicySelect value={paidTrainPolicy} onChange={setPaidTrainPolicy} />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm text-on-surface mb-0.5">Free endpoints that may train on request data</h4>
                <p className="text-xs text-on-surface-variant">Providers serving free models often retain and/or train on prompts and completions.</p>
              </div>
              <PolicySelect value={freeTrainPolicy} onChange={setFreeTrainPolicy} />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-semibold text-sm text-on-surface mb-0.5">Free endpoints that may publish prompts</h4>
                <p className="text-xs text-on-surface-variant">Some free model providers may publish prompts and completions.</p>
              </div>
              <PolicySelect value={publishPolicy} onChange={setPublishPolicy} />
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* ── Providers ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">Providers</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Control which providers are used for routing. Leave empty to allow all.
            </p>
          </div>
          <div className="space-y-4">
            {/* Selected providers */}
            {allowedProvs.length > 0 && (
              <div>
                <p className="text-xs text-on-surface-variant mb-2 font-medium">Allowed</p>
                <div className="flex flex-wrap gap-2">
                  {allowedProvs.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-lg">
                      {p}
                      <button onClick={() => setAllowedProvs((prev) => prev.filter((s) => s !== p))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {ignoredProvs.length > 0 && (
              <div>
                <p className="text-xs text-on-surface-variant mb-2 font-medium">Ignored</p>
                <div className="flex flex-wrap gap-2">
                  {ignoredProvs.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-lg">
                      {p}
                      <button onClick={() => setIgnoredProvs((prev) => prev.filter((s) => s !== p))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons + dropdown */}
            <div className="relative" ref={provDropRef}>
              <div className="flex gap-3">
                <button
                  onClick={() => { setProviderDropdown(providerDropdown === "allow" ? null : "allow"); setProviderSearch(""); }}
                  className={`flex items-center gap-1.5 px-6 py-3 border border-dashed border-outline-variant/30 rounded-xl text-sm transition-colors ${providerDropdown === "allow" ? "text-primary border-primary/30" : "text-on-surface hover:bg-surface-container/40"}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                  Allow provider
                </button>
                <button
                  onClick={() => { setProviderDropdown(providerDropdown === "ignore" ? null : "ignore"); setProviderSearch(""); }}
                  className={`flex items-center gap-1.5 px-6 py-3 border border-dashed border-outline-variant/30 rounded-xl text-sm transition-colors ${providerDropdown === "ignore" ? "text-primary border-primary/30" : "text-on-surface hover:bg-surface-container/40"}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                  Ignore provider
                </button>
              </div>

              {providerDropdown && (
                <div className="absolute left-0 top-0 -translate-y-full mb-2 w-72 bg-surface-container-high rounded-xl shadow-xl border border-outline-variant/20 z-50 overflow-hidden" style={{ marginTop: -8 }}>
                  {/* Search */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
                    <input
                      autoFocus
                      value={providerSearch}
                      onChange={(e) => setProviderSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
                      placeholder="Search providers"
                    />
                  </div>
                  {/* Hide Unavailable toggle */}
                  <div className="px-4 py-2">
                    <button
                      onClick={() => setHideUnavailable((v) => !v)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${hideUnavailable ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
                    >
                      Hide Unavailable
                    </button>
                  </div>
                  {/* Provider list */}
                  <div className="px-2 pb-2">
                    <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">Providers</p>
                    <div className="max-h-56 overflow-y-auto">
                      {filteredProviders.map((p) => (
                        <button
                          key={p}
                          onClick={() => handleSelectProvider(p)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface hover:bg-surface-container/60 transition-colors text-left"
                        >
                          <div className="w-6 h-6 rounded-md bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                            {p.charAt(0)}
                          </div>
                          {p}
                        </button>
                      ))}
                      {filteredProviders.length === 0 && (
                        <p className="px-3 py-2 text-sm text-on-surface-variant italic">No providers found</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* ── Sensitive Info ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">Sensitive Info</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Automatically detect and handle sensitive information in requests.
            </p>
          </div>
          <div className="space-y-6">
            {/* Patterns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface">Patterns</label>
                <button onClick={enableAll} className="px-3 py-1 border border-outline-variant/20 rounded-lg text-xs text-on-surface hover:bg-surface-container/40 transition-colors">
                  Enable all
                </button>
              </div>
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
                {SENSITIVE_PATTERNS.map((p, i, arr) => (
                  <label key={p.key} className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-container/40 transition-colors ${i < arr.length - 1 ? "border-b border-outline-variant/10" : ""}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!sensitiveChecked[p.key]}
                        onChange={() => toggleSensitive(p.key)}
                        className="w-4 h-4 rounded border-outline-variant accent-primary"
                      />
                      <span className="text-sm text-on-surface">{p.label}</span>
                      <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 14 }}>info</span>
                      {p.slow && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded">Adds latency</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Patterns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-on-surface">Custom Patterns</label>
                <button
                  onClick={() => setCustomPatterns((prev) => [...prev, { regex: "", action: "Redact" }])}
                  className="flex items-center gap-1.5 px-3 py-1 border border-outline-variant/20 rounded-lg text-xs text-on-surface hover:bg-surface-container/40 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                  Add Pattern
                </button>
              </div>
              {customPatterns.length === 0 ? (
                <p className="text-sm text-on-surface-variant">No patterns configured. Add a regex pattern to redact or block matching content.</p>
              ) : (
                <div className="space-y-2">
                  {customPatterns.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3">
                      <input
                        value={p.regex}
                        onChange={(e) => setCustomPatterns((prev) => prev.map((item, j) => j === i ? { ...item, regex: e.target.value } : item))}
                        className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
                        placeholder="Enter regex pattern"
                      />
                      <span className="text-xs text-on-surface-variant font-mono shrink-0">[REDACTED]</span>
                      <div className="relative shrink-0">
                        <select
                          value={p.action}
                          onChange={(e) => setCustomPatterns((prev) => prev.map((item, j) => j === i ? { ...item, action: e.target.value } : item))}
                          className="appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-lg pl-3 pr-7 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer"
                        >
                          <option>Redact</option>
                          <option>Block</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 14 }}>unfold_more</span>
                      </div>
                      <button
                        onClick={() => setCustomPatterns((prev) => prev.filter((_, j) => j !== i))}
                        className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Patterns */}
            <div>
              <label className="text-sm font-medium text-on-surface mb-1 block">Test Your Patterns</label>
              <p className="text-xs text-on-surface-variant mb-2">Enter sample input to preview what the LLM would receive (redaction) or whether the request would be blocked.</p>
              <input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/10 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:ring-1 focus:ring-primary/30 focus:outline-none"
                placeholder="e.g., My email is test@example.com and my name is John Smith"
              />
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* ── API Keys ── */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-on-surface">API Keys</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              API keys with this guardrail. Organization member guardrails implicitly apply to any API keys that member created.
            </p>
          </div>
          <div className="space-y-3">
            {/* Selected keys */}
            {selectedKeys.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedKeys.map((k) => {
                  const keyData = MOCK_API_KEYS.find((m) => m.name === k);
                  return (
                    <span key={k} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-lg">
                      {k} <span className="text-on-surface-variant">({keyData?.prefix})</span>
                      <button onClick={() => setSelectedKeys((prev) => prev.filter((s) => s !== k))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Add button + dropdown */}
            <div className="relative" ref={apiKeyRef}>
              <button
                onClick={() => { setApiKeyOpen((v) => !v); setApiKeySearch(""); }}
                className={`flex items-center gap-1.5 px-6 py-3 border border-dashed border-outline-variant/30 rounded-xl text-sm transition-colors ${apiKeyOpen ? "text-primary border-primary/30" : "text-on-surface hover:bg-surface-container/40"}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Add API key
              </button>

              {apiKeyOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-surface-container-high rounded-xl shadow-xl border border-outline-variant/20 z-50 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/10">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
                    <input
                      autoFocus
                      value={apiKeySearch}
                      onChange={(e) => setApiKeySearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
                      placeholder="Search API keys..."
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto py-1">
                    {filteredApiKeys.map((k) => (
                      <button
                        key={k.name}
                        onClick={() => { setSelectedKeys((prev) => [...prev, k.name]); setApiKeyOpen(false); setApiKeySearch(""); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-container/60 transition-colors"
                      >
                        <div className="w-5 h-5 rounded border border-outline-variant/30" />
                        <span className="text-sm text-on-surface font-medium">{k.name}</span>
                        <span className="text-xs text-on-surface-variant">({k.prefix})</span>
                      </button>
                    ))}
                    {filteredApiKeys.length === 0 && (
                      <p className="px-4 py-2 text-sm text-on-surface-variant italic">No keys found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function GuardrailsPage({ className }: GuardrailsPageProps) {
  const [view, setView] = useState<"list" | "new">("list");
  const [guardrails, setGuardrails] = useState<GuardrailItem[]>([]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [paidTraining, setPaidTraining] = useState(false);
  const [freeTraining, setFreeTraining] = useState(true);
  const [freePublish, setFreePublish] = useState(false);
  const [zdrOnly, setZdrOnly] = useState(false);
  const [ignoredProviders, setIgnoredProviders] = useState<string[]>([]);
  const [allowedProviders, setAllowedProviders] = useState<string[]>([]);
  const [enforceAllowed, setEnforceAllowed] = useState(true);
  const [filterMode, setFilterMode] = useState<"all" | "available" | "unavailable">("all");
  const [sortMode, setSortMode] = useState<"az" | "new">("az");
  const cycleFilter = useCallback(() => {
    setFilterMode((v) => v === "all" ? "available" : v === "available" ? "unavailable" : "all");
  }, []);

  useEffect(() => {
    if (menuOpen === null) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const togglePaid = useCallback(() => setPaidTraining((v) => !v), []);
  const toggleFree = useCallback(() => setFreeTraining((v) => !v), []);
  const toggleFreePublish = useCallback(() => setFreePublish((v) => !v), []);
  const toggleZdr = useCallback(() => setZdrOnly((v) => !v), []);
  const toggleEnforce = useCallback(() => setEnforceAllowed((v) => !v), []);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input className="sr-only peer" type="checkbox" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
    </label>
  );

  if (view === "new") {
    return (
      <SettingsLayout activeTab="guardrails" className={className}>
        <NewGuardrailView
          onBack={() => setView("list")}
          onSave={(item) => { setGuardrails((prev) => [...prev, item]); setView("list"); }}
        />
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout activeTab="guardrails" className={className}>
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">Guardrails</h2>
          <p className="text-on-surface-variant text-sm">
            Manage data consent and set spending limits, model restrictions, and usage policies.
          </p>
        </header>

        <div className="space-y-16">
          {/* ── Eligibility Preview ── */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">visibility</span>
                <h2 className="text-base">Eligibility Preview</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Providers and models available based on your account settings.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-on-surface-variant">
                  <span className="font-medium">380 available</span>
                  {" | "}
                  <span>4 unavailable</span>
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={cycleFilter}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${filterMode !== "all" ? "bg-surface-container text-on-surface font-medium" : "text-on-surface-variant hover:text-on-surface"}`}
                    title="Click to cycle filter mode"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      {filterMode === "unavailable" ? "visibility_off" : "visibility"}
                    </span>
                    {filterMode === "all" ? "Show All" : filterMode === "available" ? "Available" : "Unavailable"}
                  </button>
                  <button
                    onClick={() => setSortMode((v) => v === "az" ? "new" : "az")}
                    className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sort</span>
                    {sortMode === "az" ? "A-Z" : "New"}
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
                {ELIGIBILITY_MODELS.map((model, i, arr) => (
                  <div
                    key={model.name}
                    className={`flex items-center justify-between px-5 py-3.5 hover:bg-surface-container/40 transition-colors ${i < arr.length - 1 ? "border-b border-outline-variant/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full ${model.color}`} />
                      <span className="text-sm text-on-surface">{model.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>check_circle</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-outline-variant/10" />

          {/* ── Privacy Settings ── */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">shield</span>
                <h2 className="text-base">Privacy Settings</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Control how your data is used for training and logging purposes.
              </p>
            </div>
            <div className="space-y-8">
              {/* Paid endpoints training */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-on-surface mb-1">
                    Enable paid endpoints that may train on inputs
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Control whether to enable paid endpoints that can anonymously use your data for training purposes.{" "}
                    <span className="material-symbols-outlined text-on-surface-variant align-middle cursor-help" style={{ fontSize: 14 }}>info</span>
                  </p>
                </div>
                <Toggle checked={paidTraining} onChange={togglePaid} />
              </div>

              {/* Free endpoints training */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-on-surface mb-1">
                    Enable free endpoints that may train on inputs
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Free model providers often retain and/or train on prompts and completions (applies to both chatroom and API usage). See the model page for details.
                  </p>
                </div>
                <Toggle checked={freeTraining} onChange={toggleFree} />
              </div>

              {/* Free endpoints publish */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-on-surface mb-1">
                    Enable free endpoints that may publish prompts
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Allow free model providers to publish your prompts and completions to public datasets.{" "}
                    <span className="material-symbols-outlined text-on-surface-variant align-middle cursor-help" style={{ fontSize: 14 }}>info</span>
                  </p>
                </div>
                <Toggle checked={freePublish} onChange={toggleFreePublish} />
              </div>

              {/* ZDR Endpoints Only */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-on-surface mb-1">
                    ZDR Endpoints Only
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    When enabled, you will only be able to route to endpoints that have a Zero Data Retention policy.{" "}
                    <a href="/docs" className="text-primary hover:underline">View ZDR Endpoints</a>
                  </p>
                </div>
                <Toggle checked={zdrOnly} onChange={toggleZdr} />
              </div>
            </div>
          </section>

          <hr className="border-outline-variant/10" />

          {/* ── Provider Restrictions ── */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Configure which providers can handle your requests.
              </p>
            </div>
            <div className="space-y-8">
              {/* Ignored Providers */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-on-surface">Ignored Providers</h4>
                  <ProviderAddDropdown selected={[...ignoredProviders, ...allowedProviders]} onChange={setIgnoredProviders} />
                </div>
                <p className="text-sm text-on-surface-variant mb-3">Exclude these providers from serving any requests.</p>
                {ignoredProviders.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {ignoredProviders.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-lg">
                        {p}
                        <button onClick={() => setIgnoredProviders(ignoredProviders.filter((s) => s !== p))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant italic">No providers are currently ignored.</p>
                )}
              </div>

              <div className="border-t border-outline-variant/10" />

              {/* Allowed Providers */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-on-surface">Allowed Providers</h4>
                  <ProviderAddDropdown selected={[...ignoredProviders, ...allowedProviders]} onChange={setAllowedProviders} />
                </div>
                <p className="text-sm text-on-surface-variant mb-3">Exclusively enable these providers for your requests.</p>
                {allowedProviders.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allowedProviders.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-lg">
                        {p}
                        <button onClick={() => setAllowedProviders(allowedProviders.filter((s) => s !== p))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant italic">No providers are specifically allowed. All non-ignored providers are used.</p>
                )}
              </div>

              <div className="border-t border-outline-variant/10" />

              {/* Always Enforce Allowed */}
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-on-surface mb-1">Always Enforce Allowed</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    When disabled, additional providers can be included on API requests via the{" "}
                    <code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">only</code>{" "}
                    field. When enabled, only providers explicitly allowed here can be used.
                  </p>
                </div>
                <Toggle checked={enforceAllowed} onChange={toggleEnforce} />
              </div>

              {/* Warning note */}
              <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
                <span className="material-symbols-outlined text-on-surface-variant shrink-0" style={{ fontSize: 18 }}>warning</span>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  <strong>NOTE:</strong> Ignoring multiple providers, or limiting to specific providers, may reduce fallback options and limit request recovery capabilities.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── API Key & Member Guardrails ── */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              API Key &amp; Member Guardrails
            </h2>
            <button onClick={() => setView("new")} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Create
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-3 border-b border-outline-variant/10">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Guardrail</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Assigned</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Attributes</span>
            </div>
            {guardrails.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-on-surface-variant italic">
                  No additional guardrails. Create one to scope policies to specific keys or members.
                </p>
              </div>
            ) : (
              <div>
                {guardrails.map((g, i) => (
                  <div key={i} className="flex items-center px-5 py-4 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-container/40 transition-colors">
                    <div className="w-1/3 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-surface-container-highest" />
                      <span className="text-sm font-medium text-on-surface">{g.name}</span>
                    </div>
                    <div className="w-1/6 flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>key</span>
                        {g.keyCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>group</span>
                        {g.memberCount}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container rounded-md text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>payments</span>
                        {g.budget}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container rounded-md text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified_user</span>
                        {g.zdr}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container rounded-md text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>model_training</span>
                        All models
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container rounded-md text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>dns</span>
                        All providers
                      </span>
                    </div>
                    <div className="relative" ref={menuOpen === i ? menuRef : undefined}>
                      <button
                        onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                        className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
                      </button>
                      {menuOpen === i && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1">
                          <button
                            onClick={() => { setMenuOpen(null); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                            Edit
                          </button>
                          <button
                            onClick={() => { setGuardrails(guardrails.filter((_, idx) => idx !== i)); setMenuOpen(null); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-error hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </SettingsLayout>
  );
}
