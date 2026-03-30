import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface DocsPageProps {
  readonly className?: string;
}

const SIDEBAR_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { icon: "rocket_launch", label: "Quickstart", active: true },
      { icon: "info", label: "Introduction", active: false },
      { icon: "lock", label: "Authentication", active: false },
      { icon: "layers", label: "Models Overview", active: false },
    ],
  },
  {
    title: "Guides",
    items: [
      { icon: "description", label: "Text Generation", active: false },
      { icon: "chat", label: "Chat Completions", active: false },
      { icon: "data_object", label: "Structured Outputs", active: false },
    ],
  },
  {
    title: "Agents",
    items: [
      { icon: "smart_toy", label: "Agent Overview", active: false },
      { icon: "build", label: "Tool Use", active: false },
    ],
  },
];

const BENTO_LINKS = [
  { icon: "api", title: "API Reference", desc: "Detailed endpoint specifications and parameters." },
  { icon: "view_module", title: "Models Overview", desc: "Explore the 300+ available models and pricing." },
  { icon: "handyman", title: "Tool Use", desc: "How to connect models to external functions." },
  { icon: "security", title: "Authentication", desc: "Manage your API keys and security settings." },
];

const TOC_ITEMS = [
  { id: "quickstart", label: "Quickstart", active: true },
  { id: "step-1", label: "1. Get Your API Key", active: false },
  { id: "step-2", label: "2. Install SDK", active: false },
  { id: "step-3", label: "3. Make Your First Request", active: false },
  { id: "step-4", label: "4. Response Format", active: false },
  { id: "parameters", label: "Key Parameters", active: false },
  { id: "next-steps", label: "Next Steps", active: false },
];

const PARAMETERS_TABLE = [
  { param: "model", type: "string", desc: "ID of the model to use. Format: provider/model-id." },
  { param: "messages", type: "array", desc: "A list of messages comprising the conversation so far." },
  { param: "temperature", type: "number", desc: "What sampling temperature to use, between 0 and 2." },
  { param: "max_tokens", type: "integer", desc: "The maximum number of tokens to generate in the completion." },
];

const NEXT_STEPS = [
  { icon: "auto_awesome", title: "Explore Models", desc: "Browse the library of 300+ frontier and open-source models." },
  { icon: "point_of_sale", title: "Pricing Guide", desc: "Understand our unified token pricing across all providers." },
  { icon: "terminal", title: "SDK Examples", desc: "Advanced patterns for streaming, tool use, and vision." },
  { icon: "groups", title: "Join Community", desc: "Get help and share your projects on Discord or GitHub." },
];

const CODE_STEP3 = `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("NEXUSAI_API_KEY"),
    base_url="https://api.nexusai.com/v1"
)

response = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[{"role": "user", "content": "Hello, AI!"}]
)

print(response.choices[0].message.content)`;

const RESPONSE_JSON = `{
  "id": "chatcmpl-nexus-123",
  "object": "chat.completion",
  "created": 1715862000,
  "model": "anthropic/claude-3-5-sonnet",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21,
    "total_cost": 0.000315
  }
}`;

