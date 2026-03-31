import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface RankingsPageProps {
  readonly className?: string;
}

const STATS = [
  { label: "Tokens This Week", value: "18.7B", color: "text-primary", sub: "+8.4%", subIcon: "trending_up", subColor: "text-green-600" },
  { label: "Models Available", value: "347", color: "text-on-surface", sub: "Across all providers", subIcon: null, subColor: "text-on-surface-variant" },
  { label: "Requests/Day", value: "4.2M", color: "text-on-surface", sub: "+12.1%", subIcon: "trending_up", subColor: "text-green-600" },
  { label: "Providers", value: "54", color: "text-on-surface", sub: "Global infrastructure", subIcon: null, subColor: "text-on-surface-variant" },
];

const TRENDING_MODELS = [
  { rank: "#1", name: "GPT-4o", provider: "OpenAI", width: "100%", opacity: "", tokens: "4.8B", change: "+12.3%", changeColor: "text-green-600", rankColor: "text-primary" },
  { rank: "#2", name: "Claude Sonnet 4", provider: "Anthropic", width: "78%", opacity: "opacity-80", tokens: "3.7B", change: "+24.1%", changeColor: "text-green-600", rankColor: "text-on-surface-variant" },
  { rank: "#3", name: "Gemini 2.5 Pro", provider: "Google", width: "62%", opacity: "opacity-70", tokens: "2.9B", change: "+18.7%", changeColor: "text-green-600", rankColor: "text-on-surface-variant" },
  { rank: "#4", name: "DeepSeek V3", provider: "DeepSeek", width: "51%", opacity: "opacity-60", tokens: "2.4B", change: "+45.2%", changeColor: "text-green-600", rankColor: "text-on-surface-variant" },
  { rank: "#5", name: "GPT-4o Mini", provider: "OpenAI", width: "43%", opacity: "opacity-50", tokens: "2.0B", change: "-5.4%", changeColor: "text-error", rankColor: "text-on-surface-variant" },
  { rank: "#6", name: "Claude Haiku 3.5", provider: "Anthropic", width: "34%", opacity: "opacity-40", tokens: "1.6B", change: "+8.9%", changeColor: "text-green-600", rankColor: "text-on-surface-variant" },
  { rank: "#7", name: "Llama 3.3 70B", provider: "Meta", width: "22%", opacity: "opacity-30", tokens: "1.0B", change: "-2.1%", changeColor: "text-error", rankColor: "text-on-surface-variant" },
  { rank: "#8", name: "Grok 3", provider: "xAI", width: "17%", opacity: "opacity-20", tokens: "0.8B", change: "+31.6%", changeColor: "text-green-600", rankColor: "text-on-surface-variant" },
];

const MARKET_SHARE = [
  { name: "OpenAI", pct: "38.2%", width: "38.2%", color: "#00A67E" },
  { name: "Anthropic", pct: "28.4%", width: "28.4%", color: "#D97757" },
  { name: "Google", pct: "15.1%", width: "15.1%", color: "#4285F4" },
  { name: "DeepSeek", pct: "8.3%", width: "8.3%", color: "#4D6BFE" },
  { name: "Meta", pct: "4.5%", width: "4.5%", color: "#0668E1" },
  { name: "Mistral", pct: "2.8%", width: "2.8%", color: "#FFD700" },
  { name: "xAI", pct: "1.6%", width: "1.6%", color: "#000000" },
  { name: "Others", pct: "1.1%", width: "1.1%", color: "#737686" },
];

const CATEGORIES = [
  { icon: "code", title: "Coding", items: [{ name: "Claude Sonnet 4", pct: "42%" }, { name: "GPT-4o", pct: "28%" }, { name: "DeepSeek V3", pct: "21%" }] },
  { icon: "forum", title: "Chat & Conversation", items: [{ name: "GPT-4o", pct: "48%" }, { name: "Claude Sonnet 4", pct: "31%" }, { name: "Gemini 2.5 Pro", pct: "12%" }] },
  { icon: "edit_note", title: "Creative Writing", items: [{ name: "Claude Sonnet 4", pct: "52%" }, { name: "GPT-4o", pct: "24%" }, { name: "Llama 3.3 70B", pct: "15%" }] },
  { icon: "analytics", title: "Data Analysis", items: [{ name: "GPT-4o", pct: "41%" }, { name: "Gemini 2.5 Pro", pct: "32%" }, { name: "DeepSeek V3", pct: "18%" }] },
  { icon: "translate", title: "Translation", items: [{ name: "GPT-4o", pct: "38%" }, { name: "Claude Sonnet 4", pct: "29%" }, { name: "Gemini 2.5 Pro", pct: "22%" }] },
  { icon: "summarize", title: "Summarization", items: [{ name: "Claude Haiku 3.5", pct: "44%" }, { name: "GPT-4o Mini", pct: "32%" }, { name: "Mistral Large", pct: "12%" }] },
];

