export const NAV_LINKS = [
  { labelKey: "nav.models", href: "/models" },
  { labelKey: "nav.chat", href: "/chat" },
  { labelKey: "nav.rankings", href: "/rankings" },
  { labelKey: "nav.apps", href: "/apps" },
  { labelKey: "nav.pricing", href: "/pricing" },
  { labelKey: "nav.docs", href: "/docs" },
];

export const STATS = [
  { value: "30T+", labelKey: "stats.tokensServed" },
  { value: "5M+", labelKey: "stats.activeUsers" },
  { value: "50+", labelKey: "stats.providers" },
  { value: "300+", labelKey: "stats.llmModels" },
];

export const PROVIDERS = [
  "OpenAI", "Anthropic", "Google", "Meta", "Mistral",
  "DeepSeek", "Qwen", "xAI", "Cohere", "Zhipu AI",
];

export const VALUE_PROPS = [
  { icon: "layers", titleKey: "valueProps.oneApi_title", descKey: "valueProps.oneApi_desc" },
  { icon: "bolt", titleKey: "valueProps.availability_title", descKey: "valueProps.availability_desc" },
  { icon: "bar_chart", titleKey: "valueProps.pricePerformance_title", descKey: "valueProps.pricePerformance_desc" },
  { icon: "shield", titleKey: "valueProps.dataPolicies_title", descKey: "valueProps.dataPolicies_desc" },
];

export interface ModelCard {
  slug: string;
  name: string;
  provider: string;
  badgeKey: string;
  badgeStyle: "new" | "popular" | "value";
  inputCost: string;
  context: string;
}

export const FEATURED_MODELS: ModelCard[] = [
  {
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    badgeKey: "featuredModels.badgeNew",
    badgeStyle: "new",
    inputCost: "$3.00/1M",
    context: "200K",
  },
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    badgeKey: "featuredModels.badgePopular",
    badgeStyle: "popular",
    inputCost: "$2.50/1M",
    context: "128K",
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    badgeKey: "featuredModels.badgeValue",
    badgeStyle: "value",
    inputCost: "$0.32/1M",
    context: "164K",
  },
];

export const SHOWCASE_APPS = [
  {
    name: "CodePilot",
    categoryKey: "showcase.catDeveloperTool",
    icon: "code",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4m1iX2r-xFzxUxFEVMKl3X4RHgiT0C-9Z8fRKJd6MzNBAEroQjAqTUoLUFJWBgaF_mFBiWfioFtu9r895d8AhIl5ZTMfvWtrDv0H0uDGPJttAHaEg7tPgzdXfihaCTDcX1n8_QUxSbQUbc_nCzwEQjWNNfgmeaXO2ia7bVF6DFykOH256nI-FIQWgDAwERNkj-aB-UFY0kUJ2XKU_1DbiVXmRkkqBFeA-zGf1iXBQIMQ51GzJCJhjnKbbXGnfZPu7Szy9UX_xJ_tX",
  },
  {
    name: "ResearchBot",
    categoryKey: "showcase.catResearch",
    icon: "schedule",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLxbWYuIQU_It64zswkgrHwQ9PFNoa7p5ZkYRXahvF2y8_bib0dENmXAxxSoKDZBPxILDnGJD_DtxN4AHnjBT2YFDipRSBFW2n36Bte4H5Uva2aBRCiFvI5Nax_xgek-IAhTLedsPsInThIQKVuMY2Kc5QLH-mbaquYja-XlnRZQ9I9NjbEf4OutHGE0nZxjP9CJNJbhcpC5az6ehkpBtyDmKGFPeqSAFzUNDN35zpJALqrgiJf7xEhMr5h-FL7eSmilvcsMfsejxt",
  },
  {
    name: "TranslateFlow",
    categoryKey: "showcase.catLocalization",
    icon: "language",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC63dw4rWzfhHcHZVI-w93zp5DOcim_SwkmJ3uP_IM7nfM53xUrdkiJrd51YeiO6RpGsg_oKCROOW9JbKZD7C-PJI5Jbu8jVdBolrF6EHViQqUByYgCrUZtq-m0nXNgCqILj9_1bHmb7gcAG4kDV7bHyxkIZA9joEfAJsxjhvwLzmyWbkd-z8V0FelidYhCQYcMNbq2bRjEQSh9jQIj_07-b4H3TXY0d-WqMvl374_r69adXd_JvIT42zLkRel4z-i3UpNimZ5NMnXE",
  },
];

export const GET_STARTED_STEPS = [
  { step: 1, titleKey: "getStarted.step1_title", descKey: "getStarted.step1_desc" },
  { step: 2, titleKey: "getStarted.step2_title", descKey: "getStarted.step2_desc" },
  { step: 3, titleKey: "getStarted.step3_title", descKey: "getStarted.step3_desc" },
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
    titleKey: "footer.product",
    links: [
      { labelKey: "footer.models", href: "/models" },
      { labelKey: "nav.pricing", href: "/pricing" },
      { labelKey: "footer.documentation", href: "/docs" },
      { labelKey: "footer.status", href: "#" },
    ],
  },
  {
    titleKey: "footer.company",
    links: [
      { labelKey: "footer.aboutUs", href: "#" },
      { labelKey: "footer.careers", href: "#" },
      { labelKey: "footer.blog", href: "#" },
      { labelKey: "footer.contact", href: "#" },
    ],
  },
  {
    titleKey: "footer.connect",
    links: [
      { labelKey: "footer.twitterX", href: "#" },
      { labelKey: "footer.github", href: "#" },
      { labelKey: "footer.discord", href: "#" },
      { labelKey: "footer.linkedin", href: "#" },
    ],
  },
];
