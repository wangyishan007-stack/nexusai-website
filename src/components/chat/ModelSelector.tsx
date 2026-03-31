import { useState, useEffect, useCallback, useRef } from "react";
import type { FC } from "react";
import { AVAILABLE_MODELS } from "../../data/chatModels";

interface ModelSelectorProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedModelId: string;
  readonly onChange: (modelId: string) => void;
}

const PROVIDERS = ["All", ...new Set(AVAILABLE_MODELS.map((m) => m.provider))];

export const ModelSelector: FC<ModelSelectorProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProvider, setActiveProvider] = useState("All");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveProvider("All");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = useCallback(
    (modelId: string) => {
      onChange(modelId);
      onClose();
    },
    [onChange, onClose],
  );

  const filtered = AVAILABLE_MODELS.filter((m) => {
    const matchesSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider =
      activeProvider === "All" || m.provider === activeProvider;
    return matchesSearch && matchesProvider;
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mt-[18vh] w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-container">
          <span
            className="material-symbols-outlined text-on-surface-variant text-xl"
            style={{ fontVariationSettings: "'wght' 300" }}
          >
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search models"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-on-surface text-base outline-none placeholder:text-outline font-body"
          />
        </div>

        {/* Provider filter pills */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-surface-container overflow-x-auto">
          {PROVIDERS.map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => setActiveProvider(provider)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeProvider === provider
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {provider}
            </button>
          ))}
          {activeProvider !== "All" && (
            <button
              type="button"
              onClick={() => setActiveProvider("All")}
              className="text-xs text-on-surface-variant hover:text-on-surface transition-colors ml-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Model list */}
        <div className="max-h-[50vh] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-on-surface-variant">
              No models found
            </div>
          )}
          {filtered.map((model) => {
            const isSelected = model.id === selectedModelId;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelect(model.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                  isSelected
                    ? "bg-primary-container/10"
                    : "hover:bg-surface-container-low"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full ${model.avatarBg} ${model.avatarText} flex items-center justify-center text-[11px] font-bold shrink-0`}
                >
                  {model.avatarLetter}
                </div>

                {/* Name + details */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-on-surface"}`}
                  >
                    {model.name}
                  </span>
                  <span className="text-xs text-on-surface-variant ml-2">
                    {model.contextWindow} &middot; {model.inputCost}
                  </span>
                </div>

                {/* Check */}
                {isSelected && (
                  <span
                    className="material-symbols-outlined text-primary text-lg shrink-0"
                    style={{ fontVariationSettings: "'wght' 300" }}
                  >
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
