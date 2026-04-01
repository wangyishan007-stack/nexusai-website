import { useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

/* ═══════════════════ Types ═══════════════════ */

interface ModelDetailPageProps {
  readonly className?: string;
}

interface Provider {
  initial: string;
  bgColor: string;
  textColor: string;
  name: string;
  inputCost: string;
  outputCost: string;
  cachePricing: string;
  modelVariant: string;
  contextLength: string;
  maxOutput: string;
  latency: number;
  throughput: number;
  uptime: number;
  dataPolicy: string;
  byok: boolean;
}

interface DetailedBenchmark {
  name: string;
  category: string;
  score: string;
}

interface AppInfo {
  name: string;
  requests: string;
  pct: number;
}

interface RelatedModel {
  name: string;
  slug: string;
  desc: string;
  price: string;
}

interface ModelData {
  name: string;
  provider: string;
  modelId: string;
  description: string;
  created: string;
  contextLength: string;
  maxOutput: string;
  inputPrice: string;
  outputPrice: string;
  cachePrice: string;
  knowledgeCutoff: string;
  inputModalities: string[];
  outputModalities: string[];
  providers: Provider[];
  detailedBenchmarks: DetailedBenchmark[];
  apps: AppInfo[];
  activity: { prompt: number; completion: number; other: number }[];
  uptimeDays: number[];
  relatedModels: RelatedModel[];
  code: Record<CodeLang, string>;
}

type CodeLang = "python" | "nodejs" | "curl";
type SectionTab = { labelKey: string; id: string | null };

const CODE_LANG_LABELS: Record<CodeLang, string> = {
  python: "Python",
  nodejs: "Node.js",
  curl: "cURL",
};

const SECTION_TABS: SectionTab[] = [
  { labelKey: "modelDetail.tab_overview", id: null },
  { labelKey: "modelDetail.tab_playground", id: "api" },
  { labelKey: "modelDetail.tab_providers", id: "providers" },
  { labelKey: "modelDetail.tab_performance", id: "performance" },
  { labelKey: "modelDetail.tab_pricing", id: "pricing" },
  { labelKey: "modelDetail.tab_apps", id: "apps" },
  { labelKey: "modelDetail.tab_activity", id: "activity" },
  { labelKey: "modelDetail.tab_uptime", id: "uptime" },
  { labelKey: "modelDetail.tab_quickstart", id: "api" },
];

const SUPPORTED_PARAMS = [
  { name: "temperature", type: "float", desc: "Sampling temperature (0-2). Higher = more random." },
  { name: "top_p", type: "float", desc: "Nucleus sampling. Alternative to temperature." },
  { name: "max_tokens", type: "integer", desc: "Maximum number of tokens to generate." },
  { name: "stop_sequences", type: "string[]", desc: "Sequences where the model stops generating." },
  { name: "stream", type: "boolean", desc: "Stream partial responses via SSE." },
  { name: "seed", type: "integer", desc: "Seed for deterministic sampling." },
];

const DAYS_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* 30-day activity data generator — produces realistic-looking usage curves */
function genActivity(peak: number, tail: number, spike?: number): { prompt: number; completion: number; other: number }[] {
  const days: { prompt: number; completion: number; other: number }[] = [];
  for (let i = 0; i < 30; i++) {
    let base: number;
    if (i < 5) base = peak * (0.7 + Math.sin(i * 0.8) * 0.3);
    else if (i < 10) base = peak * 0.5 * (1 - (i - 5) * 0.12);
    else if (i < 25) base = tail * (0.8 + (i % 3) * 0.1);
    else base = (spike ?? tail) * (0.6 + (i - 24) * 0.15);
    base = Math.max(base, tail * 0.3);
    const prompt = Math.round(base * 0.6);
    const completion = Math.round(base * 0.3);
    const other = Math.round(base * 0.1);
    days.push({ prompt, completion, other });
  }
  return days;
}

/* ═══════════════════ Model Data ═══════════════════ */

const MODEL_DATA: Record<string, ModelData> = {
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    modelId: "anthropic/claude-3.5-sonnet",
    description:
      "Claude 3.5 Sonnet is Anthropic's most balanced model, excelling at coding, analysis, and complex reasoning tasks. It strikes the perfect equilibrium between intelligence and speed, making it the ideal choice for enterprise-scale deployments. With a 200K context window and advanced tool use capabilities, it can handle complex multi-step workflows, generate production-quality code, and process lengthy documents with exceptional accuracy.",
    created: "Jun 20, 2024",
    contextLength: "200,000",
    maxOutput: "8,192",
    inputPrice: "$3.00",
    outputPrice: "$15.00",
    cachePrice: "$0.30",
    knowledgeCutoff: "Apr 2024",
    inputModalities: ["Text", "Image", "File"],
    outputModalities: ["Text"],
    providers: [
      { initial: "A", bgColor: "bg-surface-container-highest", textColor: "text-on-surface", name: "Anthropic Direct", inputCost: "$3.00", outputCost: "$15.00", cachePricing: "$0.30", modelVariant: "claude-3-5-sonnet-20241022", contextLength: "200K", maxOutput: "8,192", latency: 1.2, throughput: 82, uptime: 99.9, dataPolicy: "Zero Retention", byok: true },
      { initial: "AWS", bgColor: "bg-orange-100", textColor: "text-orange-600", name: "Amazon Bedrock", inputCost: "$3.00", outputCost: "$15.00", cachePricing: "$0.30", modelVariant: "anthropic.claude-3-5-sonnet-v2", contextLength: "200K", maxOutput: "8,192", latency: 1.5, throughput: 68, uptime: 99.7, dataPolicy: "HIPAA Eligible", byok: false },
      { initial: "GCP", bgColor: "bg-blue-100", textColor: "text-blue-600", name: "Google Vertex AI", inputCost: "$3.10", outputCost: "$15.50", cachePricing: "$0.31", modelVariant: "claude-3-5-sonnet@20241022", contextLength: "200K", maxOutput: "8,192", latency: 1.4, throughput: 74, uptime: 99.8, dataPolicy: "SOC2 Type II", byok: true },
    ],
    detailedBenchmarks: [
      { name: "MMLU", category: "Knowledge", score: "88.7%" },
      { name: "HumanEval", category: "Coding", score: "92.0%" },
      { name: "MATH", category: "Mathematics", score: "71.1%" },
      { name: "GSM8K", category: "Math Reasoning", score: "95.3%" },
      { name: "ARC-Challenge", category: "Science", score: "96.4%" },
      { name: "HellaSwag", category: "Commonsense", score: "95.2%" },
      { name: "WinoGrande", category: "Commonsense", score: "87.5%" },
      { name: "TruthfulQA", category: "Truthfulness", score: "73.8%" },
    ],
    apps: [
      { name: "Claude Code Studio", requests: "14.2K", pct: 98 },
      { name: "AI Pair Programmer", requests: "9.8K", pct: 72 },
      { name: "Doc Analyzer Pro", requests: "7.3K", pct: 54 },
      { name: "Cursor IDE", requests: "6.1K", pct: 45 },
      { name: "Code Review Bot", requests: "4.5K", pct: 33 },
    ],
    activity: genActivity(14000, 400, 2000),
    uptimeDays: [100, 100, 100, 99.9, 100, 100, 100, 99.8, 100, 100, 100, 100, 100, 99.5, 100, 100, 100, 100, 100, 100, 99.9, 100, 100, 100, 100, 100, 100, 100, 99.7, 100],
    relatedModels: [
      { name: "Claude 3 Opus", slug: "claude-3-opus", desc: "Most powerful Claude model for highly complex tasks.", price: "$15.00 / $75.00" },
      { name: "Claude 3 Haiku", slug: "claude-3-haiku", desc: "Fastest and most compact model for near-instant responsiveness.", price: "$0.25 / $1.25" },
      { name: "Claude Sonnet 4", slug: "claude-sonnet-4", desc: "Latest generation balanced model with improved reasoning.", price: "$3.00 / $15.00" },
    ],
    code: {
      python: `import nexusai

client = nexusai.NexusAI(api_key="YOUR_NEXUS_KEY")

response = client.chat.completions.create(
    model="anthropic/claude-3.5-sonnet",
    messages=[
        {"role": "system", "content": "You are an expert dev."},
        {"role": "user", "content": "Optimize this React hook."}
    ],
    temperature=0.7,
    max_tokens=4096
)

print(response.choices[0].message.content)`,
      nodejs: `import NexusAI from "nexusai";

const client = new NexusAI({ apiKey: "YOUR_NEXUS_KEY" });

const response = await client.chat.completions.create({
  model: "anthropic/claude-3.5-sonnet",
  messages: [
    { role: "system", content: "You are an expert dev." },
    { role: "user", content: "Optimize this React hook." },
  ],
  temperature: 0.7,
  max_tokens: 4096,
});

console.log(response.choices[0].message.content);`,
      curl: `curl -X POST https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_NEXUS_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [
      {"role": "system", "content": "You are an expert dev."},
      {"role": "user", "content": "Optimize this React hook."}
    ],
    "temperature": 0.7,
    "max_tokens": 4096
  }'`,
    },
  },
  "gpt-4o": {
    name: "GPT-4o",
    provider: "OpenAI",
    modelId: "openai/gpt-4o",
    description:
      "GPT-4o is OpenAI's flagship multimodal model. It accepts text, image, and audio inputs and generates text and audio outputs. It's the fastest and most affordable frontier model, with strong performance across vision, audio understanding, and multilingual tasks. GPT-4o achieves GPT-4 Turbo-level performance on text in English and code, with significant improvement on non-English languages.",
    created: "May 13, 2024",
    contextLength: "128,000",
    maxOutput: "16,384",
    inputPrice: "$2.50",
    outputPrice: "$10.00",
    cachePrice: "$1.25",
    knowledgeCutoff: "Oct 2023",
    inputModalities: ["Text", "Image", "Audio"],
    outputModalities: ["Text", "Audio"],
    providers: [
      { initial: "OAI", bgColor: "bg-surface-container-highest", textColor: "text-on-surface", name: "OpenAI Direct", inputCost: "$2.50", outputCost: "$10.00", cachePricing: "$1.25", modelVariant: "gpt-4o-2024-08-06", contextLength: "128K", maxOutput: "16,384", latency: 0.8, throughput: 105, uptime: 99.9, dataPolicy: "Zero Retention", byok: true },
      { initial: "AZ", bgColor: "bg-blue-100", textColor: "text-blue-600", name: "Azure OpenAI", inputCost: "$2.50", outputCost: "$10.00", cachePricing: "$1.25", modelVariant: "gpt-4o-2024-08-06", contextLength: "128K", maxOutput: "16,384", latency: 0.9, throughput: 98, uptime: 99.8, dataPolicy: "Enterprise", byok: false },
      { initial: "TG", bgColor: "bg-green-100", textColor: "text-green-600", name: "Together AI", inputCost: "$2.00", outputCost: "$8.00", cachePricing: "N/A", modelVariant: "openai/gpt-4o", contextLength: "128K", maxOutput: "16,384", latency: 1.1, throughput: 88, uptime: 99.5, dataPolicy: "Standard", byok: false },
      { initial: "FR", bgColor: "bg-purple-100", textColor: "text-purple-600", name: "Fireworks AI", inputCost: "$2.20", outputCost: "$8.80", cachePricing: "N/A", modelVariant: "accounts/openai/models/gpt-4o", contextLength: "128K", maxOutput: "16,384", latency: 1.0, throughput: 92, uptime: 99.4, dataPolicy: "Standard", byok: false },
    ],
    detailedBenchmarks: [
      { name: "MMLU", category: "Knowledge", score: "88.7%" },
      { name: "HumanEval", category: "Coding", score: "90.2%" },
      { name: "MATH", category: "Mathematics", score: "76.6%" },
      { name: "GSM8K", category: "Math Reasoning", score: "97.8%" },
      { name: "ARC-Challenge", category: "Science", score: "96.7%" },
      { name: "HellaSwag", category: "Commonsense", score: "95.6%" },
      { name: "WinoGrande", category: "Commonsense", score: "88.1%" },
      { name: "TruthfulQA", category: "Truthfulness", score: "76.2%" },
    ],
    apps: [
      { name: "ChatGPT Plus", requests: "22.1K", pct: 98 },
      { name: "Perplexity AI", requests: "15.6K", pct: 72 },
      { name: "Copilot Pro", requests: "11.4K", pct: 54 },
      { name: "Galaxy.ai", requests: "8.2K", pct: 39 },
      { name: "InkyTavern", requests: "5.8K", pct: 27 },
    ],
    activity: genActivity(18000, 600, 3500),
    uptimeDays: [100, 100, 99.9, 100, 100, 100, 100, 100, 99.8, 100, 100, 100, 100, 100, 100, 99.9, 100, 100, 100, 100, 100, 100, 100, 99.7, 100, 100, 100, 100, 100, 100],
    relatedModels: [
      { name: "GPT-4o Mini", slug: "gpt-4o-mini", desc: "Small model for fast, lightweight tasks at lower cost.", price: "$0.15 / $0.60" },
      { name: "GPT-4 Turbo", slug: "gpt-4-turbo", desc: "Previous generation with 128K context and vision.", price: "$10.00 / $30.00" },
      { name: "o1", slug: "o1", desc: "Reasoning model that thinks before answering complex questions.", price: "$15.00 / $60.00" },
    ],
    code: {
      python: `import nexusai

client = nexusai.NexusAI(api_key="YOUR_NEXUS_KEY")

response = client.chat.completions.create(
    model="openai/gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing simply."}
    ],
    temperature=0.8,
    max_tokens=2048
)

print(response.choices[0].message.content)`,
      nodejs: `import NexusAI from "nexusai";

const client = new NexusAI({ apiKey: "YOUR_NEXUS_KEY" });

const response = await client.chat.completions.create({
  model: "openai/gpt-4o",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Explain quantum computing simply." },
  ],
  temperature: 0.8,
  max_tokens: 2048,
});

console.log(response.choices[0].message.content);`,
      curl: `curl -X POST https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_NEXUS_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "openai/gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing simply."}
    ],
    "temperature": 0.8,
    "max_tokens": 2048
  }'`,
    },
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    modelId: "deepseek/deepseek-v3",
    description:
      "DeepSeek V3 delivers exceptional value with near-frontier performance at a fraction of the cost. With 671B MoE parameters and 37B active, it excels at coding, math, and multilingual tasks while maintaining remarkably low inference costs. It uses innovative Multi-Head Latent Attention (MLA) and DeepSeekMoE architectures for efficient inference.",
    created: "Dec 26, 2024",
    contextLength: "164,000",
    maxOutput: "8,192",
    inputPrice: "$0.32",
    outputPrice: "$1.28",
    cachePrice: "$0.07",
    knowledgeCutoff: "Dec 2024",
    inputModalities: ["Text"],
    outputModalities: ["Text"],
    providers: [
      { initial: "DS", bgColor: "bg-surface-container-highest", textColor: "text-on-surface", name: "DeepSeek Direct", inputCost: "$0.32", outputCost: "$1.28", cachePricing: "$0.07", modelVariant: "deepseek-chat", contextLength: "164K", maxOutput: "8,192", latency: 2.1, throughput: 145, uptime: 99.2, dataPolicy: "Standard", byok: false },
      { initial: "TG", bgColor: "bg-green-100", textColor: "text-green-600", name: "Together AI", inputCost: "$0.40", outputCost: "$1.60", cachePricing: "N/A", modelVariant: "deepseek-ai/DeepSeek-V3", contextLength: "164K", maxOutput: "8,192", latency: 1.8, throughput: 120, uptime: 99.5, dataPolicy: "Standard", byok: false },
      { initial: "FR", bgColor: "bg-purple-100", textColor: "text-purple-600", name: "Fireworks AI", inputCost: "$0.35", outputCost: "$1.40", cachePricing: "N/A", modelVariant: "accounts/fireworks/models/deepseek-v3", contextLength: "164K", maxOutput: "8,192", latency: 1.5, throughput: 135, uptime: 99.4, dataPolicy: "Standard", byok: false },
      { initial: "NV", bgColor: "bg-surface-container-highest", textColor: "text-on-surface", name: "NVIDIA NIM", inputCost: "$0.38", outputCost: "$1.52", cachePricing: "N/A", modelVariant: "deepseek-ai/deepseek-v3", contextLength: "164K", maxOutput: "8,192", latency: 1.6, throughput: 130, uptime: 99.3, dataPolicy: "Enterprise", byok: false },
      { initial: "HF", bgColor: "bg-orange-100", textColor: "text-orange-600", name: "Hugging Face", inputCost: "$0.30", outputCost: "$1.20", cachePricing: "N/A", modelVariant: "deepseek-ai/DeepSeek-V3", contextLength: "164K", maxOutput: "8,192", latency: 2.5, throughput: 95, uptime: 98.8, dataPolicy: "Standard", byok: false },
    ],
    detailedBenchmarks: [
      { name: "MMLU", category: "Knowledge", score: "87.1%" },
      { name: "HumanEval", category: "Coding", score: "82.6%" },
      { name: "MATH", category: "Mathematics", score: "90.2%" },
      { name: "GSM8K", category: "Math Reasoning", score: "96.5%" },
      { name: "ARC-Challenge", category: "Science", score: "91.4%" },
      { name: "HellaSwag", category: "Commonsense", score: "88.9%" },
      { name: "WinoGrande", category: "Commonsense", score: "84.7%" },
      { name: "TruthfulQA", category: "Truthfulness", score: "65.3%" },
    ],
    apps: [
      { name: "MathSolver Pro", requests: "6.8K", pct: 98 },
      { name: "Code Architect", requests: "5.2K", pct: 78 },
      { name: "Research Assistant", requests: "4.1K", pct: 62 },
      { name: "Multilingual Chat", requests: "3.3K", pct: 50 },
      { name: "DataPipeline AI", requests: "2.1K", pct: 32 },
    ],
    activity: genActivity(10000, 300, 1500),
    uptimeDays: [100, 100, 99.5, 100, 100, 99.8, 100, 100, 100, 99.2, 100, 100, 100, 100, 99.9, 100, 100, 100, 100, 100, 100, 99.5, 100, 100, 100, 100, 100, 99.8, 100, 100],
    relatedModels: [
      { name: "DeepSeek V2.5", slug: "deepseek-v2-5", desc: "Previous generation model with strong coding performance.", price: "$0.14 / $0.28" },
      { name: "DeepSeek R1", slug: "deepseek-r1", desc: "Reasoning model with chain-of-thought for complex problems.", price: "$0.55 / $2.19" },
      { name: "DeepSeek Coder V2", slug: "deepseek-coder-v2", desc: "Specialized coding model with 236B MoE parameters.", price: "$0.14 / $0.28" },
    ],
    code: {
      python: `import nexusai

client = nexusai.NexusAI(api_key="YOUR_NEXUS_KEY")

response = client.chat.completions.create(
    model="deepseek/deepseek-v3",
    messages=[
        {"role": "system", "content": "You are a math tutor."},
        {"role": "user", "content": "Prove the Pythagorean theorem."}
    ],
    temperature=0.3,
    max_tokens=4096
)

print(response.choices[0].message.content)`,
      nodejs: `import NexusAI from "nexusai";

const client = new NexusAI({ apiKey: "YOUR_NEXUS_KEY" });

const response = await client.chat.completions.create({
  model: "deepseek/deepseek-v3",
  messages: [
    { role: "system", content: "You are a math tutor." },
    { role: "user", content: "Prove the Pythagorean theorem." },
  ],
  temperature: 0.3,
  max_tokens: 4096,
});

console.log(response.choices[0].message.content);`,
      curl: `curl -X POST https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_NEXUS_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek/deepseek-v3",
    "messages": [
      {"role": "system", "content": "You are a math tutor."},
      {"role": "user", "content": "Prove the Pythagorean theorem."}
    ],
    "temperature": 0.3,
    "max_tokens": 4096
  }'`,
    },
  },
};

