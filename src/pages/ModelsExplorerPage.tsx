import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { LoginModal } from "../components/LoginModal";

/* Navbar import removed – this page uses an inline header for full-viewport containment */

interface ModelsExplorerPageProps {
  readonly className?: string;
  readonly defaultFiltersExpanded?: boolean;
}

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
    bgColor: "bg-surface-container-highest",
    textColor: "text-on-surface",
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    if (defaultFiltersExpanded) {
      return Object.fromEntries(Object.keys(FILTER_GROUPS_EXPANDED).map((k) => [k, true]));
    }
    return {};
  });
  const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const [, options] of Object.entries(FILTER_GROUPS_EXPANDED)) {
      for (const opt of options) {
        if (opt.checked) initial[opt.label] = true;
      }
    }
    return initial;
  });
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogin = useCallback(() => {
    login();
    setShowLogin(false);
  }, [login]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const visibleLinks = isLoggedIn
    ? NAV_LINKS.filter((link) => link.href !== "/pricing")
    : NAV_LINKS;

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const clearAll = () => {
    setCheckedFilters({});
    setExpandedGroups({});
  };

  const toggleCheck = (label: string) => {
    setCheckedFilters((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className={`bg-surface text-on-surface antialiased h-screen flex flex-col overflow-hidden ${className}`}>
      {/* Inline header matching shared Navbar style */}
      <header className="shrink-0 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">
            NexusAI
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-rose-800 text-white flex items-center justify-center text-sm font-bold hover:opacity-90 transition-all"
              >
                x
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden py-1 z-50">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10">
                    <div className="w-9 h-9 rounded-full bg-rose-800 text-white flex items-center justify-center text-sm font-bold">x</div>
                    <span className="font-semibold text-on-surface">Personal</span>
                    <Link to="/settings/preferences" onClick={() => setShowUserMenu(false)} className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-xl">settings</span>
                    </Link>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: "bar_chart", label: "Activity", href: "/settings/activity" },
                      { icon: "format_list_bulleted", label: "Logs", href: "/settings/logs" },
                      { icon: "credit_card", label: "Credits", href: "/settings/credits" },
                      { icon: "settings", label: "Settings", href: "/settings/preferences" },
                    ].map((item) => (
                      <Link key={item.label} to={item.href} onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors">
                        <span className="material-symbols-outlined text-xl text-on-surface-variant">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-outline-variant/10 py-1">
                    <button onClick={() => { logout(); setShowUserMenu(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-surface-container/60 transition-colors w-full">
                      <span className="material-symbols-outlined text-xl">logout</span>
                      Sign Out
                    </button>
                  </div>
                  <div className="border-t border-outline-variant/10 px-3 py-2">
                    <div className="flex items-center bg-surface-container rounded-lg p-0.5">
                      <button className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-surface-container-lowest shadow-sm text-on-surface text-xs font-medium transition-all"><span className="material-symbols-outlined text-base mr-1">light_mode</span></button>
                      <button className="flex-1 flex items-center justify-center py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:text-on-surface transition-all"><span className="material-symbols-outlined text-base mr-1">dark_mode</span></button>
                      <button className="flex-1 flex items-center justify-center py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:text-on-surface transition-all"><span className="material-symbols-outlined text-base mr-1">desktop_windows</span></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => setShowLogin(true)} className="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">
                Sign In
              </button>
              <Link to="/settings/api-keys" className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all">
                Get API Key
              </Link>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />

      <div className="flex flex-1 min-h-0 max-w-screen-2xl mx-auto w-full bg-surface">
        {/* Sidebar Filters */}
        <aside className="w-72 bg-surface-container-low p-6 overflow-y-auto hidden lg:block border-r border-surface-container shrink-0">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold font-headline">Filters</h2>
            <button className="text-xs text-primary font-semibold hover:underline" onClick={clearAll}>
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {Object.entries(FILTER_GROUPS_EXPANDED).map(([groupName, options]) => {
              const isOpen = !!expandedGroups[groupName];
              return (
                <div key={groupName}>
                  <button
                    className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors py-2"
                    onClick={() => toggleGroup(groupName)}
                  >
                    <span>{groupName}</span>
                    <span className={`material-symbols-outlined text-sm transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}>
                      chevron_right
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-4 pt-1">
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
                                checked={!!checkedFilters[opt.label]}
                                onChange={() => toggleCheck(opt.label)}
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
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-surface-container-lowest overflow-y-auto min-h-0">
          <header className="mb-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-on-background tracking-tight">
                Model Explorer
              </h1>
              <p className="text-on-surface-variant mt-1">
                Discover and compare the latest AI models across the ecosystem.
              </p>
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
                  <button
                    className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "text-primary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <span className="material-symbols-outlined text-sm">list</span>
                  </button>
                  <button
                    className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "text-primary bg-surface-container-lowest shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <span className="material-symbols-outlined text-sm">grid_view</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {viewMode === "list" ? (
            /* List View */
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
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {MODEL_ROWS.map((model, i) => (
                <div
                  key={i}
                  className="bg-surface rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/models/${model.slug}`)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${model.bgColor} flex items-center justify-center font-bold text-sm ${model.textColor}`}
                    >
                      {model.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-on-background truncate group-hover:text-primary transition-colors">{model.name}</div>
                      <div className="text-[10px] text-outline">{model.tags}</div>
                    </div>
                  </div>
                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Input</span>
                      <span className="font-mono font-medium">{model.input}/1M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Output</span>
                      <span className="font-mono font-medium">{model.output}/1M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Context</span>
                      <span className="font-medium">{model.context}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <span className="text-[10px] text-on-surface-variant">{model.released}</span>
                    <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      View details
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

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
