import { useRef, useEffect, useState, useCallback } from "react";
import type React from "react";
import type { ChatMessage } from "../../data/chatModels";
import { AVAILABLE_MODELS } from "../../data/chatModels";
import { ChatMessageComponent } from "./ChatMessage";

interface ChatMessageListProps {
  readonly messages: ChatMessage[];
  readonly selectedModelId: string;
  readonly isGenerating: boolean;
  readonly onRegenerate: () => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  selectedModelId,
  isGenerating,
  onRegenerate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const lastScrollTime = useRef(0);
  const lastContentLenRef = useRef(0);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 100) return;
    lastScrollTime.current = now;

    if (isAtBottomRef.current && containerRef.current) {
      scrollToBottom("smooth");
    }
  }, [messages, scrollToBottom]);

  // Auto-scroll on streaming content changes (last message content length)
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsg = messages[messages.length - 1];
    const currentLen = lastMsg.content.length;

    if (currentLen !== lastContentLenRef.current) {
      lastContentLenRef.current = currentLen;

      if (isAtBottomRef.current && containerRef.current) {
        // Use instant scroll for streaming to avoid jank
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleCopy = useCallback((content: string) => {
    void navigator.clipboard.writeText(content);
  }, []);

  const findModelForMessage = (message: ChatMessage) => {
    const modelId = message.model ?? selectedModelId;
    return AVAILABLE_MODELS.find((m) => m.id === modelId);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-8 py-6 relative"
    >
      <div className="max-w-4xl mx-auto w-full space-y-4">
        {messages.map((message, index) => {
          const model = findModelForMessage(message);
          const isLast = index === messages.length - 1;
          const showRegenerate =
            isLast &&
            message.role === "assistant" &&
            !message.isStreaming &&
            !isGenerating;

          return (
            <ChatMessageComponent
              key={message.id}
              message={message}
              model={model}
              isLast={isLast}
              onCopy={handleCopy}
              onRegenerate={showRegenerate ? onRegenerate : undefined}
            />
          );
        })}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-4 right-4 bg-surface-container-lowest border border-outline-variant/30 rounded-full p-2 shadow-md hover:bg-surface-container-low transition-colors"
          aria-label="Scroll to bottom"
        >
          <span
            className="material-symbols-outlined text-on-surface-variant text-xl"
            style={{ fontVariationSettings: "'wght' 300" }}
          >
            keyboard_arrow_down
          </span>
        </button>
      )}
    </div>
  );
};
