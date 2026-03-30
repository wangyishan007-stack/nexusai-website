import SettingsLayout from "../components/SettingsLayout";

interface GuardrailsPageProps {
  readonly className?: string;
}

const ELIGIBLE_MODELS = [
  { name: "Wan 2.6", tag: "(experimental)" },
  { name: "KAT - Coder - Pro V2", tag: null },
  { name: "Seedance 1.5 Pro", tag: "(experimental)" },
  { name: "Sora 2 Pro", tag: "(experimental)" },
  { name: "Veo 3.1", tag: "(experimental)" },
  { name: "Reka Edge", tag: null },
];

export default function GuardrailsPage({ className }: GuardrailsPageProps) {
  return (
    <SettingsLayout activeTab="guardrails" className={className}>
      <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="font-headline font-extrabold text-4xl text-on-background tracking-tight mb-2">
            Guardrails
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Manage data consent and set spending limits, model restrictions, and usage policies.
          </p>
        </header>

        {/* Eligibility Preview Section */}
        <section className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-lg font-semibold text-on-surface">
              Eligibility Preview
            </h2>
            <span className="text-[0.75rem] font-label font-medium uppercase tracking-[0.05em] text-on-surface-variant">
              Live Status
            </span>
          </div>
          {/* Bento-style Grid for Models */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ELIGIBLE_MODELS.map((model) => (
              <div
                key={model.name}
                className="bg-white p-5 rounded-xl border-outline-variant/30 border flex items-center justify-between hover:bg-surface-container-high/20 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-on-surface">
                    {model.name}{" "}
                    {model.tag && (
                      <span className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant font-normal">
                        {model.tag}
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Settings Section */}
        <section className="space-y-6 mb-12">
          <h2 className="font-headline text-lg font-semibold text-on-surface">Privacy Settings</h2>
          <div className="space-y-4">
            {/* Toggle Row 1: Paid Endpoints */}
            <div className="bg-white rounded-xl p-6 flex items-start justify-between border-outline-variant/30 border">
              <div className="flex-1 pr-8">
                <h3 className="font-semibold text-sm text-on-surface mb-1">
                  Enable paid endpoints that may train on inputs
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Control whether to enable paid endpoints that can anonymously use your data for
                  training purposes.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input className="sr-only peer" type="checkbox" />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>

            {/* Toggle Row 2: Free Endpoints (Active) */}
            <div className="bg-white rounded-xl p-6 flex items-start justify-between border-outline-variant/30 border ring-1 ring-primary/10">
              <div className="flex-1 pr-8">
                <h3 className="font-semibold text-sm text-on-surface mb-1">
                  Enable free endpoints that may train on inputs
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Free model providers often retain and/or train on prompts and completions (applies
                  to both chatroom and API usage). See the model page for details.
                </p>
                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-secondary-container/10 rounded-lg w-fit">
                  <span className="material-symbols-outlined text-on-secondary-container text-sm">
                    info
                  </span>
                  <span className="text-[11px] font-medium text-on-secondary-container">
                    Recommended for rapid prototyping only
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input className="sr-only peer" type="checkbox" defaultChecked />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </section>

        {/* Insight Card */}
        <section className="p-6 bg-secondary-container/5 rounded-xl border border-secondary-container/20 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <div>
              <h4 className="font-headline text-sm font-bold text-on-surface">
                Smart Optimization Active
              </h4>
              <p className="text-sm text-on-surface-variant mt-1">
                NexusAI is currently monitoring your endpoints to ensure compliance with the selected
                guardrails. You will be notified if a requested model exceeds these limits.
              </p>
              <button className="mt-4 text-primary font-semibold text-[13px] flex items-center gap-1 hover:underline">
                View Policy Logs{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </SettingsLayout>
  );
}
