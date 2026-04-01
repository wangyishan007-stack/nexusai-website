import { useState, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

/* ─── Model Data ─── */

interface ModelInfo {
  name: string;
  author: string;
  modelId: string;
  contextLength: string;
  reasoning: boolean;
  providers: number;
  description: string;
  activity: number[]; // 12 weekly bars (mock)
  tokenStats: { label: string; value: string; color: string }[];
  provider: string;
  latency: string;
  throughput: string;
  pricing: { input: string; output: string; images: string };
  features: {
    inputModalities: string;
    outputModalities: string;
    quantization: string;
    maxOutputTokens: string;
    streamCancellation: boolean;
    supportsTools: boolean;
    noPromptTraining: boolean;
    caching: boolean;
  };
}

const ALL_MODELS: Record<string, ModelInfo> = {
  "gpt-4o": {
    name: "GPT-4o",
    author: "openai",
    modelId: "openai/gpt-4o",
    contextLength: "128K",
    reasoning: false,
    providers: 3,
    description:
      "GPT-4o is OpenAI's flagship multimodal model, accepting text, image, and audio inputs.",
    activity: [15, 22, 30, 28, 35, 42, 38, 45, 50, 55, 48, 60],
    tokenStats: [
      { label: "Prompt", value: "45.8B", color: "bg-primary" },
      { label: "Completion", value: "599M", color: "bg-tertiary" },
      { label: "Reasoning", value: "313M", color: "bg-yellow-500" },
    ],
    provider: "OpenAI",
    latency: "1.86s",
    throughput: "44.0 tok/s",
    pricing: { input: "$2.50 / M tokens", output: "$10 / M tokens", images: "—" },
    features: {
      inputModalities: "text, image, file",
      outputModalities: "text",
      quantization: "unknown",
      maxOutputTokens: "16K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: true,
      caching: true,
    },
  },
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    author: "anthropic",
    modelId: "anthropic/claude-3.5-sonnet",
    contextLength: "200K",
    reasoning: true,
    providers: 3,
    description:
      "Claude 3.5 Sonnet excels at coding, analysis, and complex reasoning tasks.",
    activity: [20, 18, 25, 30, 32, 40, 38, 50, 55, 62, 58, 70],
    tokenStats: [
      { label: "Prompt", value: "38.2B", color: "bg-primary" },
      { label: "Completion", value: "720M", color: "bg-tertiary" },
      { label: "Reasoning", value: "480M", color: "bg-yellow-500" },
    ],
    provider: "Anthropic",
    latency: "1.20s",
    throughput: "52.0 tok/s",
    pricing: { input: "$3.00 / M tokens", output: "$15 / M tokens", images: "—" },
    features: {
      inputModalities: "text, image",
      outputModalities: "text",
      quantization: "unknown",
      maxOutputTokens: "8K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: true,
      caching: true,
    },
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    author: "deepseek",
    modelId: "deepseek/deepseek-v3",
    contextLength: "164K",
    reasoning: true,
    providers: 2,
    description:
      "DeepSeek V3 delivers near-frontier performance at a fraction of the cost.",
    activity: [8, 12, 15, 20, 25, 28, 35, 42, 55, 65, 72, 80],
    tokenStats: [
      { label: "Prompt", value: "22.1B", color: "bg-primary" },
      { label: "Completion", value: "410M", color: "bg-tertiary" },
      { label: "Reasoning", value: "890M", color: "bg-yellow-500" },
    ],
    provider: "DeepSeek",
    latency: "2.10s",
    throughput: "38.0 tok/s",
    pricing: { input: "$0.32 / M tokens", output: "$1.28 / M tokens", images: "—" },
    features: {
      inputModalities: "text",
      outputModalities: "text",
      quantization: "MoE 671B/37B",
      maxOutputTokens: "8K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: false,
      caching: false,
    },
  },
  "gemini-2-0-flash": {
    name: "Gemini 2.0 Flash",
    author: "google",
    modelId: "google/gemini-2.0-flash",
    contextLength: "1M",
    reasoning: false,
    providers: 2,
    description:
      "Gemini 2.0 Flash offers a 1M context window with blazing-fast inference.",
    activity: [10, 14, 18, 22, 28, 30, 35, 40, 45, 50, 48, 55],
    tokenStats: [
      { label: "Prompt", value: "30.5B", color: "bg-primary" },
      { label: "Completion", value: "520M", color: "bg-tertiary" },
      { label: "Reasoning", value: "150M", color: "bg-yellow-500" },
    ],
    provider: "Google",
    latency: "0.95s",
    throughput: "68.0 tok/s",
    pricing: { input: "$0.10 / M tokens", output: "$0.40 / M tokens", images: "$0.02" },
    features: {
      inputModalities: "text, image, audio, video",
      outputModalities: "text",
      quantization: "unknown",
      maxOutputTokens: "8K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: true,
      caching: true,
    },
  },
  "llama-3-1-405b": {
    name: "Llama 3.1 405B",
    author: "meta",
    modelId: "meta/llama-3.1-405b",
    contextLength: "128K",
    reasoning: false,
    providers: 4,
    description:
      "Meta's largest open-weight model, competitive with leading closed-source models.",
    activity: [25, 30, 28, 35, 32, 38, 40, 42, 45, 40, 38, 35],
    tokenStats: [
      { label: "Prompt", value: "18.9B", color: "bg-primary" },
      { label: "Completion", value: "320M", color: "bg-tertiary" },
      { label: "Reasoning", value: "100M", color: "bg-yellow-500" },
    ],
    provider: "Together",
    latency: "2.40s",
    throughput: "32.0 tok/s",
    pricing: { input: "$3.00 / M tokens", output: "$3.00 / M tokens", images: "—" },
    features: {
      inputModalities: "text",
      outputModalities: "text",
      quantization: "none",
      maxOutputTokens: "4K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: false,
      caching: false,
    },
  },
  "o1-preview": {
    name: "o1-preview",
    author: "openai",
    modelId: "openai/o1-preview",
    contextLength: "128K",
    reasoning: true,
    providers: 2,
    description:
      "OpenAI's advanced reasoning model with chain-of-thought capabilities for complex problem solving.",
    activity: [5, 8, 12, 18, 25, 30, 35, 42, 50, 55, 52, 58],
    tokenStats: [
      { label: "Prompt", value: "8.2B", color: "bg-primary" },
      { label: "Completion", value: "210M", color: "bg-tertiary" },
      { label: "Reasoning", value: "1.8B", color: "bg-yellow-500" },
    ],
    provider: "OpenAI",
    latency: "3.20s",
    throughput: "28.0 tok/s",
    pricing: { input: "$15.00 / M tokens", output: "$60.00 / M tokens", images: "—" },
    features: {
      inputModalities: "text",
      outputModalities: "text",
      quantization: "unknown",
      maxOutputTokens: "32K",
      streamCancellation: false,
      supportsTools: false,
      noPromptTraining: true,
      caching: false,
    },
  },
  "alibaba-wan-2-6": {
    name: "Alibaba Wan 2.6",
    author: "alibaba",
    modelId: "alibaba/wan-2.6",
    contextLength: "128K",
    reasoning: false,
    providers: 2,
    description:
      "Alibaba's multi-modal LLM with strong multilingual and vision capabilities.",
    activity: [8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35],
    tokenStats: [
      { label: "Prompt", value: "1.2B", color: "bg-primary" },
      { label: "Completion", value: "85M", color: "bg-tertiary" },
      { label: "Reasoning", value: "20M", color: "bg-yellow-500" },
    ],
    provider: "Alibaba",
    latency: "1.50s",
    throughput: "55.0 tok/s",
    pricing: { input: "$0.02 / M tokens", output: "$0.06 / M tokens", images: "—" },
    features: {
      inputModalities: "text, image",
      outputModalities: "text",
      quantization: "unknown",
      maxOutputTokens: "8K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: false,
      caching: false,
    },
  },
  "kwaipilot-kat-coder": {
    name: "KAT-Coder",
    author: "kwaipilot",
    modelId: "kwaipilot/kat-coder",
    contextLength: "32K",
    reasoning: true,
    providers: 1,
    description:
      "Kwaipilot's code-specialized model with strong reasoning and code generation capabilities.",
    activity: [3, 5, 8, 10, 12, 15, 18, 22, 25, 28, 30, 32],
    tokenStats: [
      { label: "Prompt", value: "850M", color: "bg-primary" },
      { label: "Completion", value: "120M", color: "bg-tertiary" },
      { label: "Reasoning", value: "95M", color: "bg-yellow-500" },
    ],
    provider: "Kwaipilot",
    latency: "1.80s",
    throughput: "40.0 tok/s",
    pricing: { input: "$0.15 / M tokens", output: "$0.45 / M tokens", images: "—" },
    features: {
      inputModalities: "text",
      outputModalities: "text",
      quantization: "unknown",
      maxOutputTokens: "8K",
      streamCancellation: true,
      supportsTools: true,
      noPromptTraining: false,
      caching: false,
    },
  },
};

