import { useState, useCallback, useRef, useEffect } from "react";
import SettingsLayout from "../components/SettingsLayout";

const TABS = ["Generations", "Jobs", "Sessions"] as const;

interface LogEntry {
  id: string;
  time: string;
  provider: string;
  model: string;
  app: string;
  tokensIn: number;
  tokensOut: number;
  cost: string;
  speed: string;
  finish: "stop" | "error";
  latency: string;
  prompt: string;
  completion: string;
}

/* ---------- Filter Select (inside floating panel) ---------- */
function FilterSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer pr-8"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "All" ? label : o}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>
        unfold_more
      </span>
    </div>
  );
}

/* ---------- Report Feedback Modal ---------- */
function ReportFeedbackModal({ onClose }: { onClose: () => void }) {
  const [genId, setGenId] = useState("");
  const [category, setCategory] = useState(REPORT_CATEGORIES[0]);
  const [comment, setComment] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!catOpen) return;
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [catOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-on-surface">Report Feedback</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Generation ID */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Generation ID</label>
            <input
              type="text"
              value={genId}
              onChange={(e) => setGenId(e.target.value)}
              placeholder="gen-xxxxxxxx"
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Category</label>
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span>{category}</span>
                <span
                  className="material-symbols-outlined text-on-surface-variant transition-transform"
                  style={{ fontSize: 16, transform: catOpen ? "rotate(180deg)" : undefined }}
                >
                  expand_more
                </span>
              </button>
              {catOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-30 py-1">
                  {REPORT_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setCatOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                        category === c ? "text-primary bg-primary/5" : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 1000))}
              placeholder="Describe the issue..."
              rows={4}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
            <p className="text-xs text-on-surface-variant text-right">{comment.length}/1000</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button className="px-5 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

const LOG_ENTRIES: LogEntry[] = [
  { id: "gen-a1b2", time: "Mar 31, 02:57", provider: "Anthropic", model: "Claude 3.5 Sonnet", app: "NexusAI: Gateway", tokensIn: 182, tokensOut: 1660, cost: "$ 0.02760", speed: "42.1 tps", finish: "stop", latency: "1.24s", prompt: "You are a helpful AI assistant. Summarize the following article about climate change impacts on agriculture...", completion: "Based on the article, climate change is significantly affecting agricultural productivity worldwide through several key mechanisms:\n\n1. **Rising temperatures** are shifting growing seasons and reducing crop yields in tropical regions...\n2. **Changing precipitation patterns** are causing both droughts and flooding events..." },
  { id: "gen-c3d4", time: "Mar 31, 02:55", provider: "OpenAI", model: "GPT-4o", app: "NexusAI: Gateway", tokensIn: 304, tokensOut: 2800, cost: "$ 0.04650", speed: "35.8 tps", finish: "stop", latency: "2.18s", prompt: "Analyze this JSON data and generate a summary report...", completion: "## Data Analysis Report\n\nThe dataset contains 1,247 records spanning Q1 2026..." },
  { id: "gen-e5f6", time: "Mar 31, 02:41", provider: "OpenAI", model: "Text Embedding 3 Large", app: "NexusAI: Gateway", tokensIn: 256, tokensOut: 0, cost: "$ 0.00010", speed: "—", finish: "stop", latency: "0.08s", prompt: "Generate embeddings for: 'machine learning applications in healthcare'", completion: "[1536-dimensional vector]" },
  { id: "gen-g7h8", time: "Mar 31, 02:33", provider: "Mistral", model: "Mistral 7B Instruct", app: "NexusAI: Gateway", tokensIn: 128, tokensOut: 384, cost: "$ 0.00020", speed: "18.2 tps", finish: "stop", latency: "0.52s", prompt: "Translate to French: 'The weather is beautiful today'", completion: "Le temps est magnifique aujourd'hui." },
  { id: "gen-i9j0", time: "Mar 31, 02:20", provider: "Anthropic", model: "Claude 3.5 Sonnet", app: "NexusAI: Gateway", tokensIn: 0, tokensOut: 0, cost: "$ 0.00000", speed: "—", finish: "error", latency: "0.00s", prompt: "—", completion: "Error: Rate limit exceeded (429). Retry after 30 seconds." },
  { id: "gen-k1l2", time: "Mar 31, 02:19", provider: "OpenAI", model: "DALL-E 3", app: "NexusAI: Gateway", tokensIn: 0, tokensOut: 0, cost: "$ 0.04000", speed: "—", finish: "stop", latency: "8.40s", prompt: "A futuristic cityscape at sunset with flying cars", completion: "[Image generated: 1024x1024]" },
  { id: "gen-m3n4", time: "Mar 31, 02:18", provider: "Meta", model: "Llama 3.1 405B", app: "NexusAI: Gateway", tokensIn: 480, tokensOut: 4800, cost: "$ 0.01580", speed: "19.4 tps", finish: "stop", latency: "4.12s", prompt: "Write a comprehensive technical guide for setting up a Kubernetes cluster...", completion: "# Kubernetes Cluster Setup Guide\n\n## Prerequisites\n- 3+ nodes with Ubuntu 22.04\n- 4 CPU cores, 16GB RAM minimum per node..." },
  { id: "gen-o5p6", time: "Mar 31, 02:17", provider: "OpenAI", model: "GPT-4o", app: "NexusAI: Gateway", tokensIn: 0, tokensOut: 0, cost: "$ 0.00000", speed: "—", finish: "error", latency: "0.00s", prompt: "—", completion: "Error: Invalid API key provided." },
  { id: "gen-q7r8", time: "Mar 31, 02:16", provider: "Google", model: "Gemini 1.5 Pro", app: "NexusAI: Gateway", tokensIn: 248, tokensOut: 1800, cost: "$ 0.01020", speed: "28.6 tps", finish: "stop", latency: "1.86s", prompt: "Explain quantum computing to a 10 year old...", completion: "Imagine you have a magical coin that can be both heads AND tails at the same time! That's kind of how quantum computers work..." },
  { id: "gen-s9t0", time: "Mar 31, 02:15", provider: "DeepSeek", model: "DeepSeek V3 0324", app: "NexusAI: Gateway", tokensIn: 161, tokensOut: 224, cost: "$ 0.00023", speed: "25.2 tps", finish: "stop", latency: "0.38s", prompt: "Convert this Python code to TypeScript...", completion: "```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n```" },
];

