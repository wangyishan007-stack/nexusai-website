import { useState, useCallback, useRef, useEffect } from "react";
import type { Conversation, ChatMessage } from "../data/chatModels";
import { AVAILABLE_MODELS, pickMockResponse } from "../data/chatModels";

const STORAGE_KEY = "nexusai-chat-history";

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
  } catch {
    // silently fail on storage full
  }
}

function makeId(): string {
  return crypto.randomUUID();
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState(AVAILABLE_MODELS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // persist on change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const createNewChat = useCallback(() => {
    const id = makeId();
    const now = Date.now();
    const newConvo: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      modelId: selectedModelId,
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => [newConvo, ...prev]);
    setActiveId(id);
    return id;
  }, [selectedModelId]);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId],
  );

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  }, []);

  const updateConvoMessages = useCallback(
    (convoId: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? { ...c, messages: updater(c.messages), updatedAt: Date.now() }
            : c,
        ),
      );
    },
    [],
  );

  const streamResponse = useCallback(
    (convoId: string, msgId: string, fullText: string) => {
      abortRef.current = false;
      setIsGenerating(true);
      let index = 0;

      const tick = () => {
        if (abortRef.current) {
          // reveal all on abort
          updateConvoMessages(convoId, (msgs) =>
            msgs.map((m) =>
              m.id === msgId ? { ...m, content: fullText, isStreaming: false } : m,
            ),
          );
          setIsGenerating(false);
          return;
        }

        const chunkSize = Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1;
        index = Math.min(index + chunkSize, fullText.length);

        updateConvoMessages(convoId, (msgs) =>
          msgs.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  content: fullText.slice(0, index),
                  isStreaming: index < fullText.length,
                }
              : m,
          ),
        );

        if (index < fullText.length) {
          timerRef.current = setTimeout(tick, 15 + Math.random() * 25);
        } else {
          setIsGenerating(false);
        }
      };

      timerRef.current = setTimeout(tick, 300); // small initial delay
    },
    [updateConvoMessages],
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isGenerating) return;

      let convoId = activeId;
      if (!convoId) {
        convoId = createNewChat();
      }

      // auto-title from first message
      const isFirstMessage =
        conversations.find((c) => c.id === convoId)?.messages.length === 0;

      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      const assistantMsg: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: "",
        model: selectedModelId,
        timestamp: Date.now(),
        isStreaming: true,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convoId) return c;
          const title =
            isFirstMessage && c.title === "New Chat"
              ? content.trim().slice(0, 40)
              : c.title;
          return {
            ...c,
            title,
            modelId: selectedModelId,
            messages: [...c.messages, userMsg, assistantMsg],
            updatedAt: Date.now(),
          };
        }),
      );

      const mockResponse = pickMockResponse(content);
      streamResponse(convoId, assistantMsg.id, mockResponse);
    },
    [activeId, isGenerating, selectedModelId, conversations, createNewChat, streamResponse],
  );

  const stopGeneration = useCallback(() => {
    abortRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const regenerateLastResponse = useCallback(() => {
    if (!activeConversation || isGenerating) return;
    const msgs = activeConversation.messages;
    const lastAssistant = [...msgs].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;

    // find the user message before it
    const lastAssistantIdx = msgs.findIndex((m) => m.id === lastAssistant.id);
    const userMsg = msgs
      .slice(0, lastAssistantIdx)
      .reverse()
      .find((m) => m.role === "user");

    // remove old assistant message and add new streaming one
    const newAssistantId = makeId();
    updateConvoMessages(activeConversation.id, (prev) => [
      ...prev.filter((m) => m.id !== lastAssistant.id),
      {
        id: newAssistantId,
        role: "assistant",
        content: "",
        model: selectedModelId,
        timestamp: Date.now(),
        isStreaming: true,
      },
    ]);

    const mockResponse = pickMockResponse(userMsg?.content ?? "");
    streamResponse(activeConversation.id, newAssistantId, mockResponse);
  }, [activeConversation, isGenerating, selectedModelId, updateConvoMessages, streamResponse]);

  return {
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
  };
}
