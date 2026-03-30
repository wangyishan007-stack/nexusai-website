export const NAV_LINKS = [
  { label: "Models", href: "/models" },
  { label: "Chat", href: "/chat" },
  { label: "Rankings", href: "/rankings" },
  { label: "Apps", href: "/apps" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

export const STATS = [
  { value: "30T+", label: "Tokens Served" },
  { value: "5M+", label: "Active Users" },
  { value: "50+", label: "Providers" },
  { value: "300+", label: "LLM Models" },
];

export const PROVIDERS = [
  "OpenAI", "Anthropic", "Google", "Meta", "Mistral",
  "DeepSeek", "Qwen", "xAI", "Cohere", "Zhipu AI",
];

export const VALUE_PROPS = [
  {
    icon: "layers",
    title: "One API for Any Model",
    description: "Switch between providers by changing a single line in your config. No refactoring needed.",
  },
  {
    icon: "bolt",
    title: "Higher Availability",
    description: "Automatic failover and smart routing ensures your application stays up even if a provider goes down.",
  },
  {
    icon: "bar_chart",
    title: "Price & Performance",
    description: "Real-time cost optimization and low-latency routing to the best value data centers globally.",
  },
  {
    icon: "shield",
    title: "Custom Data Policies",
    description: "Enterprise-grade security with PII stripping, data residency controls, and audit logs.",
  },
];

export interface ModelCard {
  slug: string;
  name: string;
  provider: string;
  badge: string;
  badgeStyle: "new" | "popular" | "value";
  inputCost: string;
  context: string;
}

export const FEATURED_MODELS: ModelCard[] = [
  {
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    badge: "NEW",
    badgeStyle: "new",
    inputCost: "$3.00/1M",
    context: "200K",
  },
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    badge: "POPULAR",
    badgeStyle: "popular",
    inputCost: "$2.50/1M",
    context: "128K",
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    badge: "VALUE",
    badgeStyle: "value",
    inputCost: "$0.32/1M",
    context: "164K",
  },
];

export const SHOWCASE_APPS = [
  {
    name: "CodePilot",
    category: "Developer Tool",
    icon: "code",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4m1iX2r-xFzxUxFEVMKl3X4RHgiT0C-9Z8fRKJd6MzNBAEroQjAqTUoLUFJWBgaF_mFBiWfioFtu9r895d8AhIl5ZTMfvWtrDv0H0uDGPJttAHaEg7tPgzdXfihaCTDcX1n8_QUxSbQUbc_nCzwEQjWNNfgmeaXO2ia7bVF6DFykOH256nI-FIQWgDAwERNkj-aB-UFY0kUJ2XKU_1DbiVXmRkkqBFeA-zGf1iXBQIMQ51GzJCJhjnKbbXGnfZPu7Szy9UX_xJ_tX",
  },
  {
    name: "ResearchBot",
    category: "Research",
    icon: "schedule",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLxbWYuIQU_It64zswkgrHwQ9PFNoa7p5ZkYRXahvF2y8_bib0dENmXAxxSoKDZBPxILDnGJD_DtxN4AHnjBT2YFDipRSBFW2n36Bte4H5Uva2aBRCiFvI5Nax_xgek-IAhTLedsPsInThIQKVuMY2Kc5QLH-mbaquYja-XlnRZQ9I9NjbEf4OutHGE0nZxjP9CJNJbhcpC5az6ehkpBtyDmKGFPeqSAFzUNDN35zpJALqrgiJf7xEhMr5h-FL7eSmilvcsMfsejxt",
  },
  {
    name: "TranslateFlow",
    category: "Localization",
    icon: "language",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC63dw4rWzfhHcHZVI-w93zp5DOcim_SwkmJ3uP_IM7nfM53xUrdkiJrd51YeiO6RpGsg_oKCROOW9JbKZD7C-PJI5Jbu8jVdBolrF6EHViQqUByYgCrUZtq-m0nXNgCqILj9_1bHmb7gcAG4kDV7bHyxkIZA9joEfAJsxjhvwLzmyWbkd-z8V0FelidYhCQYcMNbq2bRjEQSh9jQIj_07-b4H3TXY0d-WqMvl374_r69adXd_JvIT42zLkRel4z-i3UpNimZ5NMnXE",
  },
];

export const GET_STARTED_STEPS = [
  {
    step: 1,
    title: "Signup",
    description: "Create an account and access our central developer dashboard.",
  },
  {
    step: 2,
    title: "Buy Credits",
    description: "Pay as you go with unified billing across all model providers.",
  },
  {
    step: 3,
    title: "Get Your API Key",
    description: "Instantly generate keys and start making requests using any standard SDK.",
  },
];

export const CODE_SNIPPET = `# Use OpenAI's SDK with NexusAI
import openai

client = openai.OpenAI(
    api_key="NEXUS_API_KEY",
    base_url="https://api.nexusai.com/v1"
)

response = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[{"role": "user", "content": "Hello!"}]
)`;

export const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Models", href: "/models" },
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Twitter (X)", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Discord", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];