// Top Models weekly usage data (stacked bar chart)
const MODEL_COLORS: Record<string, string> = {
  "GPT-4o": "#FF69B4",
  "Claude Sonnet 4": "#FF6B35",
  "Gemini 2.5 Pro": "#00BFA5",
  "DeepSeek V3": "#7C4DFF",
  "GPT-4o Mini": "#E91E63",
  "Claude Haiku 3.5": "#FF9800",
  "Llama 3.3 70B": "#4CAF50",
  "Grok 3": "#2196F3",
  "Mistral Large": "#F44336",
  "Qwen 2.5": "#009688",
  "Others": "#9E9E9E",
};

function generateWeeklyData() {
  const models = Object.keys(MODEL_COLORS);
  const weeks: { date: string; segments: { model: string; value: number }[] }[] = [];
  const startDate = new Date(2025, 3, 7); // Apr 7 2025

  for (let w = 0; w < 52; w++) {
    const d = new Date(startDate.getTime() + w * 7 * 86_400_000);
    const label = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    // Exponential growth curve
    const growth = Math.pow(1.065, w);
    const segments = models.map((model, i) => ({
      model,
      value: Math.round((0.15 + Math.random() * 0.35) * growth * (i < 3 ? 1.5 : 0.6) * 500),
    }));
    weeks.push({ date: label, segments });
  }
  return weeks;
}

const WEEKLY_DATA = generateWeeklyData();
const MAX_WEEKLY_TOTAL = Math.max(...WEEKLY_DATA.map((w) => w.segments.reduce((s, seg) => s + seg.value, 0)));

const NAT_LANGUAGES = ["English", "Chinese", "Spanish", "French"];
const PROG_LANGUAGES = ["Python", "TypeScript", "Rust", "Java"];

const NAT_LANG_DATA = [
  { name: "GPT-4o", tokens: "3.2B tokens" },
  { name: "Claude Sonnet 4", tokens: "2.6B tokens" },
  { name: "Gemini 2.5 Pro", tokens: "1.9B tokens" },
  { name: "GPT-4o Mini", tokens: "1.3B tokens" },
  { name: "Llama 3.3 70B", tokens: "0.8B tokens" },
];

const PROG_LANG_DATA = [
  { name: "Claude Sonnet 4", tokens: "1.8B tokens" },
  { name: "GPT-4o", tokens: "1.5B tokens" },
  { name: "DeepSeek V3", tokens: "1.1B tokens" },
  { name: "Gemini 2.5 Pro", tokens: "0.7B tokens" },
  { name: "Qwen 2.5 Coder 32B", tokens: "0.4B tokens" },
];


// Market Share - 100% stacked bar chart by provider
const PROVIDER_COLORS: Record<string, string> = {
  google: "#4285F4",
  openai: "#FF6B35",
  "x-ai": "#7C4DFF",
  anthropic: "#00BFA5",
  meta: "#E91E63",
  qwen: "#FF69B4",
  mistralai: "#42A5F5",
  "z-ai": "#689F38",
  deepseek: "#FF9800",
  others: "#9E9E9E",
};

const PROVIDER_RANKINGS = [
  { rank: 1, name: "google", tokens: "1.32T", pct: "22.8%" },
  { rank: 2, name: "openai", tokens: "940B", pct: "16.2%" },
  { rank: 3, name: "x-ai", tokens: "864B", pct: "14.9%" },
  { rank: 4, name: "anthropic", tokens: "580B", pct: "10.0%" },
  { rank: 5, name: "meta", tokens: "412B", pct: "7.1%" },
  { rank: 6, name: "qwen", tokens: "264B", pct: "4.6%" },
  { rank: 7, name: "mistralai", tokens: "247B", pct: "4.3%" },
  { rank: 8, name: "z-ai", tokens: "136B", pct: "2.3%" },
];