export const DocsPage: React.FC<DocsPageProps> = ({ className = "" }) => {
  return (
    <div className={`bg-surface font-body text-on-surface antialiased ${className}`}>
      <Navbar />

      {/* App Container */}
      <div className="flex pt-20 min-h-screen">
        {/* Left Sidebar */}
        <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 overflow-y-auto bg-slate-50 border-r border-slate-200/50 flex-col p-4 space-y-6 hidden lg:flex">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      item.active
                        ? "text-blue-600 font-bold bg-white shadow-sm translate-x-1"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          ))}

          <div className="mt-auto pt-6 border-t border-slate-200/50">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
                V2
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Documentation</p>
                <p className="text-[10px] text-slate-500">v2.4.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 mr-0 xl:mr-72 bg-surface-container-lowest min-h-screen px-6 py-12 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
              <span>Docs</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span>Getting Started</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-on-surface">Quickstart</span>
            </nav>

            <h1
              className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-background mb-6"
              id="quickstart"
            >
              Quickstart
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-10">
              Make your first API call in minutes. NexusAI is OpenAI-compatible, so you can use your
              existing SDK and just change the base URL.
            </p>

            {/* Callout */}
            <div className="bg-secondary-container/10 border-l-4 border-secondary p-6 rounded-r-xl mb-12">
              <div className="flex gap-4">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  info
                </span>
                <div>
                  <p className="font-bold text-on-secondary-container mb-1">OpenAI Compatible</p>
                  <p className="text-sm text-on-surface-variant">
                    NexusAI supports the OpenAI SDK format. Just change{" "}
                    <code className="bg-secondary-container/20 px-1 rounded">base_url</code> and{" "}
                    <code className="bg-secondary-container/20 px-1 rounded">api_key</code> to access
                    300+ models.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Grid Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              {BENTO_LINKS.map((link) => (
                <a
                  key={link.title}
                  className="group p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all"
                  href="#"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {link.icon}
                    </span>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-1">{link.title}</h4>
                  <p className="text-sm text-on-surface-variant">{link.desc}</p>
                </a>
              ))}
            </div>

            {/* Step 1 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold font-headline mb-4" id="step-1">
                1. Get Your API Key
              </h2>
              <p className="text-on-surface-variant mb-6">
                To use the API, you'll need an API key. You can create one in the NexusAI Dashboard.
                Once you have it, set it as an environment variable.
              </p>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-container rounded-lg blur opacity-5 group-hover:opacity-10 transition duration-1000" />
                <div className="relative bg-slate-900 rounded-lg p-5 font-mono text-sm overflow-hidden">
                  <div className="flex justify-between items-center mb-4 text-slate-500 text-xs">
                    <span>TERMINAL</span>
                    <button className="hover:text-white transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">content_copy</span> Copy
                    </button>
                  </div>
                  <code className="text-blue-400">
                    export <span className="text-green-400">NEXUSAI_API_KEY</span>=
                    <span className="text-amber-300">"sk-nexus-xxxxxxxxxxxx"</span>
                  </code>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold font-headline mb-4" id="step-2">
                2. Install SDK
              </h2>
              <p className="text-on-surface-variant mb-6">
                Choose your preferred language and install the standard OpenAI SDK or use our native
                packages.
              </p>
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="flex border-b border-outline-variant/30">
                  <button className="px-6 py-3 text-sm font-bold border-b-2 border-primary text-primary">
                    Python
                  </button>
                  <button className="px-6 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                    TypeScript
                  </button>
                  <button className="px-6 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                    cURL
                  </button>
                </div>
                <div className="p-6 bg-slate-950 font-mono text-sm">
                  <code className="text-slate-300">
                    pip install <span className="text-primary-fixed-dim">openai</span>
                  </code>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold font-headline mb-4" id="step-3">
                3. Make Your First Request
              </h2>
              <p className="text-on-surface-variant mb-6">
                Initialize the client with our base URL and your key. This example uses Claude 3.5
                Sonnet through the NexusAI gateway.
              </p>
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="flex border-b border-outline-variant/30 justify-between items-center pr-4">
                  <div className="flex">
                    <button className="px-6 py-3 text-sm font-bold border-b-2 border-primary text-primary">
                      Python
                    </button>
                    <button className="px-6 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                      TypeScript
                    </button>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Main.py
                  </span>
                </div>
                <div className="p-6 bg-slate-950 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto">
                  <pre>
                    <code>{CODE_STEP3}</code>
                  </pre>
                </div>
              </div>
              <div className="mt-6 bg-primary/5 p-6 rounded-xl border border-primary/10 flex gap-4">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  alternate_email
                </span>
                <div>
                  <p className="font-bold text-primary mb-1">Model ID Format</p>
                  <p className="text-sm text-on-surface-variant">
                    Use <code className="bg-primary/10 px-1 rounded">provider/model-name</code>{" "}
                    format, e.g.{" "}
                    <code className="bg-primary/10 px-1 rounded">openai/gpt-4o</code> or{" "}
                    <code className="bg-primary/10 px-1 rounded">google/gemini-1.5-pro</code>.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold font-headline mb-4" id="step-4">
                4. Response Format
              </h2>
              <p className="text-on-surface-variant mb-6">
                Our API returns a standard OpenAI-compatible JSON response, enriched with
                provider-specific metadata in the{" "}
                <code className="bg-slate-100 px-1 rounded">usage</code> object.
              </p>
              <div className="bg-slate-900 rounded-xl p-6 font-mono text-xs text-slate-300">
                <pre>
                  <code>{RESPONSE_JSON}</code>
                </pre>
              </div>
            </section>

            {/* Parameters Table */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold font-headline mb-6" id="parameters">
                Key Parameters
              </h2>
              <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-on-surface font-bold">
                    <tr>
                      <th className="px-6 py-4">Parameter</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {PARAMETERS_TABLE.map((row) => (
                      <tr key={row.param} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-primary">{row.param}</td>
                        <td className="px-6 py-4 text-slate-500">{row.type}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Next Steps */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold font-headline mb-6" id="next-steps">
                Next Steps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NEXT_STEPS.map((step) => (
                  <a
                    key={step.title}
                    className="p-6 border border-outline-variant/30 rounded-xl hover:shadow-lg transition-all flex flex-col items-start"
                    href="#"
                  >
                    <span className="material-symbols-outlined text-secondary mb-4">
                      {step.icon}
                    </span>
                    <span className="font-bold mb-1">{step.title}</span>
                    <span className="text-sm text-on-surface-variant">{step.desc}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Right Sidebar (TOC) */}
        <aside className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-72 p-8 hidden xl:block">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
            On this page
          </h4>
          <nav className="space-y-4">
            {TOC_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm ${
                  item.active
                    ? "font-bold text-primary"
                    : "text-on-surface-variant hover:text-primary transition-colors"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-12 pt-12 border-t border-outline-variant/20">
            <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl text-on-primary">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Support</p>
              <p className="font-bold mb-4">Need help with your integration?</p>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-sm font-bold transition-all">
                Chat with Support
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};
