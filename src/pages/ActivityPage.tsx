import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";

interface ActivityPageProps {
  readonly className?: string;
}

const FILTER_MODELS = ["All", "Mistral 7B Instruct", "GPT-4 Turbo", "GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"];
const FILTER_PROVIDERS = ["All", "Mistral", "OpenAI", "Anthropic", "Google"];
const TIME_RANGES = ["24 Hours", "7 Days", "1 Month", "3 Months"];
const GROUP_BY = ["By Model", "By API Key", "By Project"];

const USAGE_CARDS = [
  {
    label: "Spend",
    value: "$0.000046",
    bars: [40, 60, 30, 80, 100],
    detailLabel: "Mistral 7B Instruct v0.1",
    detailValue: "$0.000046",
  },
  {
    label: "Requests",
    value: "4",
    bars: [20, 40, 50, 20, 90],
    detailLabel: "Mistral 7B Instruct v0.1",
    detailValue: "4",
  },
  {
    label: "Tokens",
    value: "284",
    bars: [70, 30, 45, 15, 60],
    detailLabel: "Mistral 7B Instruct v0.1",
    detailValue: "284",
  },
];

const CHART_BARS = [
  { label: "Oct 24", height: "h-12", active: false },
  { label: "Oct 25", height: "h-16", active: false },
  { label: "Oct 26", height: "h-48", active: true },
  { label: "Oct 27", height: "h-4", active: false },
  { label: "Oct 28", height: "h-4", active: false },
  { label: "Oct 29", height: "h-4", active: false },
];

export default function ActivityPage({ className }: ActivityPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterModel, setFilterModel] = useState("All");
  const [filterProvider, setFilterProvider] = useState("All");
  const [timeRange, setTimeRange] = useState("1 Month");
  const [groupBy, setGroupBy] = useState("By Model");
  const filtersRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = filterModel !== "All" || filterProvider !== "All";

  useEffect(() => {
    if (!showFilters) return;
    const handler = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFilters]);

  return (
    <SettingsLayout activeTab="activity" className={className}>
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">Activity</h2>
            <p className="text-on-surface-variant text-sm">
              Monitor your model usage, token consumption, and financial spend.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Filters button + dropdown */}
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  showFilters
                    ? "bg-primary/8 text-primary border-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant/20"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>filter_list</span>
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg z-30 p-4 space-y-3">
                  {/* Models */}
                  <div className="relative">
                    <select
                      value={filterModel}
                      onChange={(e) => setFilterModel(e.target.value)}
                      className="w-full appearance-none px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer pr-8"
                    >
                      {FILTER_MODELS.map((m) => (
                        <option key={m} value={m}>{m === "All" ? "Models" : m}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>unfold_more</span>
                  </div>
                  {/* Providers */}
                  <div className="relative">
                    <select
                      value={filterProvider}
                      onChange={(e) => setFilterProvider(e.target.value)}
                      className="w-full appearance-none px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer pr-8"
                    >
                      {FILTER_PROVIDERS.map((p) => (
                        <option key={p} value={p}>{p === "All" ? "Providers" : p}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>unfold_more</span>
                  </div>
                  {/* API Keys */}
                  <div className="relative">
                    <select
                      className="w-full appearance-none px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer pr-8"
                      defaultValue="All"
                    >
                      <option value="All">API Keys</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>unfold_more</span>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
            {/* Time Range */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:text-on-surface pl-3 pr-8 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
              >
                {TIME_RANGES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 16 }}>
                expand_more
              </span>
            </div>
            {/* Group By */}
            <div className="relative">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:text-on-surface pl-3 pr-8 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
              >
                {GROUP_BY.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 16 }}>
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="mb-8 bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <p className="text-sm text-on-surface">
            Logs have moved. Your API request logs now have their own{" "}
            <a className="text-primary font-semibold hover:underline" href="/settings/logs">
              dedicated page
            </a>
            .
          </p>
        </div>

        {/* Usage Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {USAGE_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 flex flex-col justify-between min-h-[160px] sm:min-h-[180px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    {card.label}
                  </p>
                  <div className="flex items-end gap-[2px] h-8">
                    {card.bars.map((height, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full ${i === card.bars.length - 1 ? "bg-primary" : "bg-primary/20"}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">{card.value}</h3>
              </div>
              <div className="pt-4 border-t border-outline-variant/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">{card.detailLabel}</span>
                  <span className="font-medium text-on-surface">{card.detailValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bento-style Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Usage Over Time */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
              <h4 className="font-headline font-bold text-lg">Usage distribution</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Mistral 7B
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-surface-container-highest" />
                  GPT-4o
                </div>
              </div>
            </div>
            <div className="h-48 sm:h-64 flex items-end justify-between gap-3 sm:gap-4 px-2">
              {CHART_BARS.map((bar) => (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col gap-1 items-center group cursor-pointer"
                >
                  <div
                    className={`w-full rounded-t-sm ${bar.height} transition-all ${
                      bar.active
                        ? "bg-primary relative"
                        : bar.height === "h-4"
                          ? "bg-surface-container"
                          : "bg-primary/20 group-hover:bg-primary/30"
                    }`}
                  >
                    {bar.active && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        $0.000046 (Current)
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel: Recent Activity Details */}
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-8 flex flex-col">
            <h4 className="font-headline font-bold text-lg mb-6">Recent Models</h4>
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Mistral 7B Instruct</p>
                  <p className="text-[11px] text-on-surface-variant">v0.1 -- Active</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">4 reqs</p>
                  <p className="text-[10px] text-on-surface-variant">80% of total</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group opacity-50">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">GPT-4 Turbo</p>
                  <p className="text-[11px] text-on-surface-variant">0314 -- Idle</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">0 reqs</p>
                  <p className="text-[10px] text-on-surface-variant">--</p>
                </div>
              </div>
            </div>
            <a href="/settings/logs" className="block w-full mt-8 py-3 bg-surface-container text-primary text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors text-center">
              View detailed metrics
            </a>
          </div>
        </div>

      </div>
    </SettingsLayout>
  );
}
