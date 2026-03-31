export interface ChatModel {
  id: string;
  name: string;
  provider: string;
  avatarLetter: string;
  avatarBg: string;
  avatarText: string;
  description: string;
  contextWindow: string;
  inputCost: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  modelId: string;
  createdAt: number;
  updatedAt: number;
}

export const AVAILABLE_MODELS: ChatModel[] = [
  {
    id: "anthropic/claude-4-sonnet",
    name: "Claude 4 Sonnet",
    provider: "Anthropic",
    avatarLetter: "A",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-700",
    description: "Advanced reasoning with 200K context window",
    contextWindow: "200K",
    inputCost: "$3.00/1M",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    avatarLetter: "O",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-700",
    description: "Multimodal flagship with vision capabilities",
    contextWindow: "128K",
    inputCost: "$2.50/1M",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    avatarLetter: "G",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
    description: "Google's most capable model with long context",
    contextWindow: "1M",
    inputCost: "$1.25/1M",
  },
  {
    id: "deepseek/deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    avatarLetter: "D",
    avatarBg: "bg-indigo-100",
    avatarText: "text-indigo-700",
    description: "Best value for reasoning and code tasks",
    contextWindow: "164K",
    inputCost: "$0.32/1M",
  },
  {
    id: "meta/llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    avatarLetter: "L",
    avatarBg: "bg-purple-100",
    avatarText: "text-purple-700",
    description: "Open-source flagship for general tasks",
    contextWindow: "128K",
    inputCost: "$0.59/1M",
  },
  {
    id: "mistral/mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    avatarLetter: "M",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
    description: "European AI with strong multilingual support",
    contextWindow: "128K",
    inputCost: "$2.00/1M",
  },
];

const CODING_RESPONSES = [
  `Here's a clean implementation of a **debounce** function in TypeScript:

\`\`\`typescript
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
\`\`\`

**Key points:**
- Generic type \`T\` preserves the original function signature
- \`ReturnType<typeof setTimeout>\` works in both Node and browser
- Returns a new function with the same parameter types

You can use it like this:

\`\`\`typescript
const handleSearch = debounce((query: string) => {
  fetchResults(query);
}, 300);
\`\`\`

Let me know if you'd like me to add a \`cancel()\` method or leading-edge option!`,

  `Here's how I'd structure a **React custom hook** for fetching data:

\`\`\`typescript
import { useState, useEffect, useCallback } from "react";

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
}
\`\`\`

**Usage:**

\`\`\`tsx
const { data, isLoading } = useFetch<User[]>("/api/users");
\`\`\`

This covers the most common patterns. Want me to add caching or pagination support?`,
];

const EXPLANATION_RESPONSES = [
  `Great question! Let me break down **how React's reconciliation algorithm works**:

1. **Virtual DOM Diffing** — When state changes, React creates a new virtual DOM tree and compares it with the previous one
2. **Key-based matching** — Elements with the same \`key\` are compared directly; different keys trigger unmount/remount
3. **Component type check** — If the component type changes (e.g., \`<div>\` → \`<span>\`), React destroys the old tree and builds a new one

> The algorithm is O(n) because React makes two assumptions: elements of different types produce different trees, and keys hint at stable child identity.

**Practical implications:**
- Always use stable \`key\` props in lists (not array index)
- Avoid changing component types conditionally
- Use \`React.memo()\` to skip re-renders when props haven't changed

Here's a quick example of why keys matter:

\`\`\`tsx
// Bad - index as key causes bugs with reordering
{items.map((item, i) => <Item key={i} data={item} />)}

// Good - stable unique ID
{items.map((item) => <Item key={item.id} data={item} />)}
\`\`\``,

  `**WebSockets vs Server-Sent Events (SSE)** — here's a concise comparison:

| Feature | WebSocket | SSE |
|---------|-----------|-----|
| Direction | Bidirectional | Server → Client only |
| Protocol | \`ws://\` / \`wss://\` | HTTP |
| Reconnection | Manual | Automatic |
| Binary data | Yes | No (text only) |
| Browser support | Universal | Universal (except IE) |

**When to use WebSocket:**
- Real-time chat applications
- Multiplayer games
- Collaborative editing (like Google Docs)

**When to use SSE:**
- Live notifications / news feeds
- AI streaming responses (like this chat!)
- Stock price tickers

> **Rule of thumb:** If the client only needs to *receive* real-time data, SSE is simpler. If both sides need to send data, use WebSocket.

Most AI chat interfaces (including OpenRouter and ChatGPT) actually use SSE for streaming responses because the client only sends one request and receives a stream back.`,
];

const GENERAL_RESPONSES = [
  `I'd be happy to help! Here are a few things I can assist you with:

- **Code review & debugging** — paste your code and I'll analyze it
- **Architecture design** — let's discuss system design patterns
- **Explain concepts** — from basic to advanced topics
- **Write code** — give me requirements and I'll implement it

**Some popular topics today:**
1. Building AI-powered applications
2. React Server Components best practices
3. TypeScript advanced patterns
4. System design for scalable backends

What would you like to explore? Feel free to ask anything — I'm here to help! 🚀`,

  `That's an interesting question! Let me share my perspective:

**The key principle** is to start simple and iterate. Here's my recommended approach:

1. **Define the problem clearly** — Write down exactly what you're trying to solve
2. **Research existing solutions** — Don't reinvent the wheel
3. **Prototype quickly** — Build the simplest version that could work
4. **Get feedback early** — Show it to users before polishing

> "Premature optimization is the root of all evil." — Donald Knuth

The most successful projects I've seen follow this pattern:
- **Week 1**: Rough prototype with hardcoded data
- **Week 2**: Wire up real data, add core functionality
- **Week 3**: Polish UI, handle edge cases
- **Week 4**: Test, fix bugs, deploy

Would you like me to help you break down your specific project into these phases?`,

  `Here's a quick **Tailwind CSS cheat sheet** for common layouts:

**Centering:**
\`\`\`html
<!-- Flex center -->
<div class="flex items-center justify-center">

<!-- Grid center -->
<div class="grid place-items-center">
\`\`\`

**Responsive grid:**
\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

**Sticky header:**
\`\`\`html
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
\`\`\`

**Truncate text:**
\`\`\`html
<p class="truncate">Very long text...</p>
<!-- Multi-line -->
<p class="line-clamp-3">Multi-line truncation...</p>
\`\`\`

**Glass effect:**
\`\`\`html
<div class="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl">
\`\`\`

Need me to cover any specific layout pattern?`,
];

export function pickMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (
    lower.includes("code") ||
    lower.includes("function") ||
    lower.includes("implement") ||
    lower.includes("hook") ||
    lower.includes("component") ||
    lower.includes("typescript") ||
    lower.includes("react")
  ) {
    return CODING_RESPONSES[Math.floor(Math.random() * CODING_RESPONSES.length)];
  }
  if (
    lower.includes("explain") ||
    lower.includes("what is") ||
    lower.includes("how does") ||
    lower.includes("difference") ||
    lower.includes("compare") ||
    lower.includes("why")
  ) {
    return EXPLANATION_RESPONSES[Math.floor(Math.random() * EXPLANATION_RESPONSES.length)];
  }
  return GENERAL_RESPONSES[Math.floor(Math.random() * GENERAL_RESPONSES.length)];
}
