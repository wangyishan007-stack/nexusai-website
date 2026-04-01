import { useState, useCallback, useRef, useEffect } from "react";
import type { FC, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Conversation } from "../../data/chatModels";

const GROUP_LABEL_KEYS: Record<string, string> = {
  Today: "chat.group_today",
  Yesterday: "chat.group_yesterday",
  "Previous 7 Days": "chat.group_previous_7_days",
  Older: "chat.group_older",
};

interface ChatSidebarProps {
  readonly conversations: Conversation[];
  readonly activeId: string | null;
  readonly isOpen: boolean;
  readonly onSelect: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onRename: (id: string, title: string) => void;
}

function groupByDate(
  conversations: Conversation[],
): { label: string; items: Conversation[] }[] {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const startOf7DaysAgo = startOfToday - 7 * 86_400_000;

  const groups: Record<string, Conversation[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };

  for (const convo of conversations) {
    const t = convo.updatedAt;
    if (t >= startOfToday) {
      groups["Today"].push(convo);
    } else if (t >= startOfYesterday) {
      groups["Yesterday"].push(convo);
    } else if (t >= startOf7DaysAgo) {
      groups["Previous 7 Days"].push(convo);
    } else {
      groups["Older"].push(convo);
    }
  }

  const order = ["Today", "Yesterday", "Previous 7 Days", "Older"];
  return order
    .filter((label) => groups[label].length > 0)
    .map((label) => ({ label, items: groups[label] }));
}

interface ConversationItemProps {
  readonly conversation: Conversation;
  readonly isActive: boolean;
  readonly onSelect: () => void;
  readonly onDelete: () => void;
  readonly onRename: (title: string) => void;
}

const ConversationItem: FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}) => {
  const { t } = useTranslation();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(conversation.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (confirmDelete) {
      deleteTimerRef.current = setTimeout(() => {
        setConfirmDelete(false);
      }, 2000);
    }
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, [confirmDelete]);

  const handleStartRename = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsRenaming(true);
      setRenameValue(conversation.title);
    },
    [conversation.title],
  );

  const handleConfirmRename = useCallback(() => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRename(trimmed);
    }
    setIsRenaming(false);
  }, [renameValue, conversation.title, onRename]);

  const handleRenameKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleConfirmRename();
      } else if (e.key === "Escape") {
        setIsRenaming(false);
        setRenameValue(conversation.title);
      }
    },
    [handleConfirmRename, conversation.title],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirmDelete) {
        onDelete();
        setConfirmDelete(false);
      } else {
        setConfirmDelete(true);
      }
    },
    [confirmDelete, onDelete],
  );

  const isUntitled =
    conversation.title === "New Chat" || !conversation.title.trim();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={isRenaming ? undefined : onSelect}
      onKeyDown={(e) => {
        if (!isRenaming && (e.key === "Enter" || e.key === " ")) {
          onSelect();
        }
      }}
      className={`group flex items-center gap-2 px-4 py-3 cursor-pointer rounded-lg transition-colors ${
        isActive
          ? "bg-surface-container-lowest text-on-surface font-medium shadow-sm"
          : "text-on-surface hover:bg-surface-container"
      }`}
    >
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={handleConfirmRename}
          className="flex-1 min-w-0 bg-surface-container-lowest border border-primary/30 rounded px-1.5 py-0.5 text-sm text-on-surface outline-none focus:border-primary"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className={`truncate text-sm flex-1 min-w-0 ${
            isUntitled ? "italic text-on-surface-variant" : ""
          }`}
        >
          {conversation.title}
        </span>
      )}

      {/* Hover actions */}
      {!isRenaming && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            onClick={handleStartRename}
            className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            title={t("chat.rename")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>edit</span>
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className={`p-1 rounded transition-colors ${
              confirmDelete
                ? "text-error hover:bg-error/8"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
            title={confirmDelete ? t("chat.click_again_to_confirm") : t("chat.delete")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}>
              delete_outline
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export const ChatSidebar: FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  isOpen,
  onSelect,
  onDelete,
  onRename,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : conversations;

  const groups = groupByDate(filtered);

  return (
    <aside
      className={`flex flex-col bg-surface-container-low border-r border-outline-variant/10 shrink-0 transition-all duration-200 overflow-hidden ${
        isOpen ? "w-72" : "w-0"
      } max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:shadow-xl`}
    >
      <div className="flex flex-col h-full w-72">
        {/* Search */}
        <div className="px-4 pt-4 pb-2">
          <input
            type="text"
            placeholder={t("chat.search_rooms")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary transition-all placeholder:text-outline outline-none"
          />
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto min-h-0 px-2 py-2">
          {groups.length === 0 && (
            <div className="text-center text-sm text-on-surface-variant opacity-60 mt-8 px-4">
              {searchQuery.trim()
                ? t("chat.no_conversations_found")
                : t("chat.no_conversations_yet")}
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label} className="mb-3">
              <span className="px-4 text-[10px] uppercase tracking-[0.1em] font-bold text-on-surface-variant opacity-70">
                {GROUP_LABEL_KEYS[group.label] ? t(GROUP_LABEL_KEYS[group.label]) : group.label}
              </span>
              <div className="mt-1.5">
                {group.items.map((convo) => (
                  <ConversationItem
                    key={convo.id}
                    conversation={convo}
                    isActive={convo.id === activeId}
                    onSelect={() => onSelect(convo.id)}
                    onDelete={() => onDelete(convo.id)}
                    onRename={(title) => onRename(convo.id, title)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom help */}
        <div className="pt-3 mt-auto border-t border-outline-variant/10 px-4 pb-4 shrink-0">
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate("/docs")}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate("/docs"); }}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'wght' 300" }}>help</span>
            <span className="text-sm">{t("chat.help")}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
