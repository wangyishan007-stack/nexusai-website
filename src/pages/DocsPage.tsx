import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface DocsPageProps {
  readonly className?: string;
}

type SidebarItemId =
  | "quickstart" | "introduction" | "authentication" | "models-overview"
  | "text-generation" | "chat-completions" | "structured-outputs"
  | "agent-overview" | "tool-use";

const SIDEBAR_SECTIONS: { titleKey: string; items: { icon: string; labelKey: string; id: SidebarItemId }[] }[] = [
  {
    titleKey: "docs.sidebar_getting_started",
    items: [
      { icon: "rocket_launch", labelKey: "docs.sidebar_quickstart", id: "quickstart" },
      { icon: "info", labelKey: "docs.sidebar_introduction", id: "introduction" },
      { icon: "lock", labelKey: "docs.sidebar_authentication", id: "authentication" },
      { icon: "layers", labelKey: "docs.sidebar_models_overview", id: "models-overview" },
    ],
  },
  {
    titleKey: "docs.sidebar_guides",
    items: [
      { icon: "description", labelKey: "docs.sidebar_text_generation", id: "text-generation" },
      { icon: "chat", labelKey: "docs.sidebar_chat_completions", id: "chat-completions" },
      { icon: "data_object", labelKey: "docs.sidebar_structured_outputs", id: "structured-outputs" },
    ],
  },
  {
    titleKey: "docs.sidebar_agents",
    items: [
      { icon: "smart_toy", labelKey: "docs.sidebar_agent_overview", id: "agent-overview" },
      { icon: "build", labelKey: "docs.sidebar_tool_use", id: "tool-use" },
    ],
  },
];

const BENTO_LINKS: { icon: string; titleKey: string; descKey: string; sectionId: string }[] = [
  { icon: "api", titleKey: "docs.bento_api_reference", descKey: "docs.bento_api_reference_desc", sectionId: "parameters" },
  { icon: "view_module", titleKey: "docs.bento_models_overview", descKey: "docs.bento_models_overview_desc", sectionId: "models-overview" },
  { icon: "handyman", titleKey: "docs.bento_tool_use", descKey: "docs.bento_tool_use_desc", sectionId: "tool-use" },
  { icon: "security", titleKey: "docs.bento_authentication", descKey: "docs.bento_authentication_desc", sectionId: "step-1" },
];

const TOC_IDS = ["quickstart", "step-1", "step-2", "step-3", "step-4", "parameters", "next-steps"];
const TOC_LABEL_KEYS = ["docs.toc_quickstart", "docs.step_1_title", "docs.step_2_title", "docs.step_3_title", "docs.step_4_title", "docs.toc_key_parameters", "docs.toc_next_steps"];

const PARAMETERS_TABLE = [
  { param: "model", type: "string", desc: "ID of the model to use. Format: provider/model-id." },
  { param: "messages", type: "array", desc: "A list of messages comprising the conversation so far." },
  { param: "temperature", type: "number", desc: "What sampling temperature to use, between 0 and 2." },
  { param: "max_tokens", type: "integer", desc: "The maximum number of tokens to generate in the completion." },
];

const NEXT_STEPS = [
  { icon: "auto_awesome", titleKey: "docs.next_explore_models", descKey: "docs.next_explore_models_desc", href: "/models" },
  { icon: "point_of_sale", titleKey: "docs.next_pricing_guide", descKey: "docs.next_pricing_guide_desc", href: "/pricing" },
  { icon: "terminal", titleKey: "docs.next_sdk_examples", descKey: "docs.next_sdk_examples_desc", href: "#step-3" },
  { icon: "groups", titleKey: "docs.next_join_community", descKey: "docs.next_join_community_desc", href: "#" },
];

type CodeTab = "python" | "typescript" | "curl";

const INSTALL_CODE: Record<CodeTab, string> = {
  python: "pip install openai",
  typescript: "npm install openai",
  curl: "# No installation needed — use curl directly",
};

const REQUEST_CODE: Record<CodeTab, string> = {
  python: `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("NEXUSAI_API_KEY"),
    base_url="https://api.nexusai.com/v1"
)

response = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[{"role": "user", "content": "Hello, AI!"}]
)

print(response.choices[0].message.content)`,
  typescript: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEXUSAI_API_KEY,
  baseURL: "https://api.nexusai.com/v1",
});

const response = await client.chat.completions.create({
  model: "anthropic/claude-3-5-sonnet",
  messages: [{ role: "user", content: "Hello, AI!" }],
});

console.log(response.choices[0].message.content);`,
  curl: `curl https://api.nexusai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $NEXUSAI_API_KEY" \\
  -d '{
    "model": "anthropic/claude-3-5-sonnet",
    "messages": [{"role": "user", "content": "Hello, AI!"}]
  }'`,
};

