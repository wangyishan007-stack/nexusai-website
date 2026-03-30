import SettingsLayout from "../components/SettingsLayout";

interface ApiKeysPageProps {
  readonly className?: string;
}

const API_KEYS = [
  {
    name: "Default Key",
    key: "sk-nx-****...4a8f",
    created: "Jan 15, 2026",
    lastUsed: "2 hours ago",
  },
  {
    name: "Production App",
    key: "sk-nx-****...7c2d",
    created: "Feb 3, 2026",
    lastUsed: "5 min ago",
  },
  {
    name: "Testing",
    key: "sk-nx-****...9e1b",
    created: "Mar 1, 2026",
    lastUsed: "3 days ago",
  },
];

export default function ApiKeysPage({ className }: ApiKeysPageProps) {
  return (
    <SettingsLayout activeTab="api-keys" className={className}>
      <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
        {/* Page Header */}
        <header className="mb-10">
          <h1 className="font-headline font-extrabold text-4xl text-on-background tracking-tight mb-2">
            API Keys
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Create and manage your API keys for accessing NexusAI.
          </p>
        </header>

        {/* Info Banner Section */}
        <div className="bg-blue-700 p-6 rounded-xl flex items-center justify-between mb-12 shadow-lg shadow-blue-700/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[28px]">info</span>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                Your default API key has full access to all models.
              </p>
              <p className="text-blue-100/80 text-sm">
                Keep your keys secure and do not share them in public repositories.
              </p>
            </div>
          </div>
          <button className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New Key
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden ring-1 ring-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">
                  Name
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">
                  Key
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">
                  Created
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest">
                  Last Used
                </th>
                <th className="px-6 py-4 text-[11px] font-extrabold text-on-surface-variant uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {API_KEYS.map((apiKey) => (
                <tr
                  key={apiKey.key}
                  className="hover:bg-surface-container-high/30 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <span className="font-semibold text-on-surface">{apiKey.name}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <code className="bg-surface-container font-mono text-xs px-2 py-1 rounded border border-outline-variant/30 text-on-surface-variant">
                        {apiKey.key}
                      </code>
                      <button className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm">{apiKey.created}</td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm">{apiKey.lastUsed}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </SettingsLayout>
  );
}
