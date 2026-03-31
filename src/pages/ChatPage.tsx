import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { LoginModal } from "../components/LoginModal";
import { AVAILABLE_MODELS } from "../data/chatModels";
import { useChat } from "../hooks/useChat";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatEmptyState } from "../components/chat/ChatEmptyState";
import { ChatMessageList } from "../components/chat/ChatMessageList";
import { ChatInput } from "../components/chat/ChatInput";
import { ModelSelector } from "../components/chat/ModelSelector";

interface ChatPageProps {
  readonly className?: string;
}

export const ChatPage: React.FC<ChatPageProps> = ({ className = "" }) => {
  const { pathname } = useLocation();

  const {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    selectedModelId,
    setSelectedModelId,
    isGenerating,
    sendMessage,
    createNewChat,
    deleteConversation,
    renameConversation,
    stopGeneration,
    regenerateLastResponse,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openTabIds, setOpenTabIds] = useState<string[]>([]);
  const [modelModalOpen, setModelModalOpen] = useState(false);
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

  // Select a conversation — also open it as a tab
  const selectConversation = useCallback(
    (id: string) => {
      setActiveId(id);
      setOpenTabIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [setActiveId],
  );

  // Close a tab
  const closeTab = useCallback(
    (id: string) => {
      setOpenTabIds((prev) => {
        const next = prev.filter((t) => t !== id);
        if (activeId === id) {
          // Switch to adjacent tab or null
          const idx = prev.indexOf(id);
          const newActive = next[Math.min(idx, next.length - 1)] ?? null;
          setActiveId(newActive);
        }
        return next;
      });
    },
    [activeId, setActiveId],
  );

  // Delete: also remove from tabs
  const handleDelete = useCallback(
    (id: string) => {
      setOpenTabIds((prev) => prev.filter((t) => t !== id));
      deleteConversation(id);
    },
    [deleteConversation],
  );

  // When model is selected from modal or card, create a tab but stay on current view
  const handleModelChange = useCallback(
    (modelId: string) => {
      setSelectedModelId(modelId);
      const id = createNewChat();
      setOpenTabIds((prev) => [...prev, id]);
      // Keep showing the empty state / cards so user can add more models
      setActiveId(null);
    },
    [setSelectedModelId, createNewChat, setActiveId],
  );

  const hasMessages = (activeConversation?.messages.length ?? 0) > 0;

  // Resolve model info for tab avatars
  const getModelForConvo = (convoId: string) => {
    const convo = conversations.find((c) => c.id === convoId);
    return AVAILABLE_MODELS.find((m) => m.id === convo?.modelId);
  };

  return (
    <div
      className={`bg-surface text-on-background h-screen flex flex-col overflow-hidden ${className}`}
    >
      {/* Header */}
      <header className="shrink-0 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center justify-between px-6 h-16 max-w-[1600px] mx-auto">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-on-surface font-headline"
          >
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
                      ? "text-primary font-semibold"
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
            <div className="flex items-center gap-3">
              <button onClick={() => setShowLogin(true)} className="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">
                Sign In
              </button>
              <Link to="/settings/api-keys" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all">
                Get API Key
              </Link>
            </div>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />

      {/* Tab Bar */}
      <div className="shrink-0 flex items-center gap-0 px-2 h-12 bg-surface-container-lowest border-b border-outline-variant/10 overflow-x-auto">
        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0 mr-1"
          title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "16px" }}
          >
            {sidebarOpen ? "side_navigation" : "side_navigation"}
          </span>
        </button>

        {/* New Chat tab */}
        <button
          type="button"
          onClick={() => {
            setActiveId(null);
          }}
          className={`flex items-center gap-2 px-4 h-9 rounded-lg text-xs font-medium transition-colors shrink-0 mr-1 ${
            activeId === null
              ? "bg-surface-container text-on-surface"
              : "text-on-surface-variant hover:bg-surface-container-low"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "14px" }}
          >
            edit_square
          </span>
          <span>New Chat</span>
          <span className="bg-surface-container-high text-[9px] px-1.5 py-0.5 rounded font-mono">&#8984;/</span>
        </button>

        {/* Open conversation tabs */}
        {openTabIds.map((tabId) => {
          const convo = conversations.find((c) => c.id === tabId);
          if (!convo) return null;
          const model = getModelForConvo(tabId);
          const isActive = activeId === tabId;

          return (
            <div
              key={tabId}
              className={`flex items-center gap-2 px-3 h-9 rounded-lg text-xs font-medium transition-colors shrink-0 mr-1 cursor-pointer ${
                isActive
                  ? "bg-surface-container text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => selectConversation(tabId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  selectConversation(tabId);
              }}
            >
              {/* Model avatar */}
              {model && (
                <div
                  className={`w-4 h-4 rounded-sm ${model.avatarBg} ${model.avatarText} flex items-center justify-center text-[8px] font-bold shrink-0`}
                >
                  {model.avatarLetter}
                </div>
              )}
              <span className="truncate max-w-[140px]">
                {convo.title}
              </span>
              {/* Close tab */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tabId);
                }}
                className="p-0.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "16px" }}
                >
                  close
                </span>
              </button>
            </div>
          );
        })}

        {/* + Open model selector */}
        <button
          type="button"
          onClick={() => setModelModalOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
          title="Add model"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'wght' 300, 'opsz' 20", fontSize: "16px" }}
          >
            add
          </span>
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          isOpen={sidebarOpen}
          onSelect={selectConversation}
          onDelete={handleDelete}
          onRename={renameConversation}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-surface-container-lowest relative min-h-0">
          {/* Content: Empty state or message list */}
          {hasMessages ? (
            <ChatMessageList
              messages={activeConversation!.messages}
              selectedModelId={selectedModelId}
              isGenerating={isGenerating}
              onRegenerate={regenerateLastResponse}
            />
          ) : (
            <ChatEmptyState
              onPromptClick={sendMessage}
              onModelSelect={handleModelChange}
            />
          )}

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            isGenerating={isGenerating}
            onStop={stopGeneration}
          />
        </main>
      </div>

      {/* Model Selector Modal */}
      <ModelSelector
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        selectedModelId={selectedModelId}
        onChange={handleModelChange}
      />

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};
