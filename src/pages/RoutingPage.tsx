import SettingsLayout from "../components/SettingsLayout";

interface RoutingPageProps {
  readonly className?: string;
}

export default function RoutingPage({ className }: RoutingPageProps) {
  return (
    <SettingsLayout activeTab="routing" className={className}>
      <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">
            Routing
          </h1>
        </div>

        {/* Routing Content Sections */}
        <div className="space-y-16">
          {/* Auto Router Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="material-symbols-outlined text-xl">alt_route</span>
                <h2 className="text-base">Auto Router</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Configure which models the Auto Router can route to.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Route to the best model for each request using{" "}
                  <a className="text-primary hover:underline" href="#">
                    openrouter/auto
                  </a>
                  .{" "}
                  <a className="text-primary hover:underline" href="#">
                    Learn more
                  </a>
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900">Allowed Models</label>
                  <div className="w-full">
                    <textarea
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="anthropic/*, openai/gpt-4o, google/*"
                      defaultValue="anthropic/*, openai/gpt-4o, google/*"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Model patterns to filter which models the auto-router can route between.
                      Separate patterns with commas or newlines. Supports wildcards (e.g.,
                      "anthropic/*" matches all Anthropic models). Leave empty to use all supported
                      models.
                    </p>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                      <span>33 models matched</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Prevent overrides</span>
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-help">
                    info
                  </span>
                </div>
                <label className="relative inline-block w-9 h-5 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-200 text-indigo-700 font-semibold rounded-lg text-sm hover:bg-indigo-300 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Default Provider Sort Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="material-symbols-outlined text-xl">sort</span>
                <h2 className="text-base">Default Provider Sort</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Choose how providers should be sorted for your requests.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Choose how providers should be sorted. Individual requests can override this
                  setting.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  By default, OpenRouter balances low prices with high uptime.{" "}
                  <a className="text-primary hover:underline" href="#">
                    Learn more
                  </a>
                  .
                </p>
                <div className="max-w-md">
                  <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all cursor-pointer">
                    <option>Default (balanced)</option>
                    <option>Lowest Price</option>
                    <option>Highest Throughput</option>
                    <option>Lowest Latency</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Default Model Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="material-symbols-outlined text-xl">model_training</span>
                <h2 className="text-base">Default Model</h2>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Set a default model fallback when no model is specified.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Specify which model to use when a request doesn't include a model parameter.
                </p>
                <div className="max-w-md">
                  <div className="relative">
                    <input
                      className="w-full p-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Search models (e.g. gpt-4o)"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                      search
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Common choices: openrouter/auto, anthropic/claude-3-sonnet, openai/gpt-4o-mini
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SettingsLayout>
  );
}
