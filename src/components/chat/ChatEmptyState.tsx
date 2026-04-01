import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface ChatEmptyStateProps {
  readonly onPromptClick: (prompt: string) => void;
  readonly onModelSelect: (modelId: string) => void;
}

const MODEL_CARDS = [
  {
    titleKey: "chat.card_flagship",
    descKey: "chat.card_flagship_desc",
    modelId: "openai/gpt-4o",
    avatars: [
      { letter: "G", bg: "bg-blue-500" },
      { letter: "A", bg: "bg-emerald-500" },
      { letter: "xi", bg: "bg-slate-700" },
    ],
  },
  {
    titleKey: "chat.card_roleplay",
    descKey: "chat.card_roleplay_desc",
    modelId: "meta/llama-3.3-70b",
    avatars: [
      { letter: "Q", bg: "bg-purple-500" },
      { letter: "G", bg: "bg-indigo-500" },
      { letter: "M", bg: "bg-rose-500" },
    ],
  },
  {
    titleKey: "chat.card_coding",
    descKey: "chat.card_coding_desc",
    modelId: "anthropic/claude-4-sonnet",
    avatars: [
      { letter: "A", bg: "bg-sky-500" },
      { letter: "G", bg: "bg-blue-600" },
      { letter: "xi", bg: "bg-zinc-800" },
    ],
  },
  {
    titleKey: "chat.card_reasoning",
    descKey: "chat.card_reasoning_desc",
    modelId: "google/gemini-2.5-pro",
    avatars: [
      { letter: "G", bg: "bg-amber-500" },
      { letter: "D", bg: "bg-slate-900" },
      { letter: "xi", bg: "bg-teal-500" },
    ],
  },
];

const PROMPT_CHIPS = [
  { chipKey: "chat.chip_code_review", prompt: "Code Review" },
  { chipKey: "chat.chip_advanced_reasoning", prompt: "Advanced Reasoning" },
  { chipKey: "chat.chip_9_vs_9", prompt: "9.9 vs 9.11" },
  { chipKey: "chat.chip_strawberry", prompt: "Strawberry Test" },
  { chipKey: "chat.chip_poem_riddle", prompt: "Poem Riddle" },
  { chipKey: "chat.chip_personal_bio", prompt: "Personal Bio" },
];

export const ChatEmptyState: FC<ChatEmptyStateProps> = ({
  onPromptClick,
  onModelSelect,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-4 sm:px-8 min-h-0 py-6">
      {/* Hero text */}
      <div className="mb-6 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold font-headline tracking-tighter text-on-background mb-4">
          {t("chat.hero_title")}
        </h1>
      </div>

      {/* 2x2 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full mb-6 sm:mb-10">
        {MODEL_CARDS.map((card) => (
          <button
            key={card.titleKey}
            type="button"
            onClick={() => onModelSelect(card.modelId)}
            className="bg-surface-container-low p-5 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-sm font-headline">
                {t(card.titleKey)}
              </span>
              <div className="flex -space-x-2">
                {card.avatars.map((avatar, i) => (
                  <div
                    key={`${card.titleKey}-avatar-${String(i)}`}
                    className={`w-6 h-6 rounded-full ${avatar.bg} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold`}
                  >
                    {avatar.letter}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t(card.descKey)}
            </p>
          </button>
        ))}
      </div>

      {/* Prompt Chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {PROMPT_CHIPS.map((chip) => (
          <button
            key={chip.chipKey}
            type="button"
            onClick={() => onPromptClick(chip.prompt)}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-xs font-medium text-on-surface hover:bg-surface-container-low transition-colors"
          >
            {t(chip.chipKey)}
          </button>
        ))}
      </div>
    </div>
  );
};