const REQUEST_FILENAME: Record<CodeTab, string> = {
  python: "main.py",
  typescript: "index.ts",
  curl: "terminal",
};

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
  const { t } = useTranslation();
  const [activeSidebar, setActiveSidebar] = useState<SidebarItemId>("quickstart");
  const [installTab, setInstallTab] = useState<CodeTab>("python");
  const [requestTab, setRequestTab] = useState<CodeTab>("python");
  const [activeToc, setActiveToc] = useState("quickstart");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // TOC scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      let current = TOC_IDS[0];
      for (const id of TOC_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveToc(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const tabClass = (active: boolean) =>
    active
      ? "px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold border-b-2 border-primary text-primary whitespace-nowrap"
      : "px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-on-surface-variant hover:text-on-surface cursor-pointer whitespace-nowrap";

  return (
    <div className={`bg-surface font-body text-on-surface antialiased ${className}`}>
      <Navbar />

      <div className="flex pt-14 sm:pt-16 min-h-screen">
        {/* Left Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto bg-surface-container-low border-r border-outline-variant/10 flex-col p-4 space-y-6 hidden lg:flex">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.titleKey}>
              <h3 className="px-3 mb-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {t(section.titleKey)}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSidebar(item.id);
                      scrollTo(item.id === "quickstart" ? "quickstart" : item.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                      activeSidebar === item.id
                        ? "text-primary font-bold bg-surface-container-lowest shadow-sm translate-x-1"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span className="text-sm">{t(item.labelKey)}</span>
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <div className="mt-auto pt-6 border-t border-outline-variant/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
                V2
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-tight">{t("docs.documentation_label")}</p>
                <p className="text-[10px] text-on-surface-variant">v2.4.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 lg:ml-64 mr-0 xl:mr-72 bg-surface-container-lowest min-h-screen px-4 sm:px-6 py-8 sm:py-12 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-6">
              <span>{t("docs.breadcrumb_docs")}</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span>{t("docs.sidebar_getting_started")}</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-on-surface">{t("docs.sidebar_quickstart")}</span>
            </nav>

            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-background mb-4 sm:mb-6"
              id="quickstart"
            >
              {t("docs.sidebar_quickstart")}
            </h1>
            <p className="text-sm sm:text-lg text-on-surface-variant leading-relaxed mb-6 sm:mb-10">
              {t("docs.quickstart_desc")}
            </p>

            {/* Callout */}
            <div className="bg-secondary-container/10 border-l-4 border-secondary p-4 sm:p-6 rounded-r-xl mb-8 sm:mb-12">
              <div className="flex gap-4">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  info
                </span>
                <div>
                  <p className="font-bold text-on-secondary-container mb-1">{t("docs.openai_compatible")}</p>
                  <p className="text-sm text-on-surface-variant">
                    {t("docs.openai_compatible_desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Grid Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-10 sm:mb-16">
              {BENTO_LINKS.map((link) => (
                <button
                  key={link.titleKey}
                  onClick={() => scrollTo(link.sectionId)}
                  className="group p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      {link.icon}
                    </span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-1">{t(link.titleKey)}</h4>
                  <p className="text-sm text-on-surface-variant">{t(link.descKey)}</p>
                </button>
              ))}
            </div>

            {/* Step 1 */}
            <section className="mb-10 sm:mb-16" id="step-1">
              <h2 className="text-2xl font-bold font-headline mb-4">
                {t("docs.step_1_title")}
              </h2>
              <p className="text-on-surface-variant mb-6">
                {t("docs.step_1_desc")}
              </p>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-container rounded-lg blur opacity-5 group-hover:opacity-10 transition duration-1000" />
                <div className="relative bg-surface-container-highest rounded-lg p-5 font-mono text-sm overflow-hidden">
                  <div className="flex justify-between items-center mb-4 text-on-surface-variant text-xs">
                    <span>TERMINAL</span>
                    <button
                      onClick={() => copyToClipboard('export NEXUSAI_API_KEY="sk-nexus-xxxxxxxxxxxx"', "env")}
                      className="hover:text-on-surface transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {copiedId === "env" ? "check" : "content_copy"}
                      </span>
                      {copiedId === "env" ? t("docs.copied") : t("docs.copy")}
                    </button>
                  </div>
                  <code className="text-primary">
                    export <span className="text-emerald-600">NEXUSAI_API_KEY</span>=
                    <span className="text-amber-600">"sk-nexus-xxxxxxxxxxxx"</span>
                  </code>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section className="mb-10 sm:mb-16" id="step-2">
              <h2 className="text-2xl font-bold font-headline mb-4">
                {t("docs.step_2_title")}
              </h2>
              <p className="text-on-surface-variant mb-6">
                {t("docs.step_2_desc")}
              </p>
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="flex border-b border-outline-variant/10">
                  {(["python", "typescript", "curl"] as CodeTab[]).map((tab) => (
                    <button key={tab} onClick={() => setInstallTab(tab)} className={tabClass(installTab === tab)}>
                      {tab === "python" ? "Python" : tab === "typescript" ? "TypeScript" : "cURL"}
                    </button>
                  ))}
                  <div className="ml-auto pr-4 flex items-center">
                    <button
                      onClick={() => copyToClipboard(INSTALL_CODE[installTab], "install")}
                      className="text-on-surface-variant hover:text-on-surface text-xs flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {copiedId === "install" ? "check" : "content_copy"}
                      </span>
                      {copiedId === "install" ? t("docs.copied") : t("docs.copy")}
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-surface-container-highest font-mono text-sm">
                  <code className="text-on-surface">{INSTALL_CODE[installTab]}</code>
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="mb-10 sm:mb-16" id="step-3">
              <h2 className="text-2xl font-bold font-headline mb-4">
                {t("docs.step_3_title")}
              </h2>
              <p className="text-on-surface-variant mb-6">
                {t("docs.step_3_desc")}
              </p>
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="flex flex-wrap border-b border-outline-variant/10 items-center">
                  <div className="flex">
                    {(["python", "typescript", "curl"] as CodeTab[]).map((tab) => (
                      <button key={tab} onClick={() => setRequestTab(tab)} className={tabClass(requestTab === tab)}>
                        {tab === "python" ? "Python" : tab === "typescript" ? "TypeScript" : "cURL"}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 ml-auto pr-3 sm:pr-4">
                    <span className="hidden sm:inline text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">
                      {REQUEST_FILENAME[requestTab]}
                    </span>
                    <button
                      onClick={() => copyToClipboard(REQUEST_CODE[requestTab], "request")}
                      className="text-on-surface-variant hover:text-on-surface text-xs flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">
                        {copiedId === "request" ? "check" : "content_copy"}
                      </span>
                      {copiedId === "request" ? t("docs.copied") : t("docs.copy")}
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-surface-container-highest font-mono text-xs sm:text-sm text-on-surface leading-relaxed overflow-x-auto">
                  <pre><code>{REQUEST_CODE[requestTab]}</code></pre>
                </div>
              </div>
              <div className="mt-6 bg-primary/5 p-6 rounded-xl flex gap-4">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  alternate_email
                </span>
                <div>
                  <p className="font-bold text-primary mb-1">{t("docs.model_id_format")}</p>
                  <p className="text-sm text-on-surface-variant">
                    {t("docs.model_id_format_desc")}
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section className="mb-10 sm:mb-16" id="step-4">
              <h2 className="text-2xl font-bold font-headline mb-4">
                {t("docs.step_4_title")}
              </h2>
              <p className="text-on-surface-variant mb-6">
                {t("docs.step_4_desc")}
              </p>
              <div className="bg-surface-container-highest rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-3 border-b border-outline-variant/10">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Response</span>
                  <button
                    onClick={() => copyToClipboard(RESPONSE_JSON, "response")}
                    className="text-on-surface-variant hover:text-on-surface text-xs flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {copiedId === "response" ? "check" : "content_copy"}
                    </span>
                    {copiedId === "response" ? t("docs.copied") : t("docs.copy")}
                  </button>
                </div>
                <div className="p-4 sm:p-6 font-mono text-[10px] sm:text-xs text-on-surface overflow-x-auto">
                  <pre><code>{RESPONSE_JSON}</code></pre>
                </div>
              </div>
            </section>

            {/* Parameters Table */}
            <section className="mb-16" id="parameters">
              <h2 className="text-2xl font-bold font-headline mb-6">
                {t("docs.toc_key_parameters")}
              </h2>
              <div className="overflow-x-auto rounded-xl bg-surface-container-low">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="text-on-surface font-bold">
                    <tr className="border-b border-outline-variant/10">
                      <th className="px-3 sm:px-6 py-3 sm:py-4">{t("docs.col_parameter")}</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4">{t("docs.col_type")}</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4">{t("docs.col_description")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {PARAMETERS_TABLE.map((row) => (
                      <tr key={row.param} className="hover:bg-surface-container/40 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-primary">{row.param}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-on-surface-variant">{row.type}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-on-surface-variant">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Next Steps */}
            <section className="mb-16" id="next-steps">
              <h2 className="text-2xl font-bold font-headline mb-6">
                {t("docs.toc_next_steps")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {NEXT_STEPS.map((step) => (
                  <a
                    key={step.titleKey}
                    className="p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all flex flex-col items-start cursor-pointer"
                    href={step.href}
                  >
                    <span className="material-symbols-outlined text-secondary mb-4">
                      {step.icon}
                    </span>
                    <span className="font-bold mb-1">{t(step.titleKey)}</span>
                    <span className="text-sm text-on-surface-variant">{t(step.descKey)}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Right Sidebar (TOC) */}
        <aside className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-72 p-8 hidden xl:block">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6">
            {t("docs.on_this_page")}
          </h4>
          <nav className="space-y-4">
            {TOC_IDS.map((id, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block text-sm text-left ${
                  activeToc === id
                    ? "font-bold text-primary"
                    : "text-on-surface-variant hover:text-primary transition-colors"
                }`}
              >
                {t(TOC_LABEL_KEYS[i])}
              </button>
            ))}
          </nav>
          <div className="mt-12 pt-12 border-t border-outline-variant/10">
            <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl text-on-primary">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">Support</p>
              <p className="font-bold mb-4">{t("docs.need_help")}</p>
              <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-sm font-bold transition-all">
                {t("docs.chat_with_support")}
              </button>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};
