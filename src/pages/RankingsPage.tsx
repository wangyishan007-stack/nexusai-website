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

const CONTEXT_DIST = [
  { label: "<1K Tokens", pct: "32%" },
  { label: "1K - 4K", pct: "41%" },
  { label: "4K - 16K", pct: "18%" },
  { label: "16K - 64K", pct: "7%" },
  { label: ">64K Tokens", pct: "2%" },
];

const TOOL_CALLS = [
  { rank: 1, name: "GPT-4o", pct: "45%" },
  { rank: 2, name: "Claude Sonnet 4", pct: "38%" },
  { rank: 3, name: "Gemini 2.5 Pro", pct: "12%" },
  { rank: 4, name: "Mistral Large", pct: "5%" },
];

const IMAGE_PROCESSING = [
  { rank: 1, name: "GPT-4o", pct: "51%" },
  { rank: 2, name: "Gemini 2.5 Pro", pct: "24%" },
  { rank: 3, name: "Claude Sonnet 4", pct: "19%" },
  { rank: 4, name: "Claude Haiku 3.5", pct: "6%" },
];

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

        {/* Context Length Distribution */}
        <section className="space-y-8">
          <h2 className="text-2xl font-headline font-bold">Context Length Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CONTEXT_DIST.map((item) => (
              <div key={item.label} className="bg-surface-container-low p-6 rounded-xl space-y-4">
                <div className="text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  {item.label}
                </div>
                <div className="text-2xl font-headline font-bold">{item.pct}</div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Calls & Images */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl font-headline font-bold">Tool/Function Calls</h3>
                <p className="text-on-surface-variant text-sm font-medium">
                  1.2M automated actions / day
                </p>
              </div>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                integration_instructions
              </span>
            </div>
            <div className="space-y-4">
              {TOOL_CALLS.map((item) => (
                <div key={item.rank} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs">
                    {item.rank}
                  </div>
                  <div className="flex-grow font-medium">{item.name}</div>
                  <div className="text-primary font-bold">{item.pct}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xl font-headline font-bold">Image Processing</h3>
                <p className="text-on-surface-variant text-sm font-medium">
                  680K visual inputs / day
                </p>
              </div>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                image
              </span>
            </div>
            <div className="space-y-4">
              {IMAGE_PROCESSING.map((item) => (
                <div key={item.rank} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs">
                    {item.rank}
                  </div>
                  <div className="flex-grow font-medium">{item.name}</div>
                  <div className="text-primary font-bold">{item.pct}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
