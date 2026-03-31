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

function ProviderSelect({
  label,
  description,
  selected,
  onChange,
}: {
  label: string;
  description: string;
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
    <div>
      <h4 className="font-semibold text-sm text-on-surface mb-1">{label}</h4>
      <p className="text-sm text-on-surface-variant mb-3">{description}</p>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant/10 rounded-lg px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container/40 transition-colors"
        >
          Select providers...
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
        </button>
        {open && available.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto py-1">
            {available.map((p) => (
              <button
                key={p}
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                onClick={() => { onChange([...selected, p]); }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-lg"
            >
              {p}
              <button
                onClick={() => onChange(selected.filter((s) => s !== p))}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuardrailsPage({ className }: GuardrailsPageProps) {
  const [paidTraining, setPaidTraining] = useState(false);
  const [freeTraining, setFreeTraining] = useState(true);
  const [freePublish, setFreePublish] = useState(false);
  const [ignoredProviders, setIgnoredProviders] = useState<string[]>([]);
  const [allowedProviders, setAllowedProviders] = useState<string[]>([]);
  const [enforceAllowed, setEnforceAllowed] = useState(false);

  const togglePaid = useCallback(() => setPaidTraining((v) => !v), []);
  const toggleFree = useCallback(() => setFreeTraining((v) => !v), []);
  const toggleFreePublish = useCallback(() => setFreePublish((v) => !v), []);
  const toggleEnforce = useCallback(() => setEnforceAllowed((v) => !v), []);

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

        {/* Eligibility Preview Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">visibility</span>
                <h2 className="font-headline text-lg font-semibold text-on-surface">Eligibility Preview</h2>
              </div>
              <p className="text-sm text-on-surface-variant">
                Providers and models available based on your account settings.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-on-surface-variant">
                <span className="text-emerald-600 font-medium">380 available</span>
                {" | "}
                <span>4 unavailable</span>
              </p>
              <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                Show All
              </button>
              <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                New
              </button>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
                {[
                  { emoji: "✦", bg: "bg-blue-50", name: "Lyria 3 Pro Preview" },
                  { emoji: "✦", bg: "bg-blue-50", name: "Lyria 3 Clip Preview" },
                  { emoji: "🌀", bg: "bg-purple-50", name: "Qwen3.6 Plus Preview (free)" },
                  { emoji: "🎨", bg: "bg-amber-50", name: "Wan 2.6 (experimental)" },
                  { emoji: "🐙", bg: "bg-pink-50", name: "KAT - Coder - Pro V2" },
                  { emoji: "🎬", bg: "bg-amber-50", name: "Seedance 1.5 Pro (experimental)" },
                  { emoji: "🎥", bg: "bg-blue-50", name: "Sora 2 Pro (experimental)" },
                  { emoji: "📹", bg: "bg-emerald-50", name: "Veo 3.1 (experimental)" },
                ].map((model, i, arr) => (
                  <div
                    key={model.name}
                    className={`flex items-center justify-between px-5 py-3.5 hover:bg-surface-container/40 transition-colors ${i < arr.length - 1 ? "border-b border-outline-variant/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-lg ${model.bg} flex items-center justify-center text-base`}>
                        {model.emoji}
                      </span>
                      <span className="text-sm font-medium text-on-surface">{model.name}</span>
                    </div>
                    <span
                      className="material-symbols-outlined text-emerald-500 text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                ))}
          </div>
        </section>

        {/* Privacy Settings Section */}
        <section className="space-y-6 mb-12">
          <h2 className="font-headline text-lg font-semibold text-on-surface">Privacy Settings</h2>
          <div className="space-y-4">
            {/* Toggle 1: Paid Endpoints */}
            <div className="bg-surface-container-lowest rounded-xl p-6 flex items-start justify-between">
              <div className="flex-1 pr-8">
                <h3 className="font-semibold text-sm text-on-surface mb-1">
                  Enable paid endpoints that may train on inputs
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Control whether to enable paid endpoints that can anonymously use your data for
                  training purposes.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input className="sr-only peer" type="checkbox" checked={paidTraining} onChange={togglePaid} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Toggle 2: Free Endpoints Training */}
            <div className={`bg-surface-container-lowest rounded-xl p-6 flex items-start justify-between ${freeTraining ? "ring-1 ring-primary/10" : ""}`}>
              <div className="flex-1 pr-8">
                <h3 className="font-semibold text-sm text-on-surface mb-1">
                  Enable free endpoints that may train on inputs
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Free model providers often retain and/or train on prompts and completions (applies
                  to both chatroom and API usage). See the model page for details.
                </p>
                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-secondary-container/10 rounded-lg w-fit">
                  <span className="material-symbols-outlined text-on-secondary-container text-sm">info</span>
                  <span className="text-[11px] font-medium text-on-secondary-container">
                    Recommended for rapid prototyping only
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input className="sr-only peer" type="checkbox" checked={freeTraining} onChange={toggleFree} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Toggle 3: Free Endpoints Publish */}
            <div className={`bg-surface-container-lowest rounded-xl p-6 flex items-start justify-between ${freePublish ? "ring-1 ring-primary/10" : ""}`}>
              <div className="flex-1 pr-8">
                <h3 className="font-semibold text-sm text-on-surface mb-1">
                  Enable free endpoints that may publish prompts
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Some free providers may publish your prompts publicly. Disable to ensure your prompts remain private.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input className="sr-only peer" type="checkbox" checked={freePublish} onChange={toggleFreePublish} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </section>

        {/* Provider Restrictions Section */}
        <section className="space-y-6 mb-12">
          <h2 className="font-headline text-lg font-semibold text-on-surface">Provider Restrictions</h2>
          <div className="bg-surface-container-lowest rounded-xl p-6 space-y-8">
            {/* Ignored Providers */}
            <ProviderSelect
              label="Ignored Providers"
              description="Requests will never be routed to these providers."
              selected={ignoredProviders}
              onChange={setIgnoredProviders}
            />

            <div className="border-t border-outline-variant/10" />

            {/* Allowed Providers */}
            <ProviderSelect
              label="Allowed Providers"
              description="Requests will only be routed to these providers."
              selected={allowedProviders}
              onChange={setAllowedProviders}
            />

            <div className="border-t border-outline-variant/10" />

            {/* Always Enforce Allowed */}
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-8">
                <h4 className="font-semibold text-sm text-on-surface mb-1">Always Enforce Allowed</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  When enabled, requests that cannot be fulfilled by allowed providers will be rejected rather than routed elsewhere.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input className="sr-only peer" type="checkbox" checked={enforceAllowed} onChange={toggleEnforce} />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </section>

        {/* API Key Guardrails Section */}
        <section className="space-y-4 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-lg font-semibold text-on-surface">API Key Guardrails</h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Apply custom guardrail rules to specific API keys.
              </p>
            </div>
            <button
              disabled
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create
            </button>
          </div>
          <p className="text-xs text-on-surface-variant italic">Coming soon</p>
        </section>

        {/* Smart Optimization Status */}
        <section className="p-6 bg-surface-container-lowest rounded-xl mb-12">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-surface-container-lowest rounded-lg">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <div>
              <h4 className="font-headline text-sm font-bold text-on-surface">
                Smart Optimization Active
              </h4>
              <p className="text-sm text-on-surface-variant mt-1">
                Guardrails are active. Requests that violate your policy will be blocked or rerouted automatically.
              </p>
              <button className="mt-4 text-primary font-semibold text-[13px] flex items-center gap-1 hover:underline">
                View Policy Logs{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </SettingsLayout>
  );
}
