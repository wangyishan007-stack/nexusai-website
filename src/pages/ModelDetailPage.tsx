import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface ModelDetailPageProps {
  readonly className?: string;
}

interface ModelData {
  name: string;
  provider: string;
  modelId: string;
  description: string;
  metrics: { label: string; value: string; highlight: boolean }[];
  benchmarks: { name: string; score: string }[];
  codeExample: string;
}

const MODEL_DATA: Record<string, ModelData> = {
  "claude-3-5-sonnet": {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    modelId: "anthropic/claude-3.5-sonnet",
    description: "Claude 3.5 Sonnet is Anthropic's most balanced model, excelling at coding, analysis, and complex reasoning tasks. It strikes the perfect equilibrium between intelligence and speed, making it the ideal choice for enterprise-scale deployments.",
    metrics: [
      { label: "Created", value: "Jun 20, 2024", highlight: false },
      { label: "Context", value: "200,000", highlight: false },
      { label: "Input / 1M", value: "$3.00", highlight: true },
      { label: "Output / 1M", value: "$15.00", highlight: true },
      { label: "Max Output", value: "8,192", highlight: false },
    ],
    benchmarks: [
      { name: "MMLU", score: "88.7%" },
      { name: "HumanEval", score: "92.0%" },
      { name: "MATH", score: "71.1%" },
    ],
    codeExample: `import nexusai

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
  },
  "gpt-4o": {
    name: "GPT-4o",
    provider: "OpenAI",
    modelId: "openai/gpt-4o",
    description: "GPT-4o is OpenAI's flagship multimodal model. It accepts text, image, and audio inputs and generates text and audio outputs. It's the fastest and most affordable frontier model, with strong performance across vision, audio understanding, and multilingual tasks.",
    metrics: [
      { label: "Created", value: "May 13, 2024", highlight: false },
      { label: "Context", value: "128,000", highlight: false },
      { label: "Input / 1M", value: "$2.50", highlight: true },
      { label: "Output / 1M", value: "$10.00", highlight: true },
      { label: "Max Output", value: "16,384", highlight: false },
    ],
    benchmarks: [
      { name: "MMLU", score: "88.7%" },
      { name: "HumanEval", score: "90.2%" },
      { name: "MATH", score: "76.6%" },
    ],
    codeExample: `import nexusai

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
  },
  "deepseek-v3": {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    modelId: "deepseek/deepseek-v3",
    description: "DeepSeek V3 delivers exceptional value with near-frontier performance at a fraction of the cost. With 671B MoE parameters and 37B active, it excels at coding, math, and multilingual tasks while maintaining remarkably low inference costs.",
    metrics: [
      { label: "Created", value: "Dec 26, 2024", highlight: false },
      { label: "Context", value: "164,000", highlight: false },
      { label: "Input / 1M", value: "$0.32", highlight: true },
      { label: "Output / 1M", value: "$1.28", highlight: true },
      { label: "Max Output", value: "8,192", highlight: false },
    ],
    benchmarks: [
      { name: "MMLU", score: "87.1%" },
      { name: "HumanEval", score: "82.6%" },
      { name: "MATH", score: "90.2%" },
    ],
    codeExample: `import nexusai

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
  },
};

const DEFAULT_METRICS = [
  { label: "Created", value: "May 22, 2025", highlight: false },
  { label: "Context", value: "200,000", highlight: false },
  { label: "Input / 1M", value: "$3.00", highlight: true },
  { label: "Output / 1M", value: "$15.00", highlight: true },
  { label: "Max Output", value: "64,000", highlight: false },
];

const FEATURES = [
  { icon: "chat_bubble", title: "Chat", desc: "Natural, nuanced conversation with deep contextual awareness." },
  { icon: "code", title: "Coding", desc: "Exceptional performance in code generation and debugging." },
  { icon: "visibility", title: "Vision", desc: "Advanced image analysis and optical character recognition." },
  { icon: "build", title: "Tool Use", desc: "Reliable function calling for complex integrated workflows." },
  { icon: "description", title: "Long Docs", desc: "Processing of massive datasets within the large context window." },
  { icon: "data_object", title: "Structured Output", desc: "Native support for JSON and other structured data formats." },
];

const SUPPORTED_PARAMS = ["temperature", "top_p", "max_tokens", "stop_sequences", "stream", "seed"];

const DEFAULT_BENCHMARKS = [
  { name: "MMLU", score: "88.7%" },
  { name: "HumanEval", score: "92.3%" },
  { name: "MATH", score: "76.1%" },
];

const PROVIDERS = [
  {
    initial: "A",
    bgColor: "bg-slate-900",
    textColor: "text-white",
    name: "Anthropic Direct",
    dots: [true, true, true, true, true],
    latency: "1.2s",
    cost: "$3.00",
  },
  {
    initial: "AWS",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    name: "Amazon Bedrock",
    dots: [true, true, true, true, false],
    latency: "1.5s",
    cost: "$3.00",
  },
  {
    initial: "GCP",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    name: "Google Vertex AI",
    dots: [true, true, true, true, true],
    latency: "1.4s",
    cost: "$3.10",
  },
];

const TABS = ["Overview", "API", "Providers", "Benchmarks"];

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({ className = "" }) => {
  const { id } = useParams<{ id: string }>();
  const model = id ? MODEL_DATA[id] : undefined;

  const displayName = model?.name ?? "Claude Sonnet 4";
  const provider = model?.provider ?? "Anthropic";
  const modelId = model?.modelId ?? "anthropic/claude-sonnet-4";
  const description = model?.description ?? "Claude Sonnet 4 is Anthropic's most balanced model, excelling at coding, analysis, and complex reasoning tasks. It strikes the perfect equilibrium between intelligence and speed, making it the ideal choice for enterprise-scale deployments.";
  const metrics = model?.metrics ?? DEFAULT_METRICS;
  const benchmarks = model?.benchmarks ?? DEFAULT_BENCHMARKS;
  const codeExample = model?.codeExample ?? `import nexusai\n\nclient = nexusai.NexusAI(api_key="YOUR_NEXUS_KEY")\n\nresponse = client.chat.completions.create(\n    model="${modelId}",\n    messages=[{"role": "user", "content": "Hello"}]\n)\n\nprint(response.choices[0].message.content)`;

  return (
    <div className={`bg-background text-on-background ${className}`}>
      <Navbar />

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant font-label">
          <Link className="hover:text-primary transition-colors" to="/models">
            Models
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer">
            {provider}
          </span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-semibold">{displayName}</span>
        </nav>

        {/* Model Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-background mb-2">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <code className="px-2 py-1 bg-surface-container rounded text-xs font-mono">
                  {modelId}
                </code>
                <button
                  className="p-1 hover:bg-surface-container-high rounded transition-colors"
                  title="Copy ID"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-primary font-semibold rounded-lg hover:bg-surface-container-highest transition-all">
              <span className="material-symbols-outlined text-lg">compare_arrows</span>
              Compare
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-md hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-lg">chat</span>
              Chat
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5 bg-outline-variant/20 rounded-xl overflow-hidden mb-12 border border-outline-variant/10">
          {metrics.map((metric, i) => (
            <div
              key={metric.label}
              className={`bg-surface-container-lowest p-6 flex flex-col gap-1 ${
                i > 0 ? "border-l border-outline-variant/10" : ""
              }`}
            >
              <span className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant font-semibold">
                {metric.label}
              </span>
              <span
                className={`text-lg font-bold font-headline ${
                  metric.highlight ? "text-primary" : ""
                }`}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-2xl">
              {description}
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-surface-container-highest mb-8">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`pb-4 text-sm ${
                    i === 0
                      ? "font-bold text-primary border-b-2 border-primary"
                      : "font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content: Overview */}
            <div className="space-y-12">
              {/* Feature Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-6 bg-surface-container-low rounded-xl flex flex-col gap-3 group hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </span>
                    <h3 className="font-bold text-on-surface">{feature.title}</h3>
                    <p className="text-xs text-on-surface-variant">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Supported Parameters */}
              <div>
                <h3 className="text-lg font-bold font-headline mb-4">Supported Parameters</h3>
                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_PARAMS.map((param) => (
                    <span
                      key={param}
                      className="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full border border-outline-variant/10"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl border border-outline-variant/20">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhCGIv_xNo-GTMLTh6aFI-4UrG4_M10Im5qiG_qUg6S26WgCsaSZ6e9rJhdG4lKrtjGocarNYrChYFQ4pcJkQBIHtEbD3QKUeElye1xwH6X7xKKFE75nVTBWCOPcMoUgzKz2-Qa8oTTdG_bqFbYd3sHMslcQcqbaIga4YMTL1fpC2rWQRzgO9hH4HDafiME2q6NWwcwkDp1wEPJ6J-R2C9W8Pq0p0zbBvpJXnYQ9gM_5Mi2CULhtryIm_JU0kAeOVftwpGF-rz7vXO"
                alt="Abstract neural network representation"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-sm font-bold leading-tight">
                  State-of-the-art Reasoning
                </p>
                <p className="text-white/80 text-[10px] mt-1">
                  Benchmarked at 95.4% accuracy on Reasoning tasks.
                </p>
              </div>
            </div>

            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
              <h4 className="font-headline font-bold mb-4">Benchmarks Overview</h4>
              <div className="space-y-4">
                {benchmarks.map((bench) => (
                  <div key={bench.name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
                      <span>{bench.name}</span>
                      <span>{bench.score}</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: bench.score }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-xs font-bold text-primary hover:bg-primary-container/10 rounded transition-colors">
                View full benchmarks
              </button>
            </div>
          </div>
        </div>

        {/* Official Providers */}
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold font-headline mb-8">Official Providers</h2>
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  <th className="px-8 py-4">Provider</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Latency</th>
                  <th className="px-8 py-4">Cost / 1M Input</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {PROVIDERS.map((provider) => (
                  <tr
                    key={provider.name}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-8 py-5 flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded ${provider.bgColor} flex items-center justify-center text-[10px] ${provider.textColor} font-bold`}
                      >
                        {provider.initial}
                      </div>
                      <span className="font-bold">{provider.name}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-1">
                        {provider.dots.map((green, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              green ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant">
                      {provider.latency}
                    </td>
                    <td className="px-8 py-5 font-bold text-primary">{provider.cost}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-xs font-bold text-primary px-3 py-1 hover:bg-primary-container/10 rounded">
                        Connect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Implementation */}
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold font-headline mb-8">Quick Implementation</h2>
          <div className="bg-inverse-surface rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#1e2224] flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-4 text-xs font-bold text-white/50">
                <span className="text-primary-fixed-dim border-b border-primary-fixed-dim pb-4 -mb-4">
                  Python
                </span>
                <span>Node.js</span>
                <span>cURL</span>
              </div>
              <button className="text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span className="text-[10px] font-bold">Copy</span>
              </button>
            </div>
            <div className="p-8 font-mono text-sm leading-relaxed text-blue-200 overflow-x-auto">
              <pre>
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
