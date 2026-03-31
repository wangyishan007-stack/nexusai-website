import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LoginModal } from "../components/LoginModal";
import { useAuth } from "../hooks/useAuth";

interface PricingPageProps {
  readonly className?: string;
}

const FREE_FEATURES = [
  { text: "50 requests/day", included: true },
  { text: "25+ free models", included: true },
  { text: "4 providers", included: true },
  { text: "Community support", included: true },
  { text: "Basic dashboard", included: true },
  { text: "Priority routing", included: false },
  { text: "BYOK", included: false },
  { text: "SLA", included: false },
];

const PAYG_FEATURES = [
  "Platform fee: 4%",
  "Unlimited requests",
  "300+ models",
  "60+ providers",
  "Priority routing",
  "Auto top-up",
  "Advanced analytics",
  "Email support",
  "BYOK: 1M free requests/month, 4% after",
  "No minimum spend, no lock-in",
];

const ENTERPRISE_FEATURES = [
  "Volume discounts",
  "Dedicated account manager",
  "99.9% SLA",
  "SSO & RBAC",
  "Custom data policies",
  "BYOK: 5M free requests/month, custom pricing",
  "Shared Slack support channel",
];

const FAQ_ITEMS = [
  {
    question: "How does pay-as-you-go billing work?",
    answer:
      "You deposit credits into your account and pay per token used. Set up auto top-up to never run out. Platform fee is 4% of each transaction. No minimum spend required.",
  },
  {
    question: "Can I use my own API keys (BYOK)?",
    answer:
      "Yes. Bring your own API keys from OpenAI, Anthropic, Google and others. Pay-as-you-go accounts get 1M free requests/month with BYOK, 4% fee after that.",
  },
  {
    question: "Is the API compatible with OpenAI's SDK?",
    answer:
      "Yes, NexusAI is fully OpenAI-compatible. Just change the base URL and API key \u2014 no other code changes needed.",
  },
  {
    question: "What happens if a model provider goes down?",
    answer:
      "We automatically route to backup providers with no interruption. You can also configure your own fallback chain.",
  },
  {
    question: "Do you store my prompts or responses?",
    answer:
      "No. By default we don't store your prompts. You can enable logging in your dashboard for debugging purposes.",
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({ className = "" }) => {
  const [expandedFaq, setExpandedFaq] = useState<number>(0);
  const [showLogin, setShowLogin] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<string>("/");
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = useCallback(
    (redirectPath: string) => {
      if (isLoggedIn) {
        navigate(redirectPath);
      } else {
        setLoginRedirect(redirectPath);
        setShowLogin(true);
      }
    },
    [isLoggedIn, navigate],
  );

  const handleLogin = useCallback(() => {
    login();
    setShowLogin(false);
    navigate(loginRedirect);
  }, [login, navigate, loginRedirect]);

  return (
    <div className={`bg-background text-on-background font-body ${className}`}>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-on-surface mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            <strong className="text-on-surface">4% platform fee</strong> — lower than industry standard.
            <br />
            Pay only for what you use. No minimum spend, no lock-in.
          </p>
        </section>

        {/* Pricing Cards Row */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="flex flex-col p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/15 transition-all hover:bg-surface duration-300">
              <div className="mb-8">
                <h3 className="text-on-surface-variant font-label text-sm font-bold uppercase tracking-widest mb-2">
                  Free
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-headline text-on-surface">$0</span>
                  <span className="text-on-surface-variant font-medium">/mo</span>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                  Perfect for exploration and prototyping your next big idea.
                </p>
              </div>
              <ul className="flex-grow space-y-4 mb-8">
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-3 text-sm ${
                      feature.included ? "text-on-surface" : "text-on-surface-variant/50"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        feature.included ? "text-primary" : ""
                      }`}
                    >
                      {feature.included ? "check_circle" : "close"}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              {!isLoggedIn && (
                <button
                  onClick={() => handlePlanClick("/")}
                  className="w-full py-3 px-6 rounded-lg bg-surface-container-high text-primary font-semibold text-sm transition-all hover:bg-surface-container-highest active:scale-[0.98]"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Pay As You Go Plan */}
            <div className="relative flex flex-col p-8 rounded-xl bg-surface-container-lowest border-2 border-primary shadow-[0px_12px_32px_rgba(0,74,198,0.08)] scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                MOST POPULAR
              </div>
              <div className="mb-8">
                <h3 className="text-primary font-label text-sm font-bold uppercase tracking-widest mb-2">
                  Pay As You Go
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-headline text-on-surface">$5</span>
                  <span className="text-on-surface-variant font-medium">(min deposit)</span>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed font-medium">
                  Full access to all 300+ models with professional features.
                </p>
              </div>
              <ul className="flex-grow space-y-4 mb-8">
                {PAYG_FEATURES.map((text) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-on-surface">
                    <span
                      className="material-symbols-outlined text-primary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-on-surface-variant text-center mb-4 leading-relaxed">
                $5 minimum deposit · Unused credits never expire · Refundable within 24 hours
              </p>
              {!isLoggedIn && (
                <button
                  onClick={() => handlePlanClick("/settings/credits")}
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Start Building
                </button>
              )}
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/15 transition-all hover:bg-surface duration-300">
              <div className="mb-8">
                <h3 className="text-on-surface-variant font-label text-sm font-bold uppercase tracking-widest mb-2">
                  Enterprise
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-headline text-on-surface">Custom</span>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                  Volume discounts, dedicated support, and custom SLAs for your team.
                </p>
              </div>
              <ul className="flex-grow space-y-4 mb-8">
                {ENTERPRISE_FEATURES.map((text) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xl">
                      corporate_fare
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-surface-container-high text-primary font-semibold text-sm transition-all hover:bg-surface-container-highest active:scale-[0.98]">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="bg-surface-container-low rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-6 text-left group"
                  onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                >
                  <span className="font-semibold text-on-surface">{item.question}</span>
                  <span
                    className={`material-symbols-outlined transition-transform duration-300 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-on-surface-variant leading-relaxed text-sm">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-80">
          <div className="md:col-span-8 relative rounded-2xl overflow-hidden bg-slate-900 group">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaNFfYUNHP-lLoBWFIv6prjD1CXRZHMSTBIPjnIeK9S0fUORTehENX4kH9WYuN537WWdIxODycC5elU_EYgNcfCfDlAERF2Xw4ydyzrKvBYjp7fHcOGBs7yiei-0b8-5IMY6RSIgoazNHt72zsmtCgYtXPCdGqhGK23HZxL91W5eex5PExOs9ttzmhvvuTI8vrEv3aCsqfGFLMuKTyL2dgbHQoN3ywtLLcyt1ho8DozZuquoRMI6shEF5HAYefTFpjuiZwbwJKpRdf"
              alt="abstract digital connection network"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
              <h4 className="text-white text-3xl font-headline font-bold mb-2">
                Build without limits
              </h4>
              <p className="text-slate-300 max-w-lg">
                Access 300+ frontier models through a single unified API endpoint with 99.9% uptime
                reliability.
              </p>
            </div>
          </div>
          <div className="md:col-span-4 bg-primary-container rounded-2xl p-10 flex flex-col justify-between text-on-primary-container">
            <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
            <div>
              <h4 className="text-2xl font-headline font-bold mb-2">Ready to scale?</h4>
              <p className="text-blue-100 text-sm mb-6">
                No minimum spend. Start for free, scale when ready.
              </p>
              <Link
                to="/settings/api-keys"
                className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                Get API Key
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />

      <Footer />
    </div>
  );
};