const MODEL_KEYS = Object.keys(ALL_MODELS);

/* ─── Helpers ─── */

const CheckIcon = () => (
  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
    check_circle
  </span>
);

const XIcon = () => (
  <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">cancel</span>
);

/* ─── Mini Activity Bar Chart (SVG) ─── */

function ActivityChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const barW = 14;
  const gap = 3;
  const h = 64;
  const w = data.length * (barW + gap) - gap;

  return (
    <svg width={w} height={h} className="block">
      {data.map((v, i) => {
        const barH = (v / max) * (h - 4);
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={h - barH}
            width={barW}
            height={barH}
            rx={2}
            className="fill-primary/70"
          />
        );
      })}
    </svg>
  );
}

/* ─── Model Selector Dropdown ─── */

function ModelSelector({
  selected,
  onSelect,
  exclude,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  exclude: string[];
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const available = MODEL_KEYS.filter((k) => !exclude.includes(k));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-container rounded-lg text-sm text-on-surface hover:bg-surface-container-high transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">smart_toy</span>
          <span className="font-medium">{selected ? ALL_MODELS[selected]?.name : t("compare.select_model")}</span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-lg">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-surface-container-lowest rounded-xl shadow-xl py-1.5 max-h-64 overflow-y-auto">
          {available.map((key) => (
            <button
              key={key}
              onClick={() => {
                onSelect(key);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">smart_toy</span>
              {ALL_MODELS[key].name}
              <span className="ml-auto text-xs text-on-surface-variant">{ALL_MODELS[key].author}</span>
            </button>
          ))}
          {available.length === 0 && (
            <p className="px-4 py-3 text-xs text-on-surface-variant">{t("compare.no_more_models")}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Model Card Column ─── */

function ModelCard({
  modelKey,
}: {
  modelKey: string;
}) {
  const { t } = useTranslation();
  const m = ALL_MODELS[modelKey];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 space-y-5">
      {/* Header info rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">{t("compare.label_author")}</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">smart_toy</span>
            <span className="text-sm font-semibold text-on-surface">{m.author}</span>
            <Link to={`/providers/${m.author}`} className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">{t("compare.label_context_length")}</span>
          <span className="text-sm font-bold text-on-surface">{m.contextLength}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">{t("compare.label_reasoning")}</span>
          {m.reasoning ? <CheckIcon /> : <XIcon />}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-on-surface-variant">{t("compare.label_providers")}</span>
          <span className="text-sm font-bold text-on-surface">{m.providers}</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className={`text-xs text-on-surface-variant leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
          {m.description}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary font-medium mt-1"
        >
          {expanded ? t("compare.show_less") : t("compare.show_more")}
        </button>
      </div>

      <div className="border-t border-outline-variant/10" />

      {/* Activity */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-3">{t("compare.label_activity")}</h4>
        <ActivityChart data={m.activity} />
        <div className="mt-3 space-y-1.5">
          {m.tokenStats.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-on-surface font-medium">{s.label}</span>
              </div>
              <span className="font-bold text-on-surface">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/10" />

      {/* Provider info */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-on-surface">{t("compare.label_provider")}</span>
          <span className="px-3 py-1 bg-surface-container rounded-lg text-xs font-medium text-on-surface">
            {m.provider}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">{t("compare.label_latency_p50")}</span>
            <span className="font-bold text-on-surface">{m.latency}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">{t("compare.label_throughput_p50")}</span>
            <span className="font-bold text-on-surface">{m.throughput}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/10" />

      {/* Pricing */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-2">{t("compare.label_pricing")}</h4>
        <div className="space-y-1.5">
          {(
            [
              [t("compare.label_input"), m.pricing.input],
              [t("compare.label_output"), m.pricing.output],
              [t("compare.label_images"), m.pricing.images],
            ] as const
          ).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">{label}</span>
              <span className="font-bold text-on-surface">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/10" />

      {/* Features */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-2">{t("compare.label_features")}</h4>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">{t("compare.label_input_modalities")}</span>
            <span className="font-bold text-on-surface">{m.features.inputModalities}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">{t("compare.label_output_modalities")}</span>
            <span className="font-bold text-on-surface">{m.features.outputModalities}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">{t("compare.label_quantization")}</span>
            <span className="font-bold text-on-surface">{m.features.quantization}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">{t("compare.label_max_output_tokens")}</span>
            <span className="font-bold text-on-surface">{m.features.maxOutputTokens}</span>
          </div>
          {(
            [
              [t("compare.label_stream_cancellation"), m.features.streamCancellation],
              [t("compare.label_supports_tools"), m.features.supportsTools],
              [t("compare.label_no_prompt_training"), m.features.noPromptTraining],
              [t("compare.label_caching"), m.features.caching],
            ] as const
          ).map(([label, val]) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">{label}</span>
              {val ? <CheckIcon /> : <XIcon />}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-outline-variant/10" />

      {/* Go to model */}
      <Link
        to={`/models/${modelKey}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-on-surface border border-outline-variant/10 rounded-lg hover:bg-surface-container/60 transition-colors"
      >
        {t("compare.go_to_model")}
        <span className="material-symbols-outlined text-sm">open_in_new</span>
      </Link>
    </div>
  );
}

/* ─── Add Model Placeholder ─── */

function AddModelSlot({
  exclude,
  onAdd,
}: {
  exclude: string[];
  onAdd: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [picking, setPicking] = useState(false);

  if (picking) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-on-surface">{t("compare.select_a_model")}</h4>
          <button
            onClick={() => setPicking(false)}
            className="p-1 text-on-surface-variant hover:text-on-surface rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <ModelSelector
          selected={null}
          onSelect={(id) => {
            onAdd(id);
            setPicking(false);
          }}
          exclude={exclude}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPicking(true)}
      className="w-full bg-surface-container-low rounded-xl p-5 min-h-[320px] flex flex-col items-center justify-center gap-3 hover:bg-surface-container transition-colors group"
    >
      <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors">
        add
      </span>
      <span className="text-sm font-medium text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">
        {t("compare.add_model")}
      </span>
    </button>
  );
}

/* ─── Main Page ─── */

export const ComparePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialModel = searchParams.get("model") ?? "";

  const [slots, setSlots] = useState<(string | null)[]>(() => {
    const initial: (string | null)[] = [null, null, null];
    if (initialModel && ALL_MODELS[initialModel]) {
      initial[0] = initialModel;
    }
    return initial;
  });

  const usedModels = useMemo(() => slots.filter(Boolean) as string[], [slots]);

  const firstModel = slots[0] ? ALL_MODELS[slots[0]] : null;

  const handleAdd = useCallback(
    (slotIdx: number, modelKey: string) => {
      setSlots((prev) => {
        const next = [...prev];
        next[slotIdx] = modelKey;
        return next;
      });
    },
    [],
  );

  const handleChangeFirst = useCallback((modelKey: string) => {
    setSlots((prev) => {
      const next = [...prev];
      next[0] = modelKey;
      return next;
    });
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant font-label">
          <Link className="hover:text-primary transition-colors" to="/models">
            {t("compare.breadcrumb_models")}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-semibold">{t("compare.breadcrumb_compare")}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight text-on-surface mb-2">
            {t("compare.title")}
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            {firstModel
              ? t("compare.desc_with_model", { name: firstModel.name, author: firstModel.author, defaultValue: `Compare ${firstModel.name} from ${firstModel.author} with other AI models on key metrics, including price, context length, and other model features.` })
              : t("compare.desc_default", "Compare AI models side by side on key metrics, including price, context length, and model features.")}
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Slot 0: fixed if from URL, otherwise selector */}
          <div className="space-y-4">
            {slots[0] ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface-container rounded-lg text-sm text-on-surface">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg">smart_toy</span>
                  <span className="font-medium">{ALL_MODELS[slots[0]]?.name}</span>
                </div>
                <ModelCard modelKey={slots[0]} />
              </>
            ) : (
              <ModelSelector
                selected={null}
                onSelect={handleChangeFirst}
                exclude={usedModels}
              />
            )}
          </div>

          {/* Slot 1 */}
          <div>
            {slots[1] ? (
              <div className="space-y-4">
                <ModelSelector
                  selected={slots[1]}
                  onSelect={(id) => handleAdd(1, id)}
                  exclude={usedModels.filter((m) => m !== slots[1])}
                />
                <ModelCard modelKey={slots[1]}  />
              </div>
            ) : (
              <AddModelSlot exclude={usedModels} onAdd={(id) => handleAdd(1, id)} />
            )}
          </div>

          {/* Slot 2 */}
          <div>
            {slots[2] ? (
              <div className="space-y-4">
                <ModelSelector
                  selected={slots[2]}
                  onSelect={(id) => handleAdd(2, id)}
                  exclude={usedModels.filter((m) => m !== slots[2])}
                />
                <ModelCard modelKey={slots[2]}  />
              </div>
            ) : (
              <AddModelSlot exclude={usedModels} onAdd={(id) => handleAdd(2, id)} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
