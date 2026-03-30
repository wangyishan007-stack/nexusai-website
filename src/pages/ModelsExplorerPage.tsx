import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";

/* Navbar import removed – this page uses an inline header for full-viewport containment */

interface ModelsExplorerPageProps {
  readonly className?: string;
  readonly defaultFiltersExpanded?: boolean;
}

const FILTER_GROUPS_COLLAPSED = [
  "Input Modalities",
  "Output Modalities",
  "Context length",
  "Prompt pricing",
  "Series",
  "Categories",
  "Supported Parameters",
  "Distillable",
  "Zero Data Retention",
  "Providers",
  "Model Authors",
];

const FILTER_GROUPS_EXPANDED: Record<string, { label: string; checked?: boolean }[]> = {
  "Input Modalities": [
    { label: "Text (347)", checked: true },
    { label: "Image (42)" },
    { label: "File (28)" },
    { label: "Audio (12)" },
    { label: "Video (5)" },
  ],
  "Output Modalities": [
    { label: "Text (347)", checked: true },
    { label: "Image (18)" },
    { label: "Audio (8)" },
    { label: "Embeddings (15)" },
  ],
  "Prompt pricing": [
    { label: "Free (25)", checked: true },
    { label: "<$1/M (89)" },
    { label: "$1-5/M (124)" },
    { label: "$5-20/M (78)" },
    { label: ">$20/M (31)" },
  ],
  "Series": [
    { label: "OpenAI (38)" },
    { label: "Anthropic (12)" },
    { label: "Google (24)" },
    { label: "Meta (18)" },
    { label: "Mistral (14)" },
    { label: "DeepSeek (8)" },
    { label: "Qwen (11)" },
    { label: "xAI (6)" },
    { label: "Cohere (9)" },
  ],
  "Categories": [
    { label: "Programming (89)" },
    { label: "Roleplay (45)" },
    { label: "Marketing (32)" },
    { label: "Technology (67)" },
    { label: "Science (41)" },
    { label: "Translation (28)" },
    { label: "Legal (15)" },
    { label: "Finance (19)" },
    { label: "Health (12)" },
    { label: "Academia (36)" },
  ],
  "Supported Parameters": [
    { label: "Tools/Function Calling (156)" },
    { label: "JSON Mode (132)" },
    { label: "Structured Output (89)" },
    { label: "Streaming (298)" },
    { label: "Vision (42)" },
    { label: "System Prompt (312)" },
  ],
  "Distillable": [
    { label: "Yes (45)" },
    { label: "No (302)" },
  ],
  "Zero Data Retention": [
    { label: "Yes (78)" },
    { label: "No (269)" },
  ],
  "Providers": [
    { label: "Together (52)" },
    { label: "Fireworks (38)" },
    { label: "AWS Bedrock (24)" },
    { label: "Azure (18)" },
    { label: "Google Vertex (22)" },
    { label: "Groq (15)" },
    { label: "Lambda (12)" },
    { label: "Lepton (9)" },
  ],
  "Model Authors": [
    { label: "OpenAI (38)" },
    { label: "Anthropic (12)" },
    { label: "Google (24)" },
    { label: "Meta (18)" },
    { label: "Mistral AI (14)" },
    { label: "DeepSeek (8)" },
    { label: "Alibaba (11)" },
    { label: "xAI (6)" },
    { label: "Cohere (9)" },
    { label: "AI21 Labs (5)" },
  ],
};

const MODEL_ROWS = [
  {
    slug: "alibaba-wan-2-6",
    initial: "A",
    bgColor: "bg-surface-container-highest",
    textColor: "text-primary",
    name: "Alibaba: Wan 2.6",
    tags: "LLM \u2022 Multi-modal",
    tokens: "1.2B",
    input: "$0.02",
    output: "$0.06",
    context: "128k",
    released: "Feb 14, 2024",
  },
  {
    slug: "kwaipilot-kat-coder",
    initial: "K",
    bgColor: "bg-slate-800",
    textColor: "text-white",
    name: "Kwaipilot: KAT - Coder",
    tags: "Code \u2022 Reasoning",
    tokens: "850M",
    input: "$0.15",
    output: "$0.45",
    context: "32k",
    released: "Feb 12, 2024",
  },
  {
    slug: "llama-3-1-405b",
    initial: "M",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    name: "Meta: Llama 3.1 405B",
    tags: "General \u2022 Large Scale",
    tokens: "4.5T",
    input: "$2.00",
    output: "$6.00",
    context: "128k",
    released: "Jan 28, 2024",
  },
  {
    slug: "claude-3-5-sonnet",
    initial: "A",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    name: "Anthropic: Claude 3.5 Sonnet",
    tags: "Reasoning \u2022 Vision",
    tokens: "12.8T",
    input: "$3.00",
    output: "$15.00",
    context: "200k",
    released: "Jan 15, 2024",
  },
  {
    slug: "o1-preview",
    initial: "O",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    name: "OpenAI: o1-preview",
    tags: "Advanced Reasoning",
    tokens: "N/A",
    input: "$15.00",
    output: "$60.00",
    context: "128k",
    released: "Jan 02, 2024",
  },
];

