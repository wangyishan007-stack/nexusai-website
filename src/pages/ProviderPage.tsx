import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

/* ─── Types ─── */

interface ProviderModel {
  slug: string;
  name: string;
  tags: string;
  context: string;
  input: string;
  output: string;
  tokens: string;
}

interface ProviderInfo {
  displayName: string;
  description: string;
  modelCount: number;
  totalTokens: string;
  initial: string;
  bgColor: string;
  textColor: string;
  activity: { prompt: number; completion: number; other: number }[];
  models: ProviderModel[];
}

/* ─── 30-day activity data generator ─── */

function genProviderActivity(peak: number, tail: number, spike?: number): { prompt: number; completion: number; other: number }[] {
  const days: { prompt: number; completion: number; other: number }[] = [];
  for (let i = 0; i < 30; i++) {
    let base: number;
    if (i < 5) base = peak * (0.7 + Math.sin(i * 0.8) * 0.3);
    else if (i < 10) base = peak * 0.5 * (1 - (i - 5) * 0.12);
    else if (i < 25) base = tail * (0.8 + (i % 3) * 0.1);
    else base = (spike ?? tail) * (0.6 + (i - 24) * 0.15);
    base = Math.max(base, tail * 0.3);
    days.push({
      prompt: Math.round(base * 0.6),
      completion: Math.round(base * 0.3),
      other: Math.round(base * 0.1),
    });
  }
  return days;
}

/* ─── Provider Data ─── */

