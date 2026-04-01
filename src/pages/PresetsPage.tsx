import { useState, useRef, useEffect, useCallback } from "react";
import SettingsLayout from "../components/SettingsLayout";

interface PresetsPageProps {
  readonly className?: string;
}

const PROVIDERS = [
  "AssemblyAI", "AI21", "AnyLLM", "Alibaba", "Amazon", "Amazon Bedrock", "Amazon Nova", "Anthropic",
];

const QUANTIZATIONS = ["int4", "int8", "fp4", "fp8", "fp16", "bf16", "cf16", "cf32"];

const MODEL_LIST = [
  "anthropic/claude-4-opus",
  "anthropic/claude-4-sonnet",
  "anthropic/claude-3.5-sonnet",
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "openai/o3",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
  "meta-llama/llama-4-scout",
  "mistralai/mistral-large",
  "deepseek/deepseek-r1",
];

interface ParamConfig {
  label: string;
  description: string;
  defaultValue: string;
  step?: string;
}

const PARAMETERS: ParamConfig[] = [
  { label: "Temperature", description: "Controls randomness of the output. Lower values are more deterministic.", defaultValue: "1.00", step: "0.01" },
  { label: "Top P", description: "Controls diversity via cumulative probability.", defaultValue: "1.00", step: "0.01" },
  { label: "Top K", description: "Limits the number of highest probability tokens to consider.", defaultValue: "", step: "1" },
  { label: "Frequency Penalty", description: "Reduces repetition based on token frequency in the text so far.", defaultValue: "0.00", step: "0.01" },
  { label: "Presence Penalty", description: "Reduces repetition based on whether tokens appear in the text so far.", defaultValue: "0.00", step: "0.01" },
  { label: "Repetition Penalty", description: "Penalizes repetition. Values > 1 discourage repetition, < 1 encourage it.", defaultValue: "1.00", step: "0.01" },
  { label: "Max Tokens", description: "Maximum number of tokens to generate.", defaultValue: "", step: "1" },
];

interface SavedPreset {
  name: string;
  slug: string;
  description: string;
  models: string[];
}

function ModelAddDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = MODEL_LIST.filter(
    (m) => !selected.includes(m) && m.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
        Add model
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search models..."
              className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-on-surface-variant italic">No models found</p>
            ) : (
              filtered.map((m) => (
                <button
                  key={m}
                  onClick={() => { onChange([...selected, m]); setSearch(""); }}
                  className="w-full text-left px-3 py-2 text-sm font-mono text-on-surface hover:bg-surface-container transition-colors"
                >
                  {m}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PresetEditor({ onBack, onSave }: { onBack: () => void; onSave: (preset: SavedPreset) => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [includeProviderPrefs, setIncludeProviderPrefs] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");
  const [enabledParams, setEnabledParams] = useState<Record<string, boolean>>({});
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [reasoningEnabled, setReasoningEnabled] = useState(false);
  const [excludeReasoning, setExcludeReasoning] = useState(false);

  const toggleParam = (label: string) => {
    setEnabledParams((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"), description: description.trim(), models });
  }, [name, slug, description, models, onSave]);

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold font-headline tracking-tight">New Preset</h2>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
        >
          Save Preset
        </button>
      </div>

      <div className="space-y-10">
        {/* Basic Info */}
        <section>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="md:w-48 shrink-0">
              <h3 className="font-semibold text-sm text-on-surface">Basic Info</h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                Preset name and description for identification and organization.
              </p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/15" />

        {/* Model Selection */}
        <section>
          <h3 className="font-semibold text-sm text-on-surface mb-1">Model Selection (Optional)</h3>
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            Specify which model(s) the preset should use. Leave empty to allow any model. If multiple models are selected, they will be used as fallbacks.
          </p>
          {models.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {models.map((m, i) => (
                <span key={m} className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-mono px-2.5 py-1.5 rounded-lg">
                  {i > 0 && <span className="text-on-surface-variant text-[10px] mr-0.5">fallback</span>}
                  {m}
                  <button onClick={() => setModels(models.filter((x) => x !== m))} className="text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                  </button>
                </span>
              ))}
            </div>
          )}
          <ModelAddDropdown selected={models} onChange={setModels} />
        </section>

        <hr className="border-outline-variant/15" />

        {/* Provider Preferences */}
        <section>
          <h3 className="font-semibold text-sm text-on-surface mb-1">Provider Preferences</h3>
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            Configure provider routing preferences like allowed/ignored providers, fallbacks, etc.
          </p>
          <label className="flex items-center gap-2 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={includeProviderPrefs}
              onChange={() => setIncludeProviderPrefs(!includeProviderPrefs)}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-sm text-on-surface font-medium">Include Provider Preferences</span>
          </label>

          {includeProviderPrefs && (
            <div className="space-y-6 pl-0 md:pl-6 border-l-2 border-outline-variant/15 ml-0 md:ml-2">
              {/* Route */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">route</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  The sorting strategy to use for this request. If "order" is not specified, it will be used searching for a preference.
                </p>
                <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
                  <option>—</option>
                  <option>price</option>
                  <option>latency</option>
                  <option>throughput</option>
                </select>
              </div>

              {/* data_collection */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">data_collection</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  Data collection setting. If no available model provider meets the requirements, your request will return an error.
                </p>
                <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
                  <option>—</option>
                  <option>deny</option>
                  <option>allow</option>
                </select>
              </div>

              {/* order */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">order</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  An ordered list of provider slugs. The router will attempt to use the first provider in the result of the list that supports your requested model.
                </p>
                <div className="border border-outline-variant/30 rounded-lg p-3 space-y-2 bg-surface-container-lowest max-h-48 overflow-y-auto">
                  {PROVIDERS.map((p) => (
                    <label key={`order-${p}`} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary" />
                      <span className="text-sm text-on-surface">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* only */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">only</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  List of provider slugs to allow. If provided, the list is merged with your account-wide allowed provider settings for this request.
                </p>
                <div className="border border-outline-variant/30 rounded-lg p-3 space-y-2 bg-surface-container-lowest max-h-48 overflow-y-auto">
                  {PROVIDERS.map((p) => (
                    <label key={`only-${p}`} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary" />
                      <span className="text-sm text-on-surface">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ignore */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">ignore</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  List of provider slugs to ignore. If provided, the list is merged with your account-wide ignore provider settings for this request.
                </p>
                <div className="border border-outline-variant/30 rounded-lg p-3 space-y-2 bg-surface-container-lowest max-h-48 overflow-y-auto">
                  {PROVIDERS.map((p) => (
                    <label key={`ignore-${p}`} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary" />
                      <span className="text-sm text-on-surface">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* quantizations */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">quantizations</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  A list of quantization levels to filter by.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {QUANTIZATIONS.map((q) => (
                    <label key={q} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-outline-variant text-primary focus:ring-primary" />
                      <span className="text-sm text-on-surface">{q}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* max_price */}
              <div className="pl-4">
                <label className="block text-xs font-medium text-on-surface-variant mb-1.5">max_price</label>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  The object specifying the maximum price you want to pay for this request, USD cents per million tokens, for prompt and completion.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-on-surface-variant mb-1">Prompt</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-on-surface-variant mb-1">Completion</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <hr className="border-outline-variant/15" />

        {/* Prompt & Completion */}
        <section className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Completion</label>
            <textarea
              value={completion}
              onChange={(e) => setCompletion(e.target.value)}
              rows={3}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all resize-y"
            />
          </div>
        </section>

        <hr className="border-outline-variant/15" />

        {/* Throughput & Latency */}
        <section className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">preferred_max_throughput</label>
            <p className="text-[11px] text-on-surface-variant mb-2">
              Preferred maximum throughput in tokens per second. Can be a number (applied to all) or an object with provider-specific cutoffs.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {["all", "Org 1", "Org 2", "Org 3", "Org 4", "Org 5", "Org 6", "Org 7"].map((label) => (
                <div key={`tp-${label}`}>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{label}</label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">preferred_max_latency</label>
            <p className="text-[11px] text-on-surface-variant mb-2">
              Preferred maximum latency in milliseconds. Can be a number (applied to all) or an object with provider-specific cutoffs.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {["all", "Org 1", "Org 2", "Org 3", "Org 4", "Org 5", "Org 6", "Org 7"].map((label) => (
                <div key={`lt-${label}`}>
                  <label className="block text-[11px] text-on-surface-variant mb-1">{label}</label>
                  <input
                    type="text"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/15" />

        {/* Fallbacks & JSON */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Allow Fallbacks</label>
            <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
              <option>true</option>
              <option>false</option>
              <option>undefined</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Request parameters</label>
            <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
              <option>undefined</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1.5">JSON mode</label>
            <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
              <option>undefined</option>
              <option>true</option>
              <option>false</option>
            </select>
          </div>
        </section>

        <hr className="border-outline-variant/15" />

        {/* Parameters */}
        <section>
          <h3 className="font-semibold text-sm text-on-surface mb-1">Parameters</h3>
          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
            Configure model parameters like temperature, max tokens, etc. These will override default values when the preset is used. Check the boxes next to parameters you want to include in the preset.
          </p>
          <div className="space-y-5">
            {PARAMETERS.map((param) => {
              const enabled = enabledParams[param.label] ?? false;
              return (
                <div key={param.label} className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-on-surface">{param.label}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{param.description}</p>
                    {enabled && (
                      <input
                        type="number"
                        step={param.step}
                        value={paramValues[param.label] ?? param.defaultValue}
                        onChange={(e) => setParamValues((prev) => ({ ...prev, [param.label]: e.target.value }))}
                        className="mt-2 w-full max-w-[200px] bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary transition-all"
                      />
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleParam(param.label)}
                      className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-on-surface-variant">Include</span>
                  </label>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-outline-variant/15" />

        {/* Reasoning */}
        <section>
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className="font-semibold text-sm text-on-surface">Reasoning</h3>
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={reasoningEnabled}
                onChange={() => setReasoningEnabled(!reasoningEnabled)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-xs text-on-surface-variant">Include</span>
            </label>
          </div>
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            Configure reasoning (thinking) parameters for models that support extended reasoning capabilities. This controls how the model reasons through problems.
          </p>
          <p className="text-[11px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-6">
            Note: These settings only apply to models that support reasoning (e.g. GPT, o, Claude, and Gemini models). They will be ignored when the preset is used with non-reasoning models.
          </p>

          {reasoningEnabled && (
            <div className="space-y-5 border-t border-outline-variant/15 pt-5">
              <div>
                <h4 className="text-sm font-medium text-on-surface mb-0.5">Reasoning Effort</h4>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  Constrains effort on reasoning in compatible models, affecting how many tokens are used for internal reasoning.
                </p>
                <select className="w-full max-w-[200px] appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary transition-all">
                  <option>—</option>
                  <option>low</option>
                  <option>medium</option>
                  <option>high</option>
                </select>
              </div>
              <div>
                <h4 className="text-sm font-medium text-on-surface mb-0.5">Reasoning Max Tokens</h4>
                <p className="text-[11px] text-on-surface-variant mb-2">
                  Maximum number of tokens for reasoning. Controls the generation depth and detail.
                </p>
                <input
                  type="number"
                  className="w-full max-w-[200px] bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-medium text-on-surface mb-0.5">Exclude Reasoning From Response</h4>
                  <p className="text-[11px] text-on-surface-variant">
                    When enabled, reasoning tokens will not be included in the returned response.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={excludeReasoning}
                    onChange={() => setExcludeReasoning(!excludeReasoning)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-on-surface-variant">Include</span>
                </label>
              </div>
            </div>
          )}
        </section>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </main>
  );
}

export default function PresetsPage({ className }: PresetsPageProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen === null) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleSave = useCallback((preset: SavedPreset) => {
    setPresets((prev) => [...prev, preset]);
    setShowEditor(false);
  }, []);

  return (
    <SettingsLayout activeTab="presets" className={className}>
      {showEditor ? (
        <PresetEditor onBack={() => setShowEditor(false)} onSave={handleSave} />
      ) : (
        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-headline tracking-tight mb-2">
                Presets
              </h2>
              <p className="text-on-surface-variant text-sm">
                Create and manage shortcuts for system prompts and request parameters.
              </p>
            </div>
            {presets.length > 0 && (
              <button
                onClick={() => setShowEditor(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                New Preset
              </button>
            )}
          </div>

          {presets.length === 0 ? (
            /* Empty State */
            <div className="bg-surface-container-lowest rounded-xl min-h-[500px] flex items-center justify-center border border-outline-variant/15 ambient-shadow">
              <div className="max-w-sm w-full text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-surface-container rounded-3xl flex items-center justify-center mb-8 rotate-3">
                  <div className="w-16 h-16 bg-surface-container-lowest rounded-2xl flex items-center justify-center shadow-sm -rotate-6">
                    <span
                      className="material-symbols-outlined text-4xl text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-3">Create your first preset</h2>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8 px-4">
                  Presets are shortcuts for your system prompts and request parameters.{" "}
                  <a className="text-primary font-medium hover:underline" href="/docs">
                    Learn more
                  </a>
                </p>
                <button
                  onClick={() => setShowEditor(true)}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                    add
                  </span>
                  New Preset
                </button>
              </div>
            </div>
          ) : (
            /* Preset List */
            <div className="bg-surface-container-lowest rounded-xl">
              <div className="grid grid-cols-[1fr_1fr_32px] items-center px-5 py-3 border-b border-outline-variant/10">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Preset</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Models</span>
                <span />
              </div>
              {presets.map((p, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_32px] items-center px-5 py-4 border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-container/40 transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-on-surface">{p.name}</p>
                    {p.description && <p className="text-xs text-on-surface-variant mt-0.5 truncate">{p.description}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.models.length === 0 ? (
                      <span className="text-xs text-on-surface-variant italic">Any model</span>
                    ) : (
                      p.models.map((m) => (
                        <span key={m} className="inline-flex items-center px-2 py-0.5 bg-surface-container rounded-md text-[11px] font-mono text-on-surface-variant">
                          {m}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="relative flex justify-end" ref={menuOpen === i ? menuRef : undefined}>
                    <button
                      onClick={() => setMenuOpen(menuOpen === i ? null : i)}
                      className="p-1 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span>
                    </button>
                    {menuOpen === i && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1">
                        <button
                          onClick={() => setMenuOpen(null)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => { setPresets(presets.filter((_, idx) => idx !== i)); setMenuOpen(null); }}
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
        </main>
      )}
    </SettingsLayout>
  );
}