export const ModelsExplorerPage: React.FC<ModelsExplorerPageProps> = ({
  className = "",
  defaultFiltersExpanded = false,
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState(defaultFiltersExpanded);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`bg-surface text-on-surface antialiased h-screen flex flex-col overflow-hidden ${className}`}>
      {/* Inline header matching shared Navbar style */}
      <header className="shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900 font-headline">
            NexusAI
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
              Sign In
            </button>
            <Link
              to="/settings/api-keys"
              className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 max-w-screen-2xl mx-auto w-full bg-surface">
        {/* Sidebar Filters */}
        <aside className="w-72 bg-surface-container-low p-6 overflow-y-auto hidden lg:block border-r border-surface-container shrink-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold font-headline">Filters</h2>
            <button className="text-xs text-primary font-semibold hover:underline">
              Clear all
            </button>
          </div>

          {filtersExpanded ? (
            /* Expanded Filters */
            <div className="space-y-8">
              {Object.entries(FILTER_GROUPS_EXPANDED).map(([groupName, options]) => (
                <div key={groupName}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
                    {groupName}
                  </h3>
                  {groupName === "Context length" ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold text-primary">
                        <span>4K</span>
                        <span>1M</span>
                      </div>
                      <input
                        type="range"
                        min="4000"
                        max="1000000"
                        step="1000"
                        defaultValue="200000"
                        className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="text-sm font-medium text-on-surface text-center">
                        Up to 200K tokens
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`space-y-2 ${
                        ["Series", "Categories", "Providers", "Model Authors"].includes(groupName)
                          ? "max-h-48 overflow-y-auto pr-2"
                          : ""
                      }`}
                    >
                      {options.map((opt) => (
                        <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            defaultChecked={opt.checked}
                            className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                          />
                          <span className="text-sm text-on-surface group-hover:text-primary transition-colors">
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Collapsed Filters */
            <div className="space-y-4">
              {FILTER_GROUPS_COLLAPSED.map((groupName) => (
                <div key={groupName}>
                  <button
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-1"
                    onClick={() => setFiltersExpanded(true)}
                  >
                    <span>{groupName}</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {filtersExpanded && (
            <button
              className="mt-6 text-xs text-primary font-semibold hover:underline"
              onClick={() => setFiltersExpanded(false)}
            >
              Collapse filters
            </button>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white overflow-y-auto min-h-0">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold font-headline text-on-background tracking-tight">
                  Model Explorer
                </h1>
                <p className="text-on-surface-variant mt-1">
                  Discover and compare the latest AI models across the ecosystem.
                </p>
              </div>
              <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">upload</span>
                Upload Model
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-surface-container">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-on-surface">
                  Showing 12 of 347 models
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg text-sm cursor-pointer hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">sort</span>
                  <span>Sort by Newest</span>
                </div>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  <button className="p-1.5 text-primary bg-white shadow-sm rounded-md">
                    <span className="material-symbols-outlined text-sm">list</span>
                  </button>
                  <button className="p-1.5 text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead className="text-xs font-bold uppercase tracking-widest text-outline">
                <tr>
                  <th className="px-4 py-3">Model Name</th>
                  <th className="px-4 py-3">Weekly Tokens</th>
                  <th className="px-4 py-3">Input ($/1M)</th>
                  <th className="px-4 py-3">Output ($/1M)</th>
                  <th className="px-4 py-3">Context</th>
                  <th className="px-4 py-3">Released</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {MODEL_ROWS.map((model, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => navigate(`/models/${model.slug}`)}
                  >
                    <td className="px-4 py-4 bg-surface rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${model.bgColor} flex items-center justify-center font-bold text-xs ${model.textColor}`}
                        >
                          {model.initial}
                        </div>
                        <div>
                          <div className="font-bold text-on-background">{model.name}</div>
                          <div className="text-[10px] text-outline">{model.tags}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-surface">
                      <span className="font-medium">{model.tokens}</span>
                    </td>
                    <td className="px-4 py-4 bg-surface font-mono">{model.input}</td>
                    <td className="px-4 py-4 bg-surface font-mono">{model.output}</td>
                    <td className="px-4 py-4 bg-surface">{model.context}</td>
                    <td className="px-4 py-4 bg-surface rounded-r-xl text-on-surface-variant">
                      {model.released}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          <div className="mt-12 flex justify-center">
            <button className="px-8 py-3 bg-surface-container-low text-primary font-bold rounded-xl hover:bg-surface-container transition-all active:scale-95 shadow-sm">
              Load more models
            </button>
          </div>
        </main>
      </div>

    </div>
  );
};