const PROVIDERS: Record<string, ProviderInfo> = {
  openai: {
    displayName: "OpenAI",
    description:
      "Access OpenAI models on NexusAI including GPT-4o, o1-preview, and GPT-4 Turbo. Compare pricing, context windows, and capabilities.",
    modelCount: 38,
    totalTokens: "245.8B",
    initial: "O",
    bgColor: "bg-surface-container-highest",
    textColor: "text-on-surface",
    activity: genProviderActivity(18000, 600, 3500),
    models: [
      { slug: "gpt-4o", name: "GPT-4o", tags: "Multimodal \u2022 Flagship", context: "128k", input: "$2.50", output: "$10.00", tokens: "45.8B" },
      { slug: "gpt-4o-mini", name: "GPT-4o Mini", tags: "Fast \u2022 Affordable", context: "128k", input: "$0.15", output: "$0.60", tokens: "32.1B" },
      { slug: "o1-preview", name: "o1-preview", tags: "Advanced Reasoning", context: "128k", input: "$15.00", output: "$60.00", tokens: "8.2B" },
      { slug: "o1-mini", name: "o1-mini", tags: "Reasoning \u2022 Fast", context: "128k", input: "$3.00", output: "$12.00", tokens: "5.6B" },
      { slug: "gpt-4-turbo", name: "GPT-4 Turbo", tags: "Vision \u2022 128k", context: "128k", input: "$10.00", output: "$30.00", tokens: "12.4B" },
      { slug: "gpt-3-5-turbo", name: "GPT-3.5 Turbo", tags: "Legacy \u2022 Fast", context: "16k", input: "$0.50", output: "$1.50", tokens: "89.2B" },
    ],
  },
  anthropic: {
    displayName: "Anthropic",
    description:
      "Access Anthropic models on NexusAI including Claude 3.5 Sonnet, Claude 3 Opus, and Claude 3 Haiku. Industry-leading safety and reasoning.",
    modelCount: 12,
    totalTokens: "156.3B",
    initial: "A",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    activity: genProviderActivity(14000, 400, 2000),
    models: [
      { slug: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", tags: "Reasoning \u2022 Vision", context: "200k", input: "$3.00", output: "$15.00", tokens: "38.2B" },
      { slug: "claude-3-opus", name: "Claude 3 Opus", tags: "Highest Intelligence", context: "200k", input: "$15.00", output: "$75.00", tokens: "12.8B" },
      { slug: "claude-3-haiku", name: "Claude 3 Haiku", tags: "Fastest \u2022 Cheapest", context: "200k", input: "$0.25", output: "$1.25", tokens: "65.1B" },
      { slug: "claude-3-sonnet", name: "Claude 3 Sonnet", tags: "Balanced", context: "200k", input: "$3.00", output: "$15.00", tokens: "22.4B" },
    ],
  },
  deepseek: {
    displayName: "DeepSeek",
    description:
      "Access DeepSeek models on NexusAI including DeepSeek V3 and DeepSeek Coder. Exceptional value with near-frontier performance.",
    modelCount: 8,
    totalTokens: "68.5B",
    initial: "D",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    activity: genProviderActivity(10000, 300, 1500),
    models: [
      { slug: "deepseek-v3", name: "DeepSeek V3", tags: "MoE 671B \u2022 Math", context: "164k", input: "$0.32", output: "$1.28", tokens: "22.1B" },
      { slug: "deepseek-coder-v2", name: "DeepSeek Coder V2", tags: "Code \u2022 236B MoE", context: "128k", input: "$0.14", output: "$0.28", tokens: "18.9B" },
      { slug: "deepseek-r1", name: "DeepSeek R1", tags: "Reasoning \u2022 Chain-of-Thought", context: "128k", input: "$0.55", output: "$2.19", tokens: "15.3B" },
    ],
  },
  google: {
    displayName: "Google",
    description:
      "Access Google models on NexusAI including Gemini 2.0 Flash, Gemini Pro, and PaLM 2. Blazing-fast inference with massive context windows.",
    modelCount: 24,
    totalTokens: "198.2B",
    initial: "G",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    activity: genProviderActivity(16000, 500, 2500),
    models: [
      { slug: "gemini-2-0-flash", name: "Gemini 2.0 Flash", tags: "1M Context \u2022 Fast", context: "1M", input: "$0.10", output: "$0.40", tokens: "30.5B" },
      { slug: "gemini-1-5-pro", name: "Gemini 1.5 Pro", tags: "Multimodal \u2022 2M", context: "2M", input: "$1.25", output: "$5.00", tokens: "28.8B" },
      { slug: "gemini-1-5-flash", name: "Gemini 1.5 Flash", tags: "Fast \u2022 Affordable", context: "1M", input: "$0.075", output: "$0.30", tokens: "45.2B" },
    ],
  },
  meta: {
    displayName: "Meta",
    description:
      "Access Meta's open-weight Llama models on NexusAI. Community-driven innovation with leading open-source performance.",
    modelCount: 18,
    totalTokens: "112.7B",
    initial: "M",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    activity: genProviderActivity(12000, 350, 1800),
    models: [
      { slug: "llama-3-1-405b", name: "Llama 3.1 405B", tags: "Largest Open \u2022 405B", context: "128k", input: "$3.00", output: "$3.00", tokens: "18.9B" },
      { slug: "llama-3-1-70b", name: "Llama 3.1 70B", tags: "Balanced \u2022 70B", context: "128k", input: "$0.60", output: "$0.60", tokens: "35.2B" },
      { slug: "llama-3-1-8b", name: "Llama 3.1 8B", tags: "Small \u2022 Fast", context: "128k", input: "$0.05", output: "$0.05", tokens: "42.8B" },
    ],
  },
};

/* ─── Activity Chart Component ─── */

function ActivityChart({ data }: { data: { prompt: number; completion: number; other: number }[] }) {
  const { t } = useTranslation();
  const maxVal = Math.max(...data.map((d) => d.prompt + d.completion + d.other));
  const yTicks = [maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25)];
  const fmtVal = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`);

  const today = new Date();
  const dateLabels = data.map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (data.length - 1 - i));
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        {[
          { color: "bg-blue-500", label: t("provider.legend_prompt") },
          { color: "bg-green-500", label: t("provider.legend_completion") },
          { color: "bg-amber-400", label: t("provider.legend_other") },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
            <span className="text-[11px] font-medium text-on-surface-variant">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex gap-2">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-48 text-right pr-1 shrink-0 w-10">
          {yTicks.map((v) => (
            <span key={v} className="text-[10px] text-on-surface-variant font-medium leading-none">{fmtVal(v)}</span>
          ))}
          <span className="text-[10px] text-on-surface-variant font-medium leading-none">0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-end gap-px h-48 border-l border-b border-outline-variant/20">
            {data.map((d, i) => {
              const total = d.prompt + d.completion + d.other;
              const hPct = maxVal > 0 ? (total / maxVal) * 100 : 0;
              const pPct = total > 0 ? (d.prompt / total) * 100 : 0;
              const cPct = total > 0 ? (d.completion / total) * 100 : 0;
              const oPct = total > 0 ? (d.other / total) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                  <div className="w-full flex flex-col" style={{ height: `${hPct}%` }}>
                    <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${pPct}%`, minHeight: total > 0 ? 1 : 0 }} />
                    <div className="w-full bg-green-500" style={{ height: `${cPct}%`, minHeight: total > 0 ? 1 : 0 }} />
                    <div className="w-full bg-amber-400 rounded-b-sm" style={{ height: `${oPct}%`, minHeight: total > 0 ? 1 : 0 }} />
                  </div>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {fmtVal(total)}
                  </div>
                </div>
              );
            })}
          </div>
          {/* X-axis */}
          <div className="flex mt-1.5">
            {dateLabels.map((label, i) => (
              <span key={i} className={`flex-1 text-center text-[9px] text-on-surface-variant ${i % 7 === 0 ? "opacity-100" : "opacity-0"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export const ProviderPage: React.FC = () => {
  const { t } = useTranslation();
  const { providerId } = useParams<{ providerId: string }>();
  const provider = providerId ? PROVIDERS[providerId] : undefined;

  const sortedModels = useMemo(() => {
    if (!provider) return [];
    return [...provider.models].sort((a, b) => {
      const parseTokens = (t: string) => {
        const num = parseFloat(t);
        return t.endsWith("B") ? num * 1000 : num;
      };
      return parseTokens(b.tokens) - parseTokens(a.tokens);
    });
  }, [provider]);

  // Compute pricing stats
  const pricingStats = useMemo(() => {
    if (!provider) return { minInput: "$0", maxInput: "$0", minOutput: "$0", maxOutput: "$0", avgInput: "$0", avgOutput: "$0" };
    const inputs = provider.models.map((m) => parseFloat(m.input.replace("$", "")));
    const outputs = provider.models.map((m) => parseFloat(m.output.replace("$", "")));
    const fmt = (v: number) => `$${v.toFixed(2)}`;
    return {
      minInput: fmt(Math.min(...inputs)),
      maxInput: fmt(Math.max(...inputs)),
      minOutput: fmt(Math.min(...outputs)),
      maxOutput: fmt(Math.max(...outputs)),
      avgInput: fmt(inputs.reduce((a, b) => a + b, 0) / inputs.length),
      avgOutput: fmt(outputs.reduce((a, b) => a + b, 0) / outputs.length),
    };
  }, [provider]);

  if (!provider) {
    return (
      <div className="bg-background text-on-background min-h-screen">
        <Navbar />
        <main className="pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold font-headline mb-4">{t("provider.not_found")}</h1>
          <Link to="/models" className="text-primary font-medium hover:underline">
            {t("provider.back_to_models")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant font-label">
          <Link className="hover:text-primary transition-colors" to="/models">{t("provider.breadcrumb_models")}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-semibold">{provider.displayName}</span>
        </nav>

        {/* ── Header ── */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl ${provider.bgColor} flex items-center justify-center text-lg font-bold ${provider.textColor}`}>
            {provider.initial}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight text-on-surface">{provider.displayName}</h1>
            <span className="text-xs text-on-surface-variant">{t("provider.models_on_nexusai", { count: provider.modelCount })}</span>
          </div>
        </div>

        {/* ── Description ── */}
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl mb-8">
          {provider.description}
        </p>

        {/* ── Stats Metrics Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0.5 bg-outline-variant/20 rounded-xl overflow-hidden mb-12 border border-outline-variant/10">
          {[
            { label: t("provider.stat_models"), value: `${provider.modelCount}`, highlight: false },
            { label: t("provider.stat_total_tokens"), value: provider.totalTokens, highlight: true },
            { label: t("provider.stat_avg_input"), value: pricingStats.avgInput, highlight: true },
            { label: t("provider.stat_avg_output"), value: pricingStats.avgOutput, highlight: true },
          ].map((stat, i) => (
            <div key={stat.label} className={`bg-surface-container-lowest p-5 flex flex-col gap-1 ${i > 0 ? "border-l border-outline-variant/10" : ""}`}>
              <span className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-semibold">{stat.label}</span>
              <span className={`text-lg font-bold font-headline ${stat.highlight ? "text-primary" : ""}`}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* ── Activity Chart (full width) ── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-headline mb-1">{t("provider.section_activity")}</h2>
          <p className="text-sm text-on-surface-variant mb-5">{t("provider.activity_desc", { provider: provider.displayName })}</p>
          <div className="bg-surface-container-lowest rounded-xl p-6">
            <ActivityChart data={provider.activity} />
          </div>
        </section>

        {/* ── Pricing Overview ── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-headline mb-1">{t("provider.section_pricing")}</h2>
          <p className="text-sm text-on-surface-variant mb-5">{t("provider.pricing_desc", { provider: provider.displayName })}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-6">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-3">{t("provider.input_price_range")}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline text-primary">{pricingStats.minInput}</span>
                <span className="text-on-surface-variant text-sm">—</span>
                <span className="text-2xl font-extrabold font-headline text-primary">{pricingStats.maxInput}</span>
              </div>
              <div className="text-xs text-on-surface-variant mt-1">{t("provider.per_1m_tokens")}</div>
              {/* Price bars per model */}
              <div className="mt-4 space-y-2">
                {sortedModels.map((model) => {
                  const price = parseFloat(model.input.replace("$", ""));
                  const max = parseFloat(pricingStats.maxInput.replace("$", ""));
                  return (
                    <div key={model.slug} className="flex items-center gap-2">
                      <span className="text-[10px] text-on-surface-variant w-28 truncate shrink-0">{model.name}</span>
                      <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${max > 0 ? (price / max) * 100 : 0}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-primary w-12 text-right">{model.input}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-3">{t("provider.output_price_range")}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-headline text-primary">{pricingStats.minOutput}</span>
                <span className="text-on-surface-variant text-sm">—</span>
                <span className="text-2xl font-extrabold font-headline text-primary">{pricingStats.maxOutput}</span>
              </div>
              <div className="text-xs text-on-surface-variant mt-1">{t("provider.per_1m_tokens")}</div>
              <div className="mt-4 space-y-2">
                {sortedModels.map((model) => {
                  const price = parseFloat(model.output.replace("$", ""));
                  const max = parseFloat(pricingStats.maxOutput.replace("$", ""));
                  return (
                    <div key={model.slug} className="flex items-center gap-2">
                      <span className="text-[10px] text-on-surface-variant w-28 truncate shrink-0">{model.name}</span>
                      <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${max > 0 ? (price / max) * 100 : 0}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-primary w-12 text-right">{model.output}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Models Table ── */}
        <section className="mb-12">
          <h2 className="text-xl font-bold font-headline mb-1">{t("provider.section_available_models")}</h2>
          <p className="text-sm text-on-surface-variant mb-5">{t("provider.models_count_desc", { count: sortedModels.length, provider: provider.displayName })}</p>

          {/* Desktop Table */}
          <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-3">{t("provider.col_model")}</th>
                  <th className="px-6 py-3">{t("provider.col_tags")}</th>
                  <th className="px-6 py-3">{t("provider.col_context")}</th>
                  <th className="px-6 py-3">{t("provider.col_input_1m")}</th>
                  <th className="px-6 py-3">{t("provider.col_output_1m")}</th>
                  <th className="px-6 py-3">{t("provider.col_tokens_processed")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {sortedModels.map((model) => (
                  <tr key={model.slug} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/models/${model.slug}`} className="font-semibold text-on-surface hover:text-primary transition-colors">
                        {model.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{model.tags}</td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{model.context}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">{model.input}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">{model.output}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{model.tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {sortedModels.map((model) => (
              <Link
                key={model.slug}
                to={`/models/${model.slug}`}
                className="block bg-surface-container-lowest rounded-xl p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-on-surface">{model.name}</span>
                  <span className="text-xs text-on-surface-variant">{model.context}</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-3">{model.tags}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span><span className="text-on-surface-variant">Input: </span><span className="font-bold text-primary">{model.input}</span></span>
                  <span><span className="text-on-surface-variant">Output: </span><span className="font-bold text-primary">{model.output}</span></span>
                  <span className="ml-auto text-on-surface-variant">{model.tokens}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Quick Links ── */}
        <section>
          <h2 className="text-xl font-bold font-headline mb-5">{t("provider.explore_provider", { provider: provider.displayName })}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/docs" className="bg-surface-container-lowest rounded-xl p-5 hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-primary mb-3 block group-hover:scale-110 transition-transform">description</span>
              <h4 className="font-bold text-on-surface text-sm mb-1">{t("provider.link_api_docs")}</h4>
              <p className="text-xs text-on-surface-variant">{t("provider.link_api_docs_desc", { provider: provider.displayName })}</p>
            </Link>
            <Link to="/chat" className="bg-surface-container-lowest rounded-xl p-5 hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-primary mb-3 block group-hover:scale-110 transition-transform">chat</span>
              <h4 className="font-bold text-on-surface text-sm mb-1">{t("provider.link_try_chat")}</h4>
              <p className="text-xs text-on-surface-variant">{t("provider.link_try_chat_desc", { provider: provider.displayName })}</p>
            </Link>
            <Link to="/rankings" className="bg-surface-container-lowest rounded-xl p-5 hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-primary mb-3 block group-hover:scale-110 transition-transform">leaderboard</span>
              <h4 className="font-bold text-on-surface text-sm mb-1">{t("provider.link_rankings")}</h4>
              <p className="text-xs text-on-surface-variant">{t("provider.link_rankings_desc", { provider: provider.displayName })}</p>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