function generateMarketShareData() {
  const providers = Object.keys(PROVIDER_COLORS);
  const weeks: { date: string; shares: { provider: string; share: number }[] }[] = [];
  const startDate = new Date(2025, 2, 30);

  // Base shares that shift over time
  const baseShares: Record<string, number> = {
    google: 15, openai: 25, "x-ai": 5, anthropic: 18,
    meta: 12, qwen: 3, mistralai: 6, "z-ai": 1, deepseek: 8, others: 7,
  };

  for (let w = 0; w < 52; w++) {
    const d = new Date(startDate.getTime() + w * 7 * 86_400_000);
    const label = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;

    // Simulate market shifts
    const shares = providers.map((p) => {
      let base = baseShares[p];
      if (p === "google") base += w * 0.15;
      if (p === "x-ai") base += w * 0.2;
      if (p === "openai") base -= w * 0.12;
      if (p === "anthropic") base -= w * 0.05;
      if (p === "meta") base -= w * 0.04;
      return { provider: p, share: Math.max(1, base + (Math.random() - 0.5) * 3) };
    });

    // Normalize to 100%
    const total = shares.reduce((s, x) => s + x.share, 0);
    shares.forEach((s) => { s.share = (s.share / total) * 100; });

    weeks.push({ date: label, shares });
  }
  return weeks;
}

const MARKET_SHARE_WEEKLY = generateMarketShareData();

