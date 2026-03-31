import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";

interface ChatInputProps {
  readonly onSend: (content: string) => void;
  readonly isGenerating: boolean;
  readonly onStop: () => void;
}

const ARTIFACT_TYPES = [
  { icon: "image", label: "Image" },
  { icon: "laptop_mac", label: "Interactive App" },
  { icon: "browser_updated", label: "Landing Page" },
  { icon: "grid_view", label: "2D Game" },
  { icon: "view_in_ar", label: "3D Game" },
];

/** Thin line icon style matching Stitch design (weight 300) */
const thinIcon: React.CSSProperties = {
  fontVariationSettings: "'wght' 300",
};

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isGenerating,
  onStop,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [artifactOpen, setArtifactOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const artifactRef = useRef<HTMLDivElement>(null);

  const isEmpty = inputValue.trim().length === 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [inputValue]);

  useEffect(() => {
    if (!artifactOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        artifactRef.current &&
        !artifactRef.current.contains(e.target as Node)
      ) {
        setArtifactOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [artifactOpen]);

  const handleSend = useCallback(() => {
    if (isEmpty || isGenerating) return;
    onSend(inputValue.trim());
    setInputValue("");
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
    }
  }, [inputValue, isEmpty, isGenerating, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleArtifactClick = (label: string) => {
    setArtifactOpen(false);
    const prompt = `Create a ${label.toLowerCase()}`;
    onSend(prompt);
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-8 px-6 shrink-0">
      <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl shadow-sm focus-within:shadow-md transition-shadow">
        {/* Create Artifact chip */}
        <div className="p-3 relative">
          <div ref={artifactRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => setArtifactOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-on-primary-container rounded-full text-[11px] font-semibold hover:opacity-90 transition-colors cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[14px]"
                style={thinIcon}
              >
                magic_button
              </span>
              Create Artifact...
            </button>

            {/* Artifact type dropdown */}
            {artifactOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-surface-container-lowest rounded-lg shadow-xl py-1.5 z-50">
                {ARTIFACT_TYPES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleArtifactClick(item.label)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-on-surface hover:bg-surface-container/60 transition-colors text-left"
                  >
                    <span
                      className="material-symbols-outlined text-on-surface-variant text-[20px]"
                      style={thinIcon}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border-0 focus:ring-0 text-sm px-4 py-2 bg-transparent resize-none min-h-[96px] max-h-[200px] placeholder:text-outline outline-none"
          placeholder="Start a new message..."
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between p-3 border-t border-outline-variant/10">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-md transition-all"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={thinIcon}
              >
                attach_file
              </span>
            </button>
            <button
              type="button"
              className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-md transition-all"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={thinIcon}
              >
                mic
              </span>
            </button>
            <div className="w-[1px] h-4 bg-outline-variant/20 mx-1" />
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-on-surface-variant hover:bg-surface-container rounded transition-all"
            >
              Auto
              <span
                className="material-symbols-outlined text-[14px]"
                style={thinIcon}
              >
                expand_more
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-on-surface-variant hover:bg-surface-container rounded transition-all"
            >
              8
              <span
                className="material-symbols-outlined text-[14px]"
                style={thinIcon}
              >
                expand_more
              </span>
            </button>
            <div className="w-[1px] h-4 bg-outline-variant/20 mx-1" />
            <button
              type="button"
              className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-md transition-all"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={thinIcon}
              >
                language
              </span>
            </button>
          </div>

          {/* Send / Stop button */}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="w-9 h-9 bg-error text-white rounded-full flex items-center justify-center hover:shadow-lg active:scale-95 transition-all"
              aria-label="Stop generating"
            >
              <span className="material-symbols-outlined text-lg">stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={isEmpty}
              className={`w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:shadow-lg active:scale-95 transition-all ${
                isEmpty ? "opacity-40 cursor-not-allowed" : ""
              }`}
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-lg">north</span>
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-3 text-center">
        <p className="text-[10px] text-on-surface-variant">
          NexusAI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};
