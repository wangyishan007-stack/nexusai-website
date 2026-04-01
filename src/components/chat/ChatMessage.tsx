import { memo, useState } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
import type { ChatMessage as ChatMessageType, ChatModel } from "../../data/chatModels";
import { MarkdownRenderer } from "./MarkdownRenderer";

const thinIcon: React.CSSProperties = {
  fontVariationSettings: "'wght' 300",
};

interface ChatMessageProps {
  readonly message: ChatMessageType;
  readonly model?: ChatModel;
  readonly onCopy: (content: string) => void;
  readonly onRegenerate?: () => void;
  readonly isLast?: boolean;
}

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = memo(
  function ChatMessageComponent({ message, model, onCopy, onRegenerate, isLast }) {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState(false);
    const isUser = message.role === "user";

    if (isUser) {
      return (
        <div
          className="flex items-start gap-3 justify-end"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="flex flex-col items-end relative">
            {/* Hover actions */}
            {hovered && (
              <div className="absolute -top-8 right-0 flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1 shadow-sm z-10">
                <button
                  onClick={() => onCopy(message.content)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded transition-colors"
                  title={t("chat.copy")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, ...thinIcon }}>content_copy</span>
                </button>
              </div>
            )}

            <div className="ml-auto max-w-[80%] bg-primary text-on-primary rounded-2xl rounded-br-md px-4 py-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>

            <span className="text-[10px] text-on-surface-variant/50 mt-1 mr-1">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          {/* User avatar */}
          <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold font-headline">
            {t("chat.user_avatar")}
          </div>
        </div>
      );
    }

    // Assistant message
    const avatarLetter = model?.avatarLetter ?? "AI";
    const avatarBg = model?.avatarBg ?? "bg-blue-100";
    const avatarText = model?.avatarText ?? "text-blue-700";

    return (
      <div
        className="flex items-start gap-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Model avatar */}
        <div
          className={`shrink-0 w-8 h-8 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center text-xs font-bold font-headline`}
        >
          {avatarLetter}
        </div>

        <div className="flex flex-col items-start relative max-w-[80%]">
          {/* Hover actions */}
          {hovered && (
            <div className="absolute -top-8 right-0 flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1 shadow-sm z-10">
              <button
                onClick={() => onCopy(message.content)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded transition-colors"
                title={t("chat.copy")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, ...thinIcon }}>content_copy</span>
              </button>
              {isLast && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded transition-colors"
                  title={t("chat.regenerate")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, ...thinIcon }}>refresh</span>
                </button>
              )}
            </div>
          )}

          <div className="bg-surface-container-low rounded-2xl rounded-bl-md px-4 py-3">
            <MarkdownRenderer content={message.content} />
            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5" />
            )}
          </div>

          <span className="text-[10px] text-on-surface-variant/50 mt-1 ml-1">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }
);
