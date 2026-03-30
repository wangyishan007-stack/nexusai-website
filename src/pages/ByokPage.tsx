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
      <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
        {/* BYOK Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">
              BYOK
            </h1>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="text-lg">Use your own provider API keys on NexusAI</span>
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
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              filter_list
            </span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border-none rounded-xl text-sm shadow-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
              placeholder="Search providers..."
              type="text"
            />
          </div>
        </div>

        {/* Provider Grid */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Provider
                  </th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Integration Status
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROVIDERS.map((provider) => (
                  <tr
                    key={provider.name}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg ${provider.iconBg} flex items-center justify-center ${provider.iconColor}`}
                        >
                          <span className="material-symbols-outlined">{provider.icon}</span>
                        </div>
                        <span className="font-semibold text-slate-900">{provider.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            provider.status === "active" ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        {provider.status === "active" ? (
                          <span className="text-sm text-on-surface-variant font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-sm text-slate-500 italic">Not configured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all group-hover:shadow-sm">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing 6 of 24 providers
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 bg-white cursor-not-allowed">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:border-primary hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="mt-8 p-6 rounded-2xl bg-[#acbfff]/10 border border-secondary-container/20">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lightbulb
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-secondary-container mb-1">
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
                <button className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider">
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
