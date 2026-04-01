import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";

interface RoutingPageProps {
  readonly className?: string;
}

const MATCHED_MODELS = [
  "anthropic/claude-4-opus",
  "anthropic/claude-4-sonnet",
  "anthropic/claude-3.5-sonnet",
  "anthropic/claude-3.5-haiku",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-sonnet",
  "anthropic/claude-3-haiku",
  "openai/gpt-4o",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
  "google/gemini-2.0-flash",
  "google/gemini-2.0-flash-lite",
  "google/gemini-pro",
  "google/gemini-pro-vision",
];

export default function RoutingPage({ className }: RoutingPageProps) {
  const { t } = useTranslation();
  const [modelsExpanded, setModelsExpanded] = useState(false);
  const [preventOverrides, setPreventOverrides] = useState(false);
  const [sortValue, setSortValue] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [modelDropOpen, setModelDropOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");

  const toggleModels = useCallback(() => setModelsExpanded((v) => !v), []);
  const toggleOverrides = useCallback(() => setPreventOverrides((v) => !v), []);

  const SORT_OPTIONS = [
    { value: "default", label: t("routing.sort_default") },
    { value: "price", label: t("routing.sort_lowest_price") },
    { value: "throughput", label: t("routing.sort_highest_throughput") },
    { value: "latency", label: t("routing.sort_lowest_latency") },
  ];

  const MODEL_SUGGESTIONS = [
    "nexusai/auto",
    "anthropic/claude-4-sonnet",
    "anthropic/claude-3.5-sonnet",
    "openai/gpt-4o",
    "openai/gpt-4o-mini",
    "google/gemini-2.5-pro",
    "google/gemini-2.5-flash",
    "meta-llama/llama-4-scout",
  ];

  return (
    <SettingsLayout activeTab="routing" className={className}>
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
            {t("routing.title")}
          </h2>
          <p className="text-on-surface-variant text-sm">
            {t("routing.subtitle")}
          </p>
        </div>

        {/* Routing Content Sections */}
        <div className="space-y-16">
          {/* Auto Router Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">alt_route</span>
                <h2 className="text-base">{t("routing.section_auto_router")}</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t("routing.auto_router_desc")}
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t("routing.auto_router_body")}{" "}
                  <a className="text-primary hover:underline" href="/models">
                    nexusai/auto
                  </a>
                  .{" "}
                  <a className="text-primary hover:underline" href="/docs">
                    {t("routing.learn_more")}
                  </a>
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">{t("routing.label_allowed_models")}</label>
                  <div className="w-full">
                    <textarea
                      className="w-full h-32 p-4 bg-surface-container-lowest rounded-xl text-sm font-mono text-on-surface-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                      placeholder="anthropic/*, openai/gpt-4o, google/*"
                      defaultValue="anthropic/*, openai/gpt-4o, google/*"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {t("routing.model_patterns_help")}
                    </p>
                    <button
                      onClick={toggleModels}
                      className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-sm transition-transform"
                        style={{ transform: modelsExpanded ? "rotate(180deg)" : undefined }}
                      >
                        expand_more
                      </span>
                      <span>{t("routing.models_matched", { count: MATCHED_MODELS.length })}</span>
                    </button>
                    {modelsExpanded && (
                      <div className="mt-1 bg-surface-container-lowest rounded-xl p-4 space-y-1.5 max-h-64 overflow-y-auto">
                        {MATCHED_MODELS.map((m) => (
                          <div key={m} className="flex items-center gap-2 text-xs text-on-surface-variant py-1">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>check_circle</span>
                            <span className="font-mono">{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-on-surface">{t("routing.prevent_overrides")}</span>
                  <div className="relative group/tip">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                    <div className="absolute left-0 bottom-full mb-2 w-64 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                      {t("routing.prevent_overrides_tooltip")}
                    </div>
                  </div>
                </div>
                <label className="relative inline-block w-11 h-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preventOverrides}
                    onChange={toggleOverrides}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
                  {t("routing.save")}
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-outline-variant/10" />

          {/* Default Provider Sort Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">sort</span>
                <h2 className="text-base">{t("routing.section_provider_sort")}</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t("routing.provider_sort_desc")}
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t("routing.provider_sort_body")}
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t("routing.provider_sort_default")}{" "}
                  <a className="text-primary hover:underline" href="/docs">
                    {t("routing.learn_more")}
                  </a>
                  .
                </p>
                <div className="max-w-md relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="w-full flex items-center justify-between p-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span>{SORT_OPTIONS.find((o) => o.value === sortValue)?.label}</span>
                    <span
                      className="material-symbols-outlined text-on-surface-variant transition-transform"
                      style={{ fontSize: 18, transform: sortOpen ? "rotate(180deg)" : undefined }}
                    >
                      expand_more
                    </span>
                  </button>
                  {sortOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1">
                      {SORT_OPTIONS.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { setSortValue(o.value); setSortOpen(false); }}
                          className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                            sortValue === o.value
                              ? "text-primary bg-primary/5"
                              : "text-on-surface hover:bg-surface-container"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-outline-variant/10" />

          {/* Default Model Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">model_training</span>
                <h2 className="text-base">{t("routing.section_default_model")}</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t("routing.default_model_desc")}
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Specify which model to use when a request doesn't include a model parameter.
                </p>
                <div className="max-w-md relative">
                  <button
                    onClick={() => setModelDropOpen(!modelDropOpen)}
                    className="w-full flex items-center justify-between p-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <span className={selectedModel ? "font-mono" : "text-on-surface-variant"}>{selectedModel || "Select a model"}</span>
                    <span
                      className="material-symbols-outlined text-on-surface-variant transition-transform"
                      style={{ fontSize: 18, transform: modelDropOpen ? "rotate(180deg)" : undefined }}
                    >
                      expand_more
                    </span>
                  </button>
                  {modelDropOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1 max-h-56 overflow-y-auto">
                      {MODEL_SUGGESTIONS.map((m) => (
                        <button
                          key={m}
                          onClick={() => { setSelectedModel(m); setModelDropOpen(false); }}
                          className={`w-full text-left px-3.5 py-2 text-sm font-mono transition-colors ${
                            selectedModel === m
                              ? "text-primary bg-primary/5"
                              : "text-on-surface hover:bg-surface-container"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-on-surface-variant">
                    Common choices: nexusai/auto, anthropic/claude-4-sonnet, openai/gpt-4o-mini
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SettingsLayout>
  );
}
