import SettingsLayout from "../components/SettingsLayout";

interface RoutingPageProps {
  readonly className?: string;
}

export default function RoutingPage({ className }: RoutingPageProps) {
  return (
    <SettingsLayout activeTab="routing" className={className}>
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
            Routing
          </h2>
          <p className="text-on-surface-variant text-sm">
            Configure model routing rules, fallbacks, and load balancing strategies.
          </p>
        </div>

        {/* Routing Content Sections */}
        <div className="space-y-16">
          {/* Auto Router Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">alt_route</span>
                <h2 className="text-base">Auto Router</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Configure which models the Auto Router can route to.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
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
                  <label className="text-sm font-bold text-on-surface">Allowed Models</label>
                  <div className="w-full">
                    <textarea
                      className="w-full h-32 p-4 bg-surface-container-lowest rounded-xl text-sm font-mono text-on-surface-variant focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                      placeholder="anthropic/*, openai/gpt-4o, google/*"
                      defaultValue="anthropic/*, openai/gpt-4o, google/*"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Model patterns to filter which models the auto-router can route between.
                      Separate patterns with commas or newlines. Supports wildcards (e.g.,
                      "anthropic/*" matches all Anthropic models). Leave empty to use all supported
                      models.
                    </p>
                    <button className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors">
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                      <span>33 models matched</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-on-surface">Prevent overrides</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-sm cursor-help">
                    info
                  </span>
                </div>
                <label className="relative inline-block w-9 h-5 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
                  Save
                </button>
              </div>
            </div>
          </section>

          {/* Divider */}
          <hr className="border-outline-variant/10" />

          {/* Default Provider Sort Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">sort</span>
                <h2 className="text-base">Default Provider Sort</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Choose how providers should be sorted for your requests.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Choose how providers should be sorted. Individual requests can override this
                  setting.
                </p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  By default, OpenRouter balances low prices with high uptime.{" "}
                  <a className="text-primary hover:underline" href="#">
                    Learn more
                  </a>
                  .
                </p>
                <div className="max-w-md">
                  <select className="w-full p-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none appearance-none transition-all cursor-pointer">
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
          <hr className="border-outline-variant/10" />

          {/* Default Model Section */}
          <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-xl">model_training</span>
                <h2 className="text-base">Default Model</h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Set a default model fallback when no model is specified.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Specify which model to use when a request doesn't include a model parameter.
                </p>
                <div className="max-w-md">
                  <div className="relative">
                    <input
                      className="w-full p-2.5 pr-10 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                      placeholder="Search models (e.g. gpt-4o)"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                      search
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-on-surface-variant">
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
