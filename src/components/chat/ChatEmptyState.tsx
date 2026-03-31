import type { FC } from "react";

interface ChatEmptyStateProps {
  readonly onPromptClick: (prompt: string) => void;
  readonly onModelSelect: (modelId: string) => void;
}

const MODEL_CARDS = [
  {
    title: "Flagship models",
    modelId: "openai/gpt-4o",
    description:
      "The most powerful general-purpose intelligence across coding, creative, and logic tasks.",
    avatars: [
      { letter: "G", bg: "bg-blue-500" },
      { letter: "A", bg: "bg-emerald-500" },
      { letter: "xi", bg: "bg-slate-700" },
    ],
  },
  {
    title: "Best roleplay models",
    modelId: "meta/llama-3.3-70b",
    description:
      "Tuned for high-fidelity character consistency, narrative depth, and creative worldbuilding.",
    avatars: [
      { letter: "Q", bg: "bg-purple-500" },
      { letter: "G", bg: "bg-indigo-500" },
      { letter: "M", bg: "bg-rose-500" },
    ],
  },
  {
    title: "Best coding models",
    modelId: "anthropic/claude-4-sonnet",
    description:
      "Precision-engineered for complex refactoring, system architecture, and rapid prototyping.",
    avatars: [
      { letter: "A", bg: "bg-sky-500" },
      { letter: "G", bg: "bg-blue-600" },
      { letter: "xi", bg: "bg-zinc-800" },
    ],
  },
  {
    title: "Reasoning models",
    modelId: "google/gemini-2.5-pro",
    description:
      "Extended chain-of-thought capabilities for math, scientific logic, and strategic planning.",
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

export const ChatEmptyState: FC<ChatEmptyStateProps> = ({
  onPromptClick,
  onModelSelect,
}) => {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-8 min-h-0">
      {/* Hero text */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold font-headline tracking-tighter text-on-background mb-4">
          How can I assist today?
        </h1>
      </div>

      {/* 2x2 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
        {MODEL_CARDS.map((card) => (
          <button
            key={card.title}
            type="button"
            onClick={() => onModelSelect(card.modelId)}
            className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm font-headline">
                {card.title}
              </span>
              <div className="flex -space-x-2">
                {card.avatars.map((avatar, i) => (
                  <div
                    key={`${card.title}-avatar-${String(i)}`}
                    className={`w-6 h-6 rounded-full ${avatar.bg} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    {avatar.letter}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {card.description}
            </p>
          </button>
        ))}
      </div>

      {/* Prompt Chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {PROMPT_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onPromptClick(chip)}
            className="px-4 py-2 bg-white border border-outline-variant/20 rounded-full text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
