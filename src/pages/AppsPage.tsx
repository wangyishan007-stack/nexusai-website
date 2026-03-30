import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

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

const CODE_TABS = ["Python", "TypeScript", "cURL"];

const CODE_EXAMPLE = `import requests

url = "https://api.nexusai.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "X-App-Code": "YOUR_APP_CODE"
}

data = {
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`;

export const AppsPage: React.FC<AppsPageProps> = ({ className = "" }) => {
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

          {/* Form */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)] mb-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">
                  App Name
                </label>
                <input
                  type="text"
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
                    placeholder="your-app.com"
                    className="w-full bg-surface-container-low border-none rounded-lg py-3 pl-[4.5rem] pr-4 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all duration-200"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined">bolt</span>
                  Get Code
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-4 italic">
                  Once registered, all requests made with this APP Code will receive a 10% discount.
                </p>
              </div>
            </div>
          </div>

          {/* Code Block (Tabs) */}
          <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center px-4 pt-4 border-b border-slate-800">
              {CODE_TABS.map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium ${
                    i === 0 ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed text-slate-300">
                <code>{CODE_EXAMPLE}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
