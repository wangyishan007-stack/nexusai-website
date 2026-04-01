import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
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
  const { t, i18n } = useTranslation();
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

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [openTabIds, setOpenTabIds] = useState<string[]>([]);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { isLoggedIn, login, logout, walletAddress, loginMethod, displayName } = useAuth();
  const { theme, setTheme } = useTheme();
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
      <header className="shrink-0 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 relative z-50">
        <div className="flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setShowMobileNav((prev) => !prev)}
              className="md:hidden p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {showMobileNav ? "close" : "menu"}
              </span>
            </button>
            <Link
              to="/"
              className="text-xl font-extrabold tracking-tight text-on-surface font-headline"
            >
              NexusAI
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.labelKey}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 text-white flex items-center justify-center text-[11px] font-bold ring-2 ring-white shadow-sm hover:opacity-90 transition-all"
              >
                {walletAddress ? (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
                ) : "WX"}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04),0px_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-[100]">
                  <div className="p-3 bg-surface-container-low flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                      {walletAddress ? (
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>account_balance_wallet</span>
                      ) : "WX"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-on-surface leading-tight">
                        {walletAddress ? displayName : t("userMenu.personal")}
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        {loginMethod === "wallet" ? t("userMenu.walletConnected") : t("userMenu.freePlan")}
                      </span>
                    </div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {[
                      { icon: "bar_chart", labelKey: "userMenu.activity", href: "/settings/activity" },
                      { icon: "format_list_bulleted", labelKey: "userMenu.logs", href: "/settings/logs" },
                      { icon: "credit_card", labelKey: "userMenu.credits", href: "/settings/credits" },
                      { icon: "settings", labelKey: "userMenu.settings", href: "/settings/preferences" },
                    ].map((item) => (
                      <Link key={item.labelKey} to={item.href} onClick={() => setShowUserMenu(false)} className="group flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" style={{ fontSize: 20 }}>{item.icon}</span>
                        {t(item.labelKey)}
                      </Link>
                    ))}
                  </div>
                  <div className="h-[1px] bg-surface-container-high mx-3" />
                  <div className="p-1.5">
                    <button onClick={() => { logout(); setShowUserMenu(false); }} className="group flex items-center gap-3 px-3 py-2 text-sm text-error/70 hover:text-error hover:bg-error/5 rounded-lg transition-colors w-full">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                      <span className="font-medium">{t("common.sign_out")}</span>
                    </button>
                  </div>
                  <div className="bg-surface-container-low p-3 space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant tracking-wider mb-2.5">{t("userMenu.systemAppearance")}</p>
                      <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-xl">
                        {([["light", "light_mode"], ["dark", "dark_mode"], ["system", "desktop_windows"]] as const).map(([mode, icon]) => (
                          <button
                            key={mode}
                            onClick={() => setTheme(mode)}
                            className={`flex items-center justify-center py-1.5 rounded-lg transition-all ${
                              theme === mode
                                ? "bg-surface-container-lowest shadow-sm text-primary"
                                : "text-on-surface-variant hover:bg-surface-container-low"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 18, ...(theme === mode ? { fontVariationSettings: "'FILL' 1" } : {}) }}
                            >{icon}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant tracking-wider mb-2.5">{t("userMenu.language")}</p>
                      <div className="grid grid-cols-2 gap-1 bg-surface-container p-1 rounded-xl">
                        {([["en", "English"], ["zh", "中文"]] as const).map(([lng, label]) => (
                          <button
                            key={lng}
                            onClick={() => i18n.changeLanguage(lng)}
                            className={`flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                              i18n.language.startsWith(lng)
                                ? "bg-surface-container-lowest shadow-sm text-primary"
                                : "text-on-surface-variant hover:bg-surface-container-low"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => i18n.changeLanguage(i18n.language.startsWith("zh") ? "en" : "zh")}
                className="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
              >
                {i18n.language.startsWith("zh") ? "EN" : "中文"}
              </button>
              <button onClick={() => setShowLogin(true)} className="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium">
                {t("common.sign_in")}
              </button>
              <Link to="/settings/api-keys" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all">
                {t("common.get_api_key")}
              </Link>
            </div>
          )}
        </div>
        {/* Mobile nav dropdown */}
        {showMobileNav && (
          <div className="md:hidden border-t border-outline-variant/10 px-4 py-3 flex flex-col gap-1 bg-surface-container-lowest">
            {visibleLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.labelKey}
                  to={link.href}
                  onClick={() => setShowMobileNav(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </div>
        )}
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
            const id = createNewChat();
            setOpenTabIds((prev) => [...prev, id]);
            setActiveId(id);
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
          <span>{t("chat.new_chat")}</span>
          <span className="hidden sm:inline bg-surface-container-high text-[9px] px-1.5 py-0.5 rounded font-mono">&#8984;/</span>
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

      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
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