export const RankingsPage: React.FC<RankingsPageProps> = ({ className = "" }) => {
  const [activeNatLang, setActiveNatLang] = useState(0);
  const [activeProgLang, setActiveProgLang] = useState(0);

  return (
    <div className={`text-on-background ${className}`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16 pt-28">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/20 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Live usage metrics
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-on-background">
            AI Model Rankings
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-body leading-relaxed">
            Based on real usage data from millions of API requests through NexusAI.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-surface-container-low p-8 rounded-xl space-y-2">
              <span className="text-on-surface-variant text-sm font-medium tracking-wide uppercase">
                {stat.label}
              </span>
              <div className={`text-4xl font-headline font-bold ${stat.color}`}>{stat.value}</div>
              <div className={`flex items-center text-xs ${stat.subColor} font-bold`}>
                {stat.subIcon && (
                  <span className="material-symbols-outlined text-sm">{stat.subIcon}</span>
                )}{" "}
                {stat.sub}
              </div>
            </div>
          ))}
        </section>

        {/* Top Models Stacked Bar Chart */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-on-surface-variant"
              style={{ fontVariationSettings: "'wght' 300, 'opsz' 24" }}
            >
              bar_chart
            </span>
            <h2 className="text-2xl font-headline font-bold">Top Models</h2>
          </div>
          <p className="text-on-surface-variant text-sm">
            Weekly usage of models across NexusAI
          </p>

          <div className="flex mt-4">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-xs text-on-surface-variant font-medium pr-3 py-1 shrink-0 w-12 text-right">
              <span>{Math.round(MAX_WEEKLY_TOTAL / 1000)}T</span>
              <span>{Math.round((MAX_WEEKLY_TOTAL * 0.75) / 1000)}T</span>
              <span>{Math.round((MAX_WEEKLY_TOTAL * 0.5) / 1000)}T</span>
              <span>{Math.round((MAX_WEEKLY_TOTAL * 0.25) / 1000)}T</span>
              <span>0</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-outline-variant/15 w-full" />
                ))}
              </div>

              {/* Bars */}
              <div className="flex items-end gap-[2px] h-[360px] relative z-10">
                {WEEKLY_DATA.map((week) => {
                  const total = week.segments.reduce((s, seg) => s + seg.value, 0);
                  return (
                    <div
                      key={week.date}
                      className="flex-1 flex flex-col-reverse min-w-0 group relative"
                      style={{ height: "100%" }}
                    >
                      {week.segments.map((seg) => {
                        const heightPct = (seg.value / MAX_WEEKLY_TOTAL) * 100;
                        return (
                          <div
                            key={seg.model}
                            style={{
                              height: `${heightPct}%`,
                              backgroundColor: MODEL_COLORS[seg.model],
                            }}
                            className="min-h-0 transition-opacity group-hover:opacity-80"
                          />
                        );
                      })}
                      {/* Tooltip popover */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-3 w-56">
                          {/* Date badge */}
                          <div className="px-4 pb-2.5 mb-1 border-b border-slate-100">
                            <span className="inline-block text-xs font-semibold text-on-surface bg-surface-container-low px-2.5 py-1 rounded-full">
                              {week.date}
                            </span>
                          </div>
                          {/* Model breakdown - sorted by value desc */}
                          <div className="px-4 space-y-2 py-1 max-h-[280px] overflow-y-auto">
                            {[...week.segments]
                              .sort((a, b) => b.value - a.value)
                              .slice(0, 10)
                              .map((seg) => (
                                <div key={seg.model} className="flex items-center gap-2">
                                  <div
                                    className="w-1 h-5 rounded-full shrink-0"
                                    style={{ backgroundColor: MODEL_COLORS[seg.model] }}
                                  />
                                  <span className="text-sm text-on-surface truncate flex-1">{seg.model}</span>
                                </div>
                              ))}
                          </div>
                          {/* Total */}
                          <div className="px-4 pt-2.5 mt-1 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-on-surface">Total</span>
                              <span className="text-sm font-bold text-on-surface">{(total / 1000).toFixed(1)}T</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant">
                {WEEKLY_DATA.filter((_, i) => i % 8 === 0).map((week) => (
                  <span key={week.date}>{week.date}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-outline-variant/15">
            {Object.entries(MODEL_COLORS).map(([model, color]) => (
              <div key={model} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-on-surface-variant">{model}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Market Share - 100% Stacked Bar Chart */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-on-surface-variant"
              style={{ fontVariationSettings: "'wght' 300, 'opsz' 24" }}
            >
              stacked_bar_chart
            </span>
            <h2 className="text-2xl font-headline font-bold">Market Share</h2>
          </div>
          <p className="text-on-surface-variant text-sm">
            Compare NexusAI token share by model author
          </p>

          <div className="flex mt-4">
            {/* Y-axis */}
            <div className="flex flex-col justify-between text-xs text-on-surface-variant font-medium pr-3 py-1 shrink-0 w-12 text-right">
              <span>100%</span>
              <span>60%</span>
              <span>30%</span>
              <span>0%</span>
            </div>

            {/* Chart */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-t border-outline-variant/15 w-full" />
                ))}
              </div>

              {/* Bars - each bar fills 100% height, segments are proportional */}
              <div className="flex gap-[1px] h-[360px] relative z-10">
                {MARKET_SHARE_WEEKLY.map((week) => (
                  <div
                    key={week.date}
                    className="flex-1 flex flex-col min-w-0 group relative"
                  >
                    {week.shares.map((s) => (
                      <div
                        key={s.provider}
                        style={{
                          height: `${s.share}%`,
                          backgroundColor: PROVIDER_COLORS[s.provider],
                        }}
                        className="min-h-0 transition-opacity group-hover:opacity-80"
                      />
                    ))}
                    {/* Tooltip */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                      <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-3 w-52">
                        <div className="px-4 pb-2.5 mb-1 border-b border-slate-100">
                          <span className="inline-block text-xs font-semibold text-on-surface bg-surface-container-low px-2.5 py-1 rounded-full">
                            {week.date}
                          </span>
                        </div>
                        <div className="px-4 space-y-2 py-1">
                          {[...week.shares]
                            .sort((a, b) => b.share - a.share)
                            .slice(0, 8)
                            .map((s) => (
                              <div key={s.provider} className="flex items-center gap-2">
                                <div
                                  className="w-1 h-5 rounded-full shrink-0"
                                  style={{ backgroundColor: PROVIDER_COLORS[s.provider] }}
                                />
                                <span className="text-sm text-on-surface flex-1">{s.provider}</span>
                                <span className="text-xs text-on-surface-variant font-medium">{s.share.toFixed(1)}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis */}
              <div className="flex justify-between mt-2 text-[10px] text-on-surface-variant">
                {MARKET_SHARE_WEEKLY.filter((_, i) => i % 8 === 0).map((week) => (
                  <span key={week.date}>{week.date}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Provider ranking legend - 2 columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-outline-variant/15">
            {PROVIDER_RANKINGS.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant w-6 text-right">{p.rank}.</span>
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: PROVIDER_COLORS[p.name] }}
                />
                <span className="text-sm font-medium text-on-surface flex-1">{p.name}</span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-on-surface">{p.tokens}</div>
                  <div className="text-xs text-on-surface-variant">{p.pct}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Models Table */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold">Trending Models</h2>
              <p className="text-on-surface-variant">
                Global volume and growth trends for the last 24 hours.
              </p>
            </div>
            <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              View Full Leaderboard{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant font-label text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Model Name</th>
                  <th className="px-6 py-4 font-semibold">Provider</th>
                  <th className="px-6 py-4 font-semibold w-1/4">Usage Share</th>
                  <th className="px-6 py-4 font-semibold">Tokens</th>
                  <th className="px-6 py-4 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {TRENDING_MODELS.map((model) => (
                  <tr key={model.rank} className="hover:bg-surface-container-low transition-colors">
                    <td className={`px-6 py-5 font-bold ${model.rankColor}`}>{model.rank}</td>
                    <td className="px-6 py-5 font-bold">{model.name}</td>
                    <td className="px-6 py-5 text-on-surface-variant">{model.provider}</td>
                    <td className="px-6 py-5">
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div
                          className={`bg-primary h-full rounded-full ${model.opacity}`}
                          style={{ width: model.width }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium">{model.tokens}</td>
                    <td className={`px-6 py-5 ${model.changeColor} font-bold text-sm`}>
                      {model.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Market Share */}
        <section className="bg-surface-container-low rounded-xl p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold">Provider Market Share</h2>
            <p className="text-on-surface-variant">
              Token volume distribution by organizational group.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-full h-12 flex rounded-lg overflow-hidden">
              {MARKET_SHARE.map((provider) => (
                <div
                  key={provider.name}
                  className="h-full transition-all"
                  style={{ width: provider.width, backgroundColor: provider.color }}
                  title={`${provider.name} ${provider.pct}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-4">
              {MARKET_SHARE.map((provider) => (
                <div key={provider.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: provider.color }}
                  />
                  <span className="text-xs font-bold">
                    {provider.name}{" "}
                    <span className="text-on-surface-variant font-normal">{provider.pct}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="space-y-8">
          <h2 className="text-3xl font-headline font-bold">Performance by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                    {cat.icon}
                  </span>
                  <h3 className="font-bold text-lg">{cat.title}</h3>
                </div>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs font-bold text-primary">{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Languages Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Natural Languages */}
          <section className="space-y-6">
            <h3 className="text-2xl font-headline font-bold">Natural Languages</h3>
            <div className="flex border-b border-outline-variant/30 gap-6">
              {NAT_LANGUAGES.map((lang, i) => (
                <button
                  key={lang}
                  className={`pb-3 ${
                    activeNatLang === i
                      ? "border-b-2 border-primary text-primary font-bold"
                      : "text-on-surface-variant hover:text-on-surface transition-colors"
                  }`}
                  onClick={() => setActiveNatLang(i)}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {NAT_LANG_DATA.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg"
                >
                  <span className="font-bold">{item.name}</span>
                  <span className="text-on-surface-variant font-medium">{item.tokens}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Programming Languages */}
          <section className="space-y-6">
            <h3 className="text-2xl font-headline font-bold">Programming Languages</h3>
            <div className="flex border-b border-outline-variant/30 gap-6">
              {PROG_LANGUAGES.map((lang, i) => (
                <button
                  key={lang}
                  className={`pb-3 ${
                    activeProgLang === i
                      ? "border-b-2 border-primary text-primary font-bold"
                      : "text-on-surface-variant hover:text-on-surface transition-colors"
                  }`}
                  onClick={() => setActiveProgLang(i)}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {PROG_LANG_DATA.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg"
                >
                  <span className="font-bold">{item.name}</span>
                  <span className="text-on-surface-variant font-medium">{item.tokens}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>

      <Footer />
    </div>
  );
};