const CHART_DATA = [
  { label: "Mar 24", value: 0 },
  { label: "Mar 25", value: 0 },
  { label: "Mar 26", value: 4 },
  { label: "Mar 27", value: 0 },
  { label: "Mar 28", value: 0 },
  { label: "Mar 29", value: 0 },
  { label: "Mar 30", value: 2 },
  { label: "Mar 31", value: 10 },
];

const FILTER_MODELS = ["Claude 3.5 Sonnet", "GPT-4o", "GPT-4o mini", "Gemini 1.5 Pro", "Mistral 7B Instruct", "Llama 3.1 405B", "DeepSeek V3 0324", "DALL-E 3", "Text Embedding 3 Large"];
const FILTER_PROVIDERS = ["Anthropic", "OpenAI", "Google", "Meta", "Mistral", "DeepSeek"];
const FILTER_BILLING = ["All", "Free", "Paid"];
const FILTER_MODALITY = ["All", "Text", "Image", "Embedding"];
const REPORT_CATEGORIES = ["Incorrect response", "Slow response", "Error / timeout", "Safety issue", "Billing issue", "Other"];

function LogDetailPanel({ log, onClose }: { log: LogEntry; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-surface-container-lowest h-full overflow-y-auto shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${log.finish === "error" ? "bg-error/10 text-error" : "bg-green-100 text-green-700"}`}>
              {log.finish === "error" ? "ERROR" : "200 OK"}
            </span>
            <span className="text-sm font-medium text-on-surface">{log.model}</span>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "ID", value: log.id },
              { label: "Timestamp", value: log.time },
              { label: "Provider", value: log.provider },
              { label: "Model", value: log.model },
              { label: "Latency", value: log.latency },
              { label: "Speed", value: log.speed },
              { label: "Tokens In", value: String(log.tokensIn) },
              { label: "Tokens Out", value: String(log.tokensOut) },
              { label: "Cost", value: log.cost },
              { label: "Finish Reason", value: log.finish },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">{item.label}</p>
                <p className={`text-sm ${item.label === "Finish Reason" && item.value === "error" ? "text-error font-medium" : "text-on-surface"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <hr className="border-outline-variant/10" />

          {/* Prompt */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Prompt</p>
            <div className="bg-surface-container rounded-lg p-4 text-sm text-on-surface leading-relaxed font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {log.prompt}
            </div>
          </div>

          {/* Completion */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Completion</p>
            <div className={`bg-surface-container rounded-lg p-4 text-sm leading-relaxed font-mono whitespace-pre-wrap break-words max-h-64 overflow-y-auto ${log.finish === "error" ? "text-error" : "text-on-surface"}`}>
              {log.completion}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Generations");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Filter dropdown states
  const [filterModel, setFilterModel] = useState("All");
  const [filterProvider, setFilterProvider] = useState("All");
  const [filterBilling, setFilterBilling] = useState("All");
  const [filterModality, setFilterModality] = useState("All");
  const [filterSessionId, setFilterSessionId] = useState("");

  const hasActiveFilters = filterModel !== "All" || filterProvider !== "All" || filterBilling !== "All" || filterModality !== "All" || filterSessionId !== "";

  const _clearFilters = useCallback(() => {
    setFilterModel("All");
    setFilterProvider("All");
    setFilterBilling("All");
    setFilterModality("All");
    setFilterSessionId("");
  }, []);

  useEffect(() => {
    if (!exportOpen) return;
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportOpen]);

  useEffect(() => {
    if (!showFilters) return;
    const handler = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFilters]);

  const handleSort = useCallback((col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  }, [sortCol]);

  // Filter
  let filtered = LOG_ENTRIES;
  if (filterModel !== "All") {
    filtered = filtered.filter((l) => l.model === filterModel);
  }
  if (filterProvider !== "All") {
    filtered = filtered.filter((l) => l.provider === filterProvider);
  }

  // Sort
  if (sortCol) {
    filtered = [...filtered].sort((a, b) => {
      let va: number, vb: number;
      if (sortCol === "cost") {
        va = parseFloat(a.cost.replace(/[^0-9.]/g, ""));
        vb = parseFloat(b.cost.replace(/[^0-9.]/g, ""));
      } else if (sortCol === "tokens") {
        va = a.tokensIn + a.tokensOut;
        vb = b.tokensIn + b.tokensOut;
      } else {
        return 0;
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });
  }

  const maxVal = Math.max(...CHART_DATA.map((d) => d.value), 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const paginatedLogs = filtered.slice((page - 1) * 10, page * 10);

  const SortIcon = ({ col }: { col: string }) => (
    <span className="material-symbols-outlined inline-block ml-0.5 align-middle" style={{ fontSize: 14 }}>
      {sortCol === col ? (sortDir === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
    </span>
  );

  return (
    <SettingsLayout activeTab="logs">
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-on-surface border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              setPage(1);
              setTimeout(() => setRefreshing(false), 800);
            }}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
            title="Refresh"
          >
            <span
              className={`material-symbols-outlined text-xl transition-transform ${refreshing ? "animate-spin" : ""}`}
            >
              sync
            </span>
          </button>
        </div>

        {/* Date Range & Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant font-medium">From:</span>
            <input
              type="datetime-local"
              defaultValue="2026-03-24T21:46"
              className="bg-surface-container-lowest rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant font-medium">To:</span>
            <input
              type="datetime-local"
              defaultValue="2026-03-31T21:46"
              className="bg-surface-container-lowest rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {/* Filters button + dropdown */}
            <div className="relative" ref={filtersRef}>
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  showFilters
                    ? "bg-primary/8 text-primary border-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant/20"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>tune</span>
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg z-30 p-4 space-y-3">
                  <FilterSelect label="Models" options={["All", ...FILTER_MODELS]} selected={filterModel} onChange={setFilterModel} />
                  <FilterSelect label="Providers" options={["All", ...FILTER_PROVIDERS]} selected={filterProvider} onChange={setFilterProvider} />
                  <FilterSelect label="API Keys" options={["All"]} selected="All" onChange={() => {}} />
                  <FilterSelect label="Generation Billing" options={FILTER_BILLING} selected={filterBilling} onChange={setFilterBilling} />
                  <FilterSelect label="Modality" options={FILTER_MODALITY} selected={filterModality} onChange={setFilterModality} />
                  <div>
                    <input
                      type="text"
                      value={filterSessionId}
                      onChange={(e) => setFilterSessionId(e.target.value)}
                      placeholder="Session ID"
                      className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => { setPage(1); setShowFilters(false); }}
                    className="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
            {activeTab === "Generations" && (
              <>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>flag</span>
                  <span className="hidden sm:inline">Report</span>
                </button>
                <div className="relative" ref={exportRef}>
                  <button
                    onClick={() => setExportOpen(!exportOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
                    Export
                  </button>
                  {exportOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1">
                      <button onClick={() => setExportOpen(false)} className="w-full text-left px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>description</span>
                        Export CSV
                      </button>
                      <button onClick={() => setExportOpen(false)} className="w-full text-left px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>code</span>
                        Export JSON
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===== Jobs Empty State ===== */}
        {activeTab === "Jobs" && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-xl font-semibold text-on-surface mb-3">
              You don't have any jobs in progress yet
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-md">
              Jobs will show any asynchronous video generations that are in progress with the provider.
            </p>
          </div>
        )}

        {/* ===== Sessions Empty State ===== */}
        {activeTab === "Sessions" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-xl font-semibold text-on-surface mb-3">
              You don't have any sessions yet
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mb-8">
              Group related generations into sessions to follow full conversations, debug chains, and track multi-step agents.
            </p>
            <div className="w-full max-w-2xl text-left">
              <p className="text-sm text-on-surface-variant mb-3">Example request with a session ID:</p>
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 overflow-x-auto">
                <pre className="text-sm font-mono text-on-surface leading-relaxed whitespace-pre">{`fetch("https://nexusai.dev/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer <YOUR_API_KEY>",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "openai/gpt-4o",
    "messages": [{ "role": "user", "content": "Hello" }],
    "session_id": "my-session-123"
  })
})`}</pre>
              </div>
            </div>
            <a href="/docs" className="mt-6 text-sm text-primary hover:underline">
              Learn more about session tracking in our docs
            </a>
          </div>
        )}

        {/* ===== Generations Content ===== */}
        {activeTab === "Generations" && (
          <>
            {/* Bar Chart */}
            <div className="bg-surface-container-lowest rounded-xl p-6 mb-8">
              <div className="flex items-end gap-1.5 h-20">
                {CHART_DATA.map((d, i) => (
                  <div
                    key={d.label}
                    className="flex-1 flex flex-col items-center relative"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {hoveredBar === i && d.value > 0 && (
                      <div className="absolute -top-7 bg-inverse-surface text-inverse-on-surface text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap">
                        {d.value} requests
                      </div>
                    )}
                    <div
                      className={`w-full max-w-[36px] rounded-sm transition-all cursor-pointer ${hoveredBar === i ? "bg-primary" : "bg-primary/70"}`}
                      style={{ height: d.value > 0 ? `${Math.max((d.value / maxVal) * 64, 4)}px` : "0px" }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-3">
                {CHART_DATA.map((d) => (
                  <div key={d.label} className="flex-1 text-center text-[10px] text-on-surface-variant font-medium">
                    {d.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-on-surface-variant">{filtered.length} results</p>
            </div>

            {/* Table - Desktop */}
            <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      <th className="text-left px-5 py-3.5">Timestamp</th>
                      <th className="text-left px-5 py-3.5">Provider / Model</th>
                      <th className="text-left px-5 py-3.5">App</th>
                      <th className="text-right px-5 py-3.5 cursor-pointer select-none hover:text-on-surface transition-colors" onClick={() => handleSort("tokens")}>
                        Tokens <SortIcon col="tokens" />
                      </th>
                      <th className="text-right px-5 py-3.5 cursor-pointer select-none hover:text-on-surface transition-colors" onClick={() => handleSort("cost")}>
                        Cost <SortIcon col="cost" />
                      </th>
                      <th className="text-right px-5 py-3.5">Speed</th>
                      <th className="text-right px-5 py-3.5">Finish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5 text-on-surface-variant text-xs font-medium">{log.time}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                              {log.provider.charAt(0)}
                            </span>
                            <span className="text-sm text-primary font-medium">{log.model}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-on-surface-variant">{log.app}</td>
                        <td className="px-5 py-3.5 text-right text-xs text-on-surface tabular-nums">
                          {log.tokensIn} <span className="text-on-surface-variant">&rarr;</span> {log.tokensOut}
                        </td>
                        <td className="px-5 py-3.5 text-right text-xs text-on-surface tabular-nums">{log.cost}</td>
                        <td className="px-5 py-3.5 text-right text-xs text-on-surface-variant tabular-nums">{log.speed}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`text-xs font-medium ${log.finish === "error" ? "text-error" : "text-on-surface-variant"}`}>
                            {log.finish}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {paginatedLogs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-10 text-center text-sm text-on-surface-variant italic">No logs match the current filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-outline-variant/10">
                <p className="text-xs text-on-surface-variant">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                        page === p ? "font-semibold text-primary bg-primary/8" : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-3">
              {paginatedLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="bg-surface-container-lowest rounded-xl p-4 cursor-pointer hover:bg-surface-container/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                        {log.provider.charAt(0)}
                      </span>
                      <span className="text-sm font-medium text-primary">{log.model}</span>
                    </div>
                    <span className={`text-xs font-medium ${log.finish === "error" ? "text-error" : "text-on-surface-variant"}`}>
                      {log.finish}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mb-2">{log.time}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant tabular-nums">{log.tokensIn} &rarr; {log.tokensOut}</span>
                    <span className="text-on-surface-variant tabular-nums">{log.speed}</span>
                    <span className="text-on-surface font-medium tabular-nums">{log.cost}</span>
                  </div>
                </div>
              ))}
              {paginatedLogs.length === 0 && (
                <p className="text-center text-sm text-on-surface-variant italic py-10">No logs match the current filters.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Panel */}
      {selectedLog && <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />}

      {/* Report Feedback Modal */}
      {showReport && <ReportFeedbackModal onClose={() => setShowReport(false)} />}
    </SettingsLayout>
  );
}
