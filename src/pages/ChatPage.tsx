import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";

interface ChatPageProps {
  readonly className?: string;
}

const CHAT_ROOMS_TODAY = [
  { icon: "chat_bubble", label: "Untitled Chat", active: true },
  { icon: "auto_awesome", label: "Project Nexus Research", active: false },
];

const CHAT_ROOMS_SHARED = [
  { icon: "group", label: "Design System V2", active: false },
];

const MODEL_CARDS = [
  {
    title: "Flagship models",
    description: "The most powerful general-purpose intelligence across coding, creative, and logic tasks.",
    avatars: [
      { letter: "G", bg: "bg-blue-500" },
      { letter: "A", bg: "bg-emerald-500" },
      { letter: "xi", bg: "bg-slate-700" },
    ],
  },
  {
    title: "Best roleplay models",
    description: "Tuned for high-fidelity character consistency, narrative depth, and creative worldbuilding.",
    avatars: [
      { letter: "Q", bg: "bg-purple-500" },
      { letter: "G", bg: "bg-indigo-500" },
      { letter: "M", bg: "bg-rose-500" },
    ],
  },
  {
    title: "Best coding models",
    description: "Precision-engineered for complex refactoring, system architecture, and rapid prototyping.",
    avatars: [
      { letter: "A", bg: "bg-sky-500" },
      { letter: "G", bg: "bg-blue-600" },
      { letter: "xi", bg: "bg-zinc-800" },
    ],
  },
  {
    title: "Reasoning models",
    description: "Extended chain-of-thought capabilities for math, scientific logic, and strategic planning.",
    avatars: [
      { letter: "G", bg: "bg-amber-500" },
      { letter: "D", bg: "bg-slate-900" },
      { letter: "xi", bg: "bg-teal-500" },
    ],
  },
];

const PROMPT_CHIPS = [
  "Code Review",
  "Advanced Reas...",
  "9.9 vs 9.11",
  "Strawberry Test",
  "Poem Riddle",
  "Personal Bio",
];

export const ChatPage: React.FC<ChatPageProps> = ({ className = "" }) => {
  const { pathname } = useLocation();

  return (
    <div className={`bg-surface text-on-background h-screen flex flex-col overflow-hidden ${className}`}>
      {/* Inline non-fixed header matching shared Navbar style */}
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

      <div className="flex flex-1 min-h-0">
        {/* Side Navigation */}
        <aside className="flex flex-col py-6 px-4 bg-slate-50 w-72 border-r border-slate-100 shrink-0">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full bg-surface-container-lowest border-none rounded-xl pl-10 py-2.5 text-sm focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="mb-4">
              <span className="px-4 text-[10px] uppercase tracking-[0.1em] font-bold text-on-surface-variant opacity-60">
                Today
              </span>
              <div className="mt-2 space-y-1">
                {CHAT_ROOMS_TODAY.map((room) => (
                  <div
                    key={room.label}
                    className={`flex items-center gap-3 px-4 py-3 mb-1 cursor-pointer rounded-lg hover:translate-x-1 transition-transform duration-200 ${
                      room.active
                        ? "bg-white text-blue-600 font-semibold shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{room.icon}</span>
                    <span className="truncate font-headline text-sm">{room.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <span className="px-4 text-[10px] uppercase tracking-[0.1em] font-bold text-on-surface-variant opacity-60">
                Shared
              </span>
              <div className="mt-2 space-y-1">
                {CHAT_ROOMS_SHARED.map((room) => (
                  <div
                    key={room.label}
                    className="flex items-center gap-3 px-4 py-3 mb-1 cursor-pointer text-slate-600 hover:bg-slate-100 hover:translate-x-1 transition-transform duration-200"
                  >
                    <span className="material-symbols-outlined text-lg">{room.icon}</span>
                    <span className="truncate font-headline text-sm">{room.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 mt-auto border-t border-slate-200 space-y-1 shrink-0">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-slate-600 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-lg">help</span>
              <span className="font-headline text-sm">Help</span>
            </div>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 flex flex-col bg-surface-container-lowest relative min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-surface-container shrink-0">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-primary text-sm font-semibold hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">add</span>
                New Chat
                <span className="text-[10px] bg-white/50 px-1.5 py-0.5 rounded border border-outline-variant/20 ml-1">
                  &#8984;/
                </span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant text-sm font-medium hover:bg-surface-container-low transition-colors border border-outline-variant/10">
                Add Model
                <span className="text-[10px] bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/20 ml-1">
                  &#8984;K
                </span>
              </button>
            </div>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          {/* Content Area (Empty State) */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-8 min-h-0">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-background mb-4">
                How can I assist today?
              </h1>
              <p className="text-on-surface-variant text-lg max-w-lg mx-auto leading-relaxed opacity-70">
                Experience the intelligence of the digital curator. NexusAI blends architectural precision with sophisticated reasoning.
              </p>
            </div>

            {/* 2x2 Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
              {MODEL_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm font-headline">{card.title}</span>
                    <div className="flex -space-x-2">
                      {card.avatars.map((avatar, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full ${avatar.bg} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold`}
                        >
                          {avatar.letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  className="px-4 py-2 bg-white border border-outline-variant/20 rounded-full text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="max-w-4xl mx-auto w-full p-6 shrink-0">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-on-surface/5 flex flex-col">
              <div className="px-4 py-2 border-b border-surface-container flex items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary-container/10 text-primary font-medium text-[11px] cursor-pointer hover:bg-secondary-container/20 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  Create Artifact...
                </div>
              </div>
              <textarea
                className="w-full bg-transparent border-none p-4 text-sm focus:ring-0 resize-none min-h-[100px] placeholder:text-outline"
                placeholder="Start a new message..."
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-surface-container/50">
                <div className="flex items-center gap-0.5">
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">attach_file</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">mic</span>
                  </button>
                  <div className="w-px h-6 bg-surface-container mx-2" />
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    Auto &#9662;
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    8 &#9662;
                  </button>
                  <div className="w-px h-6 bg-surface-container mx-2" />
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">public</span>
                  </button>
                </div>
                <button className="w-9 h-9 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md">
                  <span className="material-symbols-outlined text-lg">arrow_upward</span>
                </button>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-[10px] text-on-surface-variant/40">
                NexusAI can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};