const DEFAULT_MODEL_ID = "anthropic/claude-sonnet-4";

const DEFAULT_MODEL: ModelData = {
  name: "Claude Sonnet 4",
  provider: "Anthropic",
  modelId: DEFAULT_MODEL_ID,
  description:
    "Claude Sonnet 4 is Anthropic's most balanced model, excelling at coding, analysis, and complex reasoning tasks. It strikes the perfect equilibrium between intelligence and speed, making it the ideal choice for enterprise-scale deployments. Built on the latest Constitutional AI research, it offers a 200K context window, native tool use, and improved instruction following.",
  created: "May 22, 2025",
  contextLength: "200,000",
  maxOutput: "64,000",
  inputPrice: "$3.00",
  outputPrice: "$15.00",
  cachePrice: "$0.30",
  knowledgeCutoff: "Mar 2025",
  inputModalities: ["Text", "Image", "File"],
  outputModalities: ["Text"],
  providers: [
    { initial: "A", bgColor: "bg-surface-container-highest", textColor: "text-on-surface", name: "Anthropic Direct", inputCost: "$3.00", outputCost: "$15.00", cachePricing: "$0.30", modelVariant: "claude-sonnet-4-20250514", contextLength: "200K", maxOutput: "64,000", latency: 1.1, throughput: 90, uptime: 99.9, dataPolicy: "Zero Retention", byok: true },
    { initial: "AWS", bgColor: "bg-orange-100", textColor: "text-orange-600", name: "Amazon Bedrock", inputCost: "$3.00", outputCost: "$15.00", cachePricing: "$0.30", modelVariant: "anthropic.claude-sonnet-4-v1", contextLength: "200K", maxOutput: "64,000", latency: 1.3, throughput: 78, uptime: 99.7, dataPolicy: "HIPAA Eligible", byok: false },
    { initial: "GCP", bgColor: "bg-blue-100", textColor: "text-blue-600", name: "Google Vertex AI", inputCost: "$3.10", outputCost: "$15.50", cachePricing: "$0.31", modelVariant: "claude-sonnet-4@20250514", contextLength: "200K", maxOutput: "64,000", latency: 1.2, throughput: 82, uptime: 99.8, dataPolicy: "SOC2 Type II", byok: true },
  ],
  detailedBenchmarks: [
    { name: "MMLU", category: "Knowledge", score: "88.7%" },
    { name: "HumanEval", category: "Coding", score: "92.3%" },
    { name: "MATH", category: "Mathematics", score: "76.1%" },
    { name: "GSM8K", category: "Math Reasoning", score: "96.1%" },
    { name: "ARC-Challenge", category: "Science", score: "97.0%" },
    { name: "HellaSwag", category: "Commonsense", score: "95.8%" },
    { name: "WinoGrande", category: "Commonsense", score: "88.3%" },
    { name: "TruthfulQA", category: "Truthfulness", score: "75.2%" },
  ],
  apps: [
    { name: "AI Code Assistant", requests: "12.4K", pct: 98 },
    { name: "Claude Studio", requests: "8.7K", pct: 72 },
    { name: "Enterprise Chat", requests: "6.3K", pct: 52 },
    { name: "Doc Processor", requests: "4.8K", pct: 40 },
    { name: "API Gateway Pro", requests: "3.2K", pct: 26 },
  ],
  activity: genActivity(16000, 500, 2500),
  uptimeDays: [100, 100, 100, 100, 100, 100, 99.9, 100, 100, 100, 100, 100, 100, 100, 100, 100, 99.8, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  relatedModels: [
    { name: "Claude Opus 4", slug: "claude-opus-4", desc: "Most powerful Claude model for complex tasks and agentic workflows.", price: "$15.00 / $75.00" },
    { name: "Claude 3.5 Haiku", slug: "claude-3-5-haiku", desc: "Fastest Claude model for near-instant responsiveness.", price: "$0.80 / $4.00" },
    { name: "Claude 3.5 Sonnet", slug: "claude-3-5-sonnet", desc: "Previous generation balanced model with strong coding.", price: "$3.00 / $15.00" },
  ],
  code: {
    python: `import nexusai

client = nexusai.NexusAI(api_key="YOUR_NEXUS_KEY")

response = client.chat.completions.create(
    model="${DEFAULT_MODEL_ID}",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)`,
    nodejs: `import NexusAI from "nexusai";

const client = new NexusAI({ apiKey: "YOUR_NEXUS_KEY" });

const response = await client.chat.completions.create({
  model: "${DEFAULT_MODEL_ID}",
  messages: [{ role: "user", content: "Hello" }],
});

console.log(response.choices[0].message.content);`,
    curl: `curl -X POST https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_NEXUS_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${DEFAULT_MODEL_ID}",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
  },
};

/* ═══════════════════ Component ═══════════════════ */

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const m: ModelData = (id ? MODEL_DATA[id] : undefined) ?? DEFAULT_MODEL;

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [codeLang, setCodeLang] = useState<CodeLang>("python");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);

  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const scrollTo = useCallback((sectionId: string | null) => {
    setActiveSection(sectionId);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const maxThroughput = Math.max(...m.providers.map((p) => p.throughput));
  const maxLatency = Math.max(...m.providers.map((p) => p.latency));

  const avgUptime = (m.uptimeDays.reduce((a, b) => a + b, 0) / m.uptimeDays.length).toFixed(2);

  return (
    <div className={`bg-background text-on-background ${className}`}>
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant font-label">
          <Link className="hover:text-primary transition-colors" to="/models">{t("modelDetail.breadcrumb_models")}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary transition-colors" to={`/providers/${m.provider.toLowerCase()}`}>{m.provider}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-semibold">{m.name}</span>
        </nav>

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-extrabold font-headline tracking-tight text-on-background">{m.name}</h1>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap text-on-surface-variant">
                <code className="px-2 py-0.5 bg-surface-container rounded text-xs font-mono">{m.modelId}</code>
                <button onClick={() => copyToClipboard(m.modelId, "model-id")} className="p-0.5 hover:bg-surface-container-high rounded transition-colors" title="Copy ID">
                  <span className="material-symbols-outlined text-sm">{copiedId === "model-id" ? "check" : "content_copy"}</span>
                </button>
                <span className="text-[10px] text-on-surface-variant">|</span>
                {m.inputModalities.map((mod) => (
                  <span key={`in-${mod}`} className="px-1.5 py-0.5 bg-surface-container text-[10px] font-semibold rounded">{mod}</span>
                ))}
                <span className="material-symbols-outlined text-xs text-on-surface-variant">arrow_forward</span>
                {m.outputModalities.map((mod) => (
                  <span key={`out-${mod}`} className="px-1.5 py-0.5 bg-surface-container text-[10px] font-semibold rounded">{mod}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              {t("modelDetail.chat")}
            </button>
            <button
              onClick={() => navigate(`/compare?model=${id ?? ""}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-container-highest transition-all text-sm"
            >
              <span className="material-symbols-outlined text-lg">compare_arrows</span>
              {t("modelDetail.compare")}
            </button>
          </div>
        </div>

        {/* Description (collapsible) */}
        <div className="mb-8 max-w-3xl">
          <div className={`overflow-hidden transition-all duration-300 ${descExpanded ? "max-h-[500px]" : "max-h-[3.2rem]"}`}>
            <p className="text-sm text-on-surface-variant leading-relaxed">{m.description}</p>
          </div>
          {m.description.length > 180 && (
            <button onClick={() => setDescExpanded(!descExpanded)} className="mt-1 text-xs font-semibold text-primary hover:underline">
              {descExpanded ? t("modelDetail.show_less") : t("modelDetail.show_more")}
            </button>
          )}
        </div>

        {/* ── Sticky Tab Bar ── */}
        <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 bg-background/95 backdrop-blur-sm border-b border-outline-variant/10 mb-10">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.labelKey}
                onClick={() => scrollTo(tab.id)}
                className={`py-3.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeSection === tab.id
                    ? "font-semibold text-on-surface border-primary"
                    : "font-medium text-on-surface-variant hover:text-on-surface border-transparent"
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ Section: Providers ══════════ */}
        <section id="providers" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.providers_for", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            {t("modelDetail.providers_routing_desc")}{" "}
            <span className="font-semibold text-on-surface">{t("modelDetail.providers_count", { count: m.providers.length })}</span>
          </p>

          {/* Provider avatars row */}
          <div className="flex items-center gap-2 mb-4">
            {m.providers.map((p) => (
              <div key={p.name} className={`w-8 h-8 rounded-lg ${p.bgColor} flex items-center justify-center text-[9px] ${p.textColor} font-bold`} title={p.name}>
                {p.initial}
              </div>
            ))}
          </div>

          {/* Provider table */}
          <div className="bg-surface-container-lowest rounded-xl overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-5 py-3">{t("modelDetail.col_provider")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_context")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_max_output")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_input_1m")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_output_1m")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_latency")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_throughput_ts")}</th>
                  <th className="px-4 py-3 text-right">{t("modelDetail.col_uptime")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {m.providers.map((p) => (
                  <tr key={p.name} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded ${p.bgColor} flex items-center justify-center text-[9px] ${p.textColor} font-bold shrink-0`}>{p.initial}</div>
                      <div>
                        <div className="font-semibold text-on-surface text-xs">{p.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-mono">{p.modelVariant}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-on-surface-variant">{p.contextLength}</td>
                    <td className="px-4 py-3.5 text-xs text-on-surface-variant">{p.maxOutput}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-primary">{p.inputCost}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-primary">{p.outputCost}</td>
                    <td className="px-4 py-3.5 text-xs text-on-surface-variant">{p.latency}s</td>
                    <td className="px-4 py-3.5 text-xs text-on-surface-variant">{p.throughput}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-xs font-bold ${p.uptime >= 99.5 ? "text-green-600" : p.uptime >= 99 ? "text-yellow-600" : "text-red-600"}`}>
                        {p.uptime}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════ Section: Performance ══════════ */}
        <section id="performance" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.performance_for", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">{t("modelDetail.performance_desc")}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Throughput Chart */}
            <div className="bg-surface-container-lowest rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("modelDetail.chart_throughput")}</h4>
                <span className="text-[10px] text-on-surface-variant">{t("modelDetail.chart_throughput_unit")}</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {m.providers.map((p) => (
                  <div key={p.name} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-on-surface">{p.throughput}</span>
                    <div className="w-full bg-primary/80 rounded-t transition-all" style={{ height: `${(p.throughput / maxThroughput) * 100}%` }} />
                    <span className="text-[9px] text-on-surface-variant truncate w-full text-center">{p.initial}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latency Chart */}
            <div className="bg-surface-container-lowest rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("modelDetail.chart_latency")}</h4>
                <span className="text-[10px] text-on-surface-variant">{t("modelDetail.chart_latency_unit")}</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {m.providers.map((p) => (
                  <div key={p.name} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-on-surface">{p.latency}s</span>
                    <div className="w-full bg-orange-400/80 rounded-t transition-all" style={{ height: `${(p.latency / maxLatency) * 100}%` }} />
                    <span className="text-[9px] text-on-surface-variant truncate w-full text-center">{p.initial}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* E2E Latency Chart */}
            <div className="bg-surface-container-lowest rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t("modelDetail.chart_e2e_latency")}</h4>
                <span className="text-[10px] text-on-surface-variant">{t("modelDetail.chart_latency_unit")}</span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {m.providers.map((p) => {
                  const e2e = +(p.latency * 3.2 + p.throughput * 0.05).toFixed(1);
                  const maxE2E = Math.max(...m.providers.map((pp) => +(pp.latency * 3.2 + pp.throughput * 0.05).toFixed(1)));
                  return (
                    <div key={p.name} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-on-surface">{e2e}s</span>
                      <div className="w-full bg-purple-400/80 rounded-t transition-all" style={{ height: `${(e2e / maxE2E) * 100}%` }} />
                      <span className="text-[9px] text-on-surface-variant truncate w-full text-center">{p.initial}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Benchmarks Table */}
          <h3 className="text-sm font-bold font-headline mb-3">{t("modelDetail.benchmark_results")}</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-5 py-3">{t("modelDetail.col_benchmark")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_category")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_score")}</th>
                  <th className="px-4 py-3 w-40"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {m.detailedBenchmarks.map((b) => (
                  <tr key={b.name} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-2.5 font-semibold text-on-surface text-xs">{b.name}</td>
                    <td className="px-4 py-2.5 text-xs text-on-surface-variant">{b.category}</td>
                    <td className="px-4 py-2.5 text-xs font-bold text-primary">{b.score}</td>
                    <td className="px-4 py-2.5">
                      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: b.score }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════ Section: Pricing ══════════ */}
        <section id="pricing" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.pricing_for", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">{t("modelDetail.pricing_desc")}</p>

          {/* Big price numbers */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-container-lowest rounded-xl p-6">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">{t("modelDetail.weighted_input_price")}</div>
              <div className="text-3xl sm:text-4xl font-extrabold font-headline text-on-surface">{m.inputPrice}</div>
              <div className="text-xs text-on-surface-variant mt-1">{t("modelDetail.per_1m_tokens")}</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6">
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-2">{t("modelDetail.weighted_output_price")}</div>
              <div className="text-3xl sm:text-4xl font-extrabold font-headline text-on-surface">{m.outputPrice}</div>
              <div className="text-xs text-on-surface-variant mt-1">{t("modelDetail.per_1m_tokens")}</div>
            </div>
          </div>

          {/* Pricing breakdown per provider */}
          <div className="bg-surface-container-lowest rounded-xl overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-5 py-3">{t("modelDetail.col_provider")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_input_1m")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_output_1m")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_cache_hit_1m")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {m.providers.map((p) => (
                  <tr key={p.name} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3 flex items-center gap-2">
                      <div className={`w-6 h-6 rounded ${p.bgColor} flex items-center justify-center text-[8px] ${p.textColor} font-bold`}>{p.initial}</div>
                      <span className="text-xs font-semibold text-on-surface">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-primary">{p.inputCost}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-primary">{p.outputCost}</td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">{p.cachePricing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Price history charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-surface-container-lowest rounded-xl p-5">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">{t("modelDetail.input_price_7d")}</h4>
              <div className="flex items-end gap-1 h-24">
                {[0.98, 1.0, 0.97, 1.02, 0.99, 1.01, 1.0].map((factor, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/60 rounded-t" style={{ height: `${factor * 80}%` }} />
                    <span className="text-[8px] text-on-surface-variant">{DAYS_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5">
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">{t("modelDetail.output_price_7d")}</h4>
              <div className="flex items-end gap-1 h-24">
                {[1.0, 0.99, 1.01, 0.98, 1.0, 1.02, 1.0].map((factor, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-primary/60 rounded-t" style={{ height: `${factor * 80}%` }} />
                    <span className="text-[8px] text-on-surface-variant">{DAYS_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ Section: Apps ══════════ */}
        <section id="apps" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.apps_using", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">{t("modelDetail.apps_top_month")}</p>

          <div className="bg-surface-container-lowest rounded-xl divide-y divide-outline-variant/10">
            {m.apps.map((app, i) => (
              <div key={app.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-container-low transition-colors">
                <span className="text-sm font-bold text-on-surface-variant w-5 text-right">{i + 1}.</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant">
                  {app.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-on-surface truncate">{app.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{app.requests} {t("modelDetail.requests")}</div>
                </div>
                <div className="w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-primary/70 rounded-full" style={{ width: `${app.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ Section: Activity ══════════ */}
        <section id="activity" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.activity_for", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">{t("modelDetail.activity_desc")}</p>

          <div className="bg-surface-container-lowest rounded-xl p-5">
            {/* Legend */}
            <div className="flex items-center gap-5 mb-5">
              {[
                { color: "bg-blue-500", label: t("modelDetail.legend_prompt") },
                { color: "bg-green-500", label: t("modelDetail.legend_completion") },
                { color: "bg-amber-400", label: t("modelDetail.legend_other") },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                  <span className="text-[11px] font-medium text-on-surface-variant">{l.label}</span>
                </div>
              ))}
            </div>

            {/* Chart area with Y-axis */}
            {(() => {
              const maxVal = Math.max(...m.activity.map((d) => d.prompt + d.completion + d.other));
              const yTicks = [maxVal, maxVal * 0.75, maxVal * 0.5, maxVal * 0.25];
              const fmtVal = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`;
              // Date labels: show every ~7 days
              const today = new Date();
              const dateLabels = m.activity.map((_, i) => {
                const d = new Date(today);
                d.setDate(d.getDate() - (m.activity.length - 1 - i));
                return `${d.getMonth() + 1}/${d.getDate()}`;
              });
              return (
                <div className="flex gap-2">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between h-56 text-right pr-1 shrink-0">
                    {yTicks.map((v) => (
                      <span key={v} className="text-[10px] text-on-surface-variant font-medium leading-none">{fmtVal(v)}</span>
                    ))}
                    <span className="text-[10px] text-on-surface-variant font-medium leading-none">0</span>
                  </div>

                  {/* Bars area */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-end gap-px h-56 border-l border-b border-outline-variant/20">
                      {m.activity.map((d, i) => {
                        const total = d.prompt + d.completion + d.other;
                        const hPct = (total / maxVal) * 100;
                        const pPct = total > 0 ? (d.prompt / total) * 100 : 0;
                        const cPct = total > 0 ? (d.completion / total) * 100 : 0;
                        const oPct = total > 0 ? (d.other / total) * 100 : 0;
                        return (
                          <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                            <div className="w-full flex flex-col" style={{ height: `${hPct}%` }}>
                              <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${pPct}%`, minHeight: total > 0 ? 1 : 0 }} />
                              <div className="w-full bg-green-500" style={{ height: `${cPct}%`, minHeight: total > 0 ? 1 : 0 }} />
                              <div className="w-full bg-amber-400 rounded-b-sm" style={{ height: `${oPct}%`, minHeight: total > 0 ? 1 : 0 }} />
                            </div>
                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {fmtVal(total)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* X-axis date labels */}
                    <div className="flex mt-1.5">
                      {dateLabels.map((label, i) => (
                        <span key={i} className={`flex-1 text-center text-[9px] text-on-surface-variant ${i % 7 === 0 ? "opacity-100" : "opacity-0"}`}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ══════════ Section: Uptime ══════════ */}
        <section id="uptime" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.uptime_for", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            {t("modelDetail.uptime_desc", { name: m.name, uptime: avgUptime })}
          </p>

          {/* Uptime timeline */}
          <div className="bg-surface-container-lowest rounded-xl p-5 mb-4">
            <div className="flex gap-0.5">
              {m.uptimeDays.map((pct, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-sm transition-colors ${
                    pct >= 99.9 ? "bg-green-500" : pct >= 99 ? "bg-yellow-400" : "bg-red-500"
                  }`}
                  title={`Day ${i + 1}: ${pct}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-on-surface-variant">
              <span>{t("modelDetail.uptime_30_days_ago")}</span>
              <span>{t("modelDetail.uptime_today")}</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant">
            {t("modelDetail.uptime_error_recovery")} <Link to="/docs/load-balancing" className="text-primary hover:underline">{t("modelDetail.learn_more_lb")}</Link>
          </p>

          {/* Error reasons */}
          <div className="bg-surface-container-lowest rounded-xl p-5 mt-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">{t("modelDetail.error_reasons_title")}</h4>
            <div className="space-y-3">
              {[
                { reason: t("modelDetail.error_rate_limited"), pct: 45 },
                { reason: t("modelDetail.error_timeout"), pct: 28 },
                { reason: t("modelDetail.error_context_overflow"), pct: 18 },
                { reason: t("modelDetail.error_other"), pct: 9 },
              ].map((e) => (
                <div key={e.reason} className="flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant w-28 shrink-0">{e.reason}</span>
                  <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: `${e.pct}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant w-8 text-right">{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ Section: API / Sample Code ══════════ */}
        <section id="api" className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-1">{t("modelDetail.sample_code_for", { name: m.name })}</h2>
          <p className="text-sm text-on-surface-variant mb-6">{t("modelDetail.sample_code_desc")}</p>

          <Link
            to="/settings/api-keys"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all text-sm mb-6"
          >
            <span className="material-symbols-outlined text-lg">key</span>
            {t("modelDetail.create_api_key")}
          </Link>

          {/* Code block */}
          <div className="bg-inverse-surface rounded-xl overflow-hidden shadow-xl">
            <div className="px-5 py-3 bg-[#1e2224] flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-3 text-xs font-bold text-white/50">
                {(Object.keys(CODE_LANG_LABELS) as CodeLang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setCodeLang(lang)}
                    className={`px-2 py-1 rounded transition-colors ${
                      codeLang === lang ? "text-white bg-white/10" : "hover:text-white/80"
                    }`}
                  >
                    {CODE_LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(m.code[codeLang], "code")}
                className="text-white/40 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">{copiedId === "code" ? "check" : "content_copy"}</span>
                <span className="text-[10px] font-bold">{copiedId === "code" ? t("modelDetail.copied") : t("modelDetail.copy")}</span>
              </button>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed text-blue-200 overflow-x-auto">
              <pre><code>{m.code[codeLang]}</code></pre>
            </div>
          </div>

          {/* Parameters */}
          <h3 className="text-sm font-bold font-headline mt-8 mb-3">{t("modelDetail.supported_params")}</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-5 py-3">{t("modelDetail.col_parameter")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_type")}</th>
                  <th className="px-4 py-3">{t("modelDetail.col_description")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {SUPPORTED_PARAMS.map((p) => (
                  <tr key={p.name} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-2.5 font-mono text-xs text-primary">{p.name}</td>
                    <td className="px-4 py-2.5 text-xs text-on-surface-variant">{p.type}</td>
                    <td className="px-4 py-2.5 text-xs text-on-surface-variant">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold font-headline mb-2">{t("modelDetail.using_third_party")}</h3>
            <p className="text-xs text-on-surface-variant">
              {t("modelDetail.third_party_desc")}{" "}
              <Link to="/docs" className="text-primary hover:underline">{t("modelDetail.framework_docs")}</Link>.{" "}
              {t("modelDetail.see_request_docs", { link: "" })}<Link to="/docs/api" className="text-primary hover:underline">{t("modelDetail.request_docs")}</Link>
            </p>
          </div>
        </section>

        {/* ══════════ Section: More Models ══════════ */}
        <section className="mb-16">
          <h2 className="text-xl font-bold font-headline mb-6">{t("modelDetail.more_models_from", { provider: m.provider })}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {m.relatedModels.map((rm) => (
              <Link
                key={rm.slug}
                to={`/models/${rm.slug}`}
                className="bg-surface-container-lowest rounded-xl p-5 hover:bg-surface-container-low transition-colors group"
              >
                <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors mb-2">{rm.name}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-2">{rm.desc}</p>
                <div className="text-[10px] font-semibold text-on-surface-variant">
                  <span className="text-primary">{rm.price}</span>
                  <span className="ml-1">{t("modelDetail.per_1m")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-surface-container-lowest border-t border-outline-variant/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3 z-50">
        <button
          onClick={() => navigate("/chat")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-sm"
        >
          <span className="material-symbols-outlined text-lg">chat</span>
          {t("modelDetail.chat")}
        </button>
        <button
          onClick={() => navigate(`/compare?model=${id ?? ""}`)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-lg text-sm"
        >
          <span className="material-symbols-outlined text-lg">compare_arrows</span>
          {t("modelDetail.compare")}
        </button>
      </div>

      <Footer />
    </div>
  );
};
