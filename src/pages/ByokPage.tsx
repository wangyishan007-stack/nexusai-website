import SettingsLayout from "../components/SettingsLayout";

interface ByokPageProps {
  readonly className?: string;
}

const PROVIDERS = [
  {
    name: "AI21",
    icon: "neurology",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    status: "not-configured" as const,
  },
  {
    name: "Amazon Bedrock",
    icon: "cloud",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    status: "not-configured" as const,
  },
  {
    name: "Anthropic",
    icon: "psychology_alt",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    status: "active" as const,
  },
  {
    name: "Arcee AI",
    icon: "architecture",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    status: "not-configured" as const,
  },
  {
    name: "Azure",
    icon: "grid_view",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    status: "active" as const,
  },
  {
    name: "Baseten",
    icon: "view_compact",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    status: "not-configured" as const,
  },
];

export default function ByokPage({ className }: ByokPageProps) {
  return (
    <SettingsLayout activeTab="byok" className={className}>
      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* BYOK Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
              BYOK
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="text-sm">Use your own provider API keys on NexusAI</span>
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors group">
                <span className="material-symbols-outlined text-base">info</span>
                <span className="text-xs font-semibold tracking-wide border-b border-transparent group-hover:border-primary">
                  Find out more
                </span>
              </div>
            </div>
          </div>
          {/* Search Input for Providers */}
          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              filter_list
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-xl text-sm focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all placeholder:text-on-surface-variant"
              placeholder="Search providers..."
              type="text"
            />
          </div>
        </div>

        {/* Provider Table - Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Provider
                </th>
                <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Integration Status
                </th>
                <th className="px-5 py-3.5 text-right text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {PROVIDERS.map((provider) => (
                <tr
                  key={provider.name}
                  className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${provider.iconBg} flex items-center justify-center ${provider.iconColor}`}
                      >
                        <span className="material-symbols-outlined">{provider.icon}</span>
                      </div>
                      <span className="font-semibold text-on-surface">{provider.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          provider.status === "active" ? "bg-emerald-500" : "bg-surface-container-highest"
                        }`}
                      />
                      {provider.status === "active" ? (
                        <span className="text-sm text-on-surface-variant font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-sm text-on-surface-variant italic">Not configured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Footer */}
          <div className="px-5 py-4 border-t border-outline-variant/10 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-medium">
              Showing 6 of 24 providers
            </span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Provider Cards - Mobile */}
        <div className="md:hidden space-y-3 mb-8">
          {PROVIDERS.map((provider) => (
            <div key={provider.name} className="bg-surface-container-lowest rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${provider.iconBg} flex items-center justify-center ${provider.iconColor}`}>
                  <span className="material-symbols-outlined">{provider.icon}</span>
                </div>
                <span className="font-semibold text-on-surface flex-1">{provider.name}</span>
                <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${provider.status === "active" ? "bg-emerald-500" : "bg-surface-container-highest"}`} />
                <span className="text-xs text-on-surface-variant">
                  {provider.status === "active" ? "Active" : "Not configured"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight Card */}
        <div className="p-6 rounded-xl bg-surface-container-lowest">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center text-primary flex-shrink-0">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lightbulb
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-1">
                AI Recommendation
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                You currently have <strong>Azure</strong> and <strong>Anthropic</strong> configured.
                Consider connecting <strong>Amazon Bedrock</strong> to increase your model redundancy
                and optimize routing costs across regions.
              </p>
              <div className="mt-4 flex gap-3">
                <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                  View Savings Estimate
                </button>
                <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-wider transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SettingsLayout>
  );
}
