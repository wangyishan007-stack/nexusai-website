import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LoginModal } from "../components/LoginModal";
import { useAuth } from "../hooks/useAuth";

interface PricingPageProps {
  readonly className?: string;
}

const FREE_FEATURE_KEYS = [
  { key: "pricing.free_feature_1", included: true },
  { key: "pricing.free_feature_2", included: true },
  { key: "pricing.free_feature_3", included: true },
  { key: "pricing.free_feature_4", included: true },
  { key: "pricing.free_feature_5", included: true },
  { key: "pricing.free_feature_6", included: false },
  { key: "pricing.free_feature_7", included: false },
  { key: "pricing.free_feature_8", included: false },
];

const PAYG_FEATURE_KEYS = [
  "pricing.payg_feature_1",
  "pricing.payg_feature_2",
  "pricing.payg_feature_3",
  "pricing.payg_feature_4",
  "pricing.payg_feature_5",
  "pricing.payg_feature_6",
  "pricing.payg_feature_7",
  "pricing.payg_feature_8",
  "pricing.payg_feature_9",
  "pricing.payg_feature_10",
];

const ENTERPRISE_FEATURE_KEYS = [
  "pricing.enterprise_feature_1",
  "pricing.enterprise_feature_2",
  "pricing.enterprise_feature_3",
  "pricing.enterprise_feature_4",
  "pricing.enterprise_feature_5",
  "pricing.enterprise_feature_6",
  "pricing.enterprise_feature_7",
];

const FAQ_KEYS = [
  { q: "pricing.faq_1_q", a: "pricing.faq_1_a" },
  { q: "pricing.faq_2_q", a: "pricing.faq_2_a" },
  { q: "pricing.faq_3_q", a: "pricing.faq_3_a" },
  { q: "pricing.faq_4_q", a: "pricing.faq_4_a" },
  { q: "pricing.faq_5_q", a: "pricing.faq_5_a" },
];

export const PricingPage: React.FC<PricingPageProps> = ({ className = "" }) => {
  const { t } = useTranslation();
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
            {t("pricing.title")}
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            <strong className="text-on-surface">{t("pricing.subtitle_fee")}</strong>{t("pricing.subtitle_rest")}
            <br />
            {t("pricing.subtitle_line2")}
          </p>
        </section>

        {/* Pricing Cards Row */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="flex flex-col p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/15 transition-all hover:bg-surface duration-300">
              <div className="mb-8">
                <h3 className="text-on-surface-variant font-label text-sm font-bold uppercase tracking-widest mb-2">
                  {t("pricing.free_plan")}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-headline text-on-surface">{t("pricing.free_price")}</span>
                  <span className="text-on-surface-variant font-medium">{t("pricing.free_price_unit")}</span>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                  {t("pricing.free_desc")}
                </p>
              </div>
              <ul className="flex-grow space-y-4 mb-8">
                {FREE_FEATURE_KEYS.map((feature) => (
                  <li
                    key={feature.key}
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
                    {t(feature.key)}
                  </li>
                ))}
              </ul>
              {!isLoggedIn && (
                <button
                  onClick={() => handlePlanClick("/")}
                  className="w-full py-3 px-6 rounded-lg bg-surface-container-high text-primary font-semibold text-sm transition-all hover:bg-surface-container-highest active:scale-[0.98]"
                >
                  {t("pricing.get_started")}
                </button>
              )}
            </div>

            {/* Pay As You Go Plan */}
            <div className="relative flex flex-col p-8 rounded-xl bg-surface-container-lowest border-2 border-primary shadow-[0px_12px_32px_rgba(0,74,198,0.08)] scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {t("pricing.most_popular")}
              </div>
              <div className="mb-8">
                <h3 className="text-primary font-label text-sm font-bold uppercase tracking-widest mb-2">
                  {t("pricing.payg_plan")}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-headline text-on-surface">{t("pricing.payg_price")}</span>
                  <span className="text-on-surface-variant font-medium">{t("pricing.payg_price_unit")}</span>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed font-medium">
                  {t("pricing.payg_desc")}
                </p>
              </div>
              <ul className="flex-grow space-y-4 mb-8">
                {PAYG_FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-3 text-sm text-on-surface">
                    <span
                      className="material-symbols-outlined text-primary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-on-surface-variant text-center mb-4 leading-relaxed">
                {t("pricing.payg_deposit_note")}
              </p>
              {!isLoggedIn && (
                <button
                  onClick={() => handlePlanClick("/settings/credits")}
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  {t("pricing.start_building")}
                </button>
              )}
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/15 transition-all hover:bg-surface duration-300">
              <div className="mb-8">
                <h3 className="text-on-surface-variant font-label text-sm font-bold uppercase tracking-widest mb-2">
                  {t("pricing.enterprise_plan")}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-headline text-on-surface">{t("pricing.enterprise_price")}</span>
                </div>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                  {t("pricing.enterprise_desc")}
                </p>
              </div>
              <ul className="flex-grow space-y-4 mb-8">
                {ENTERPRISE_FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xl">
                      corporate_fare
                    </span>
                    {t(key)}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 rounded-lg bg-surface-container-high text-primary font-semibold text-sm transition-all hover:bg-surface-container-highest active:scale-[0.98]">
                {t("pricing.contact_sales")}
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">
            {t("pricing.faq_title")}
          </h2>
          <div className="space-y-4">
            {FAQ_KEYS.map((item, index) => (
              <div key={index} className="bg-surface-container-low rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-6 text-left group"
                  onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
                >
                  <span className="font-semibold text-on-surface">{t(item.q)}</span>
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
                    {t(item.a)}
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
              <h4 className="text-2xl font-headline font-bold mb-2">{t("pricing.cta_title")}</h4>
              <p className="text-blue-100 text-sm mb-6">
                {t("pricing.cta_desc")}
              </p>
              <Link
                to="/settings/api-keys"
                className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                {t("pricing.get_api_key")}
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
