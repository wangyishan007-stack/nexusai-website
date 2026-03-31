import { useState, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LoginModal } from "../components/LoginModal";
import { useAuth } from "../hooks/useAuth";

interface AppsPageProps {
  readonly className?: string;
}

const RULES = [
  "Enter your app name and app domain, then click 'Get Code' to generate your unique APP Code.",
  <>
    Add the{" "}
    <code className="bg-surface-container-highest px-1.5 py-0.5 rounded text-primary font-mono text-sm">
      X-App-Code
    </code>{" "}
    header to your API requests with your APP Code.
  </>,
  "All requests with a valid APP Code will automatically receive a 10% discount \u2014 no extra steps needed.",
  "Each account can register up to 5 apps. APP Codes are bound to domains, so make sure your domain is correct.",
];

function makeCodeExamples(appCode: string) {
  return [
    {
      lang: "Python",
      code: `import requests

url = "https://api.nexusai.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "X-App-Code": "${appCode}"
}

data = {
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
    },
    {
      lang: "TypeScript",
      code: `const response = await fetch("https://api.nexusai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
    "X-App-Code": "${appCode}",
  },
  body: JSON.stringify({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello!" }],
  }),
});

const data = await response.json();
console.log(data);`,
    },
    {
      lang: "cURL",
      code: `curl -X POST https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-App-Code: ${appCode}" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
    },
  ];
}

export const AppsPage: React.FC<AppsPageProps> = ({ className = "" }) => {
  const [appName, setAppName] = useState("");
  const [appDomain, setAppDomain] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { isLoggedIn, login } = useAuth();

  const isEmpty = !appName.trim() || !appDomain.trim();
  const codeExamples = makeCodeExamples(generatedCode ?? "YOUR_APP_CODE");

  const generateCode = useCallback(() => {
    const code = `app_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    setGeneratedCode(code);
  }, []);

  const handleGetCode = useCallback(() => {
    if (isEmpty) return;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    generateCode();
  }, [isEmpty, isLoggedIn, generateCode]);

  const handleLogin = useCallback(() => {
    login();
    setShowLoginModal(false);
    generateCode();
  }, [login, generateCode]);

  const handleReset = useCallback(() => {
    setAppName("");
    setAppDomain("");
    setGeneratedCode(null);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(() => {
    if (!generatedCode) return;
    void navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedCode]);

  return (
    <div className={`bg-surface font-body text-on-surface antialiased ${className}`}>
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Title Area */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-fixed text-primary mb-6">
              <span className="material-symbols-outlined text-4xl">featured_seasonal_and_gifts</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background tracking-tight mb-4">
              Integrate NexusAI, get 10% off
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Connect NexusAI to your app, get a unique APP Code, and automatically receive 10% off
              all API calls.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="bg-surface-container-low rounded-xl p-8 mb-10 space-y-6">
            {RULES.map((rule, i) => (
              <div key={i} className="flex gap-4">
                <span className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                <p className="text-on-surface font-medium leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>

          {/* Form / Success State */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)] mb-10">
            {generatedCode ? (
              /* ── Success State ── */
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg">APP Code Generated</h3>
                    <p className="text-sm text-on-surface-variant">Your app has been registered successfully.</p>
                  </div>
                </div>

                {/* Code display */}
                <div className="flex items-center gap-3 bg-surface-container-low rounded-lg p-4">
                  <code className="flex-1 font-mono text-sm font-semibold text-on-surface tracking-wide">
                    {generatedCode}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? "check" : "content_copy"}
                    </span>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">language</span>
                    <span>
                      Bound to domain: <strong className="text-on-surface">https://{appDomain}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Code saved. You can view it in your account settings.</span>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-lg border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Register Another App
                </button>
              </div>
            ) : (
              /* ── Form State ── */
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">
                    App Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="e.g.: InferEra"
                    className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">
                    App Domain
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">
                      https://
                    </span>
                    <input
                      type="text"
                      value={appDomain}
                      onChange={(e) => setAppDomain(e.target.value)}
                      placeholder="your-app.com"
                      className="w-full bg-surface-container-low border-none rounded-lg py-3 pl-[4.5rem] pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleGetCode}
                    disabled={isEmpty}
                    className={`w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 ${
                      isEmpty ? "opacity-50 cursor-not-allowed" : "hover:opacity-95"
                    }`}
                  >
                    <span className="material-symbols-outlined">bolt</span>
                    Get Code
                  </button>
                  <p className="text-center text-xs text-on-surface-variant mt-4 italic">
                    Once registered, all requests made with this APP Code will receive a 10% discount.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Code Block (Tabs) */}
          <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center px-4 pt-4 border-b border-slate-800">
              {codeExamples.map((tab, i) => (
                <button
                  key={tab.lang}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === i
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.lang}
                </button>
              ))}
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-slate-300">
                <code>{codeExamples[activeTab].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <Footer />
    </div>
  );
};
