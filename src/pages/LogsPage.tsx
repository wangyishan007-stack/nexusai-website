import SettingsLayout from "../components/SettingsLayout";

const LOG_ENTRIES = [
  { time: "14:23:08.412", method: "POST", path: "/v1/chat/completions", model: "claude-3.5-sonnet", status: 200, latency: "1,240ms", tokens: "1,842", cost: "$0.0276" },
  { time: "14:22:55.871", method: "POST", path: "/v1/chat/completions", model: "gpt-4o", status: 200, latency: "2,810ms", tokens: "3,104", cost: "$0.0465" },
  { time: "14:22:41.223", method: "POST", path: "/v1/embeddings", model: "text-embedding-3-large", status: 200, latency: "89ms", tokens: "256", cost: "$0.0001" },
  { time: "14:21:33.005", method: "POST", path: "/v1/chat/completions", model: "mistral-7b-instruct", status: 200, latency: "340ms", tokens: "512", cost: "$0.0002" },
  { time: "14:20:12.789", method: "POST", path: "/v1/chat/completions", model: "claude-3.5-sonnet", status: 429, latency: "12ms", tokens: "0", cost: "$0.0000" },
  { time: "14:19:55.441", method: "POST", path: "/v1/images/generations", model: "dall-e-3", status: 200, latency: "8,420ms", tokens: "—", cost: "$0.0400" },
  { time: "14:18:02.112", method: "POST", path: "/v1/chat/completions", model: "llama-3.1-405b", status: 200, latency: "4,105ms", tokens: "5,280", cost: "$0.0158" },
  { time: "14:17:44.890", method: "POST", path: "/v1/chat/completions", model: "gpt-4o", status: 500, latency: "5,001ms", tokens: "0", cost: "$0.0000" },
  { time: "14:16:30.556", method: "GET", path: "/v1/models", model: "—", status: 200, latency: "24ms", tokens: "—", cost: "$0.0000" },
  { time: "14:15:11.233", method: "POST", path: "/v1/chat/completions", model: "gemini-1.5-pro", status: 200, latency: "1,680ms", tokens: "2,048", cost: "$0.0102" },
];

const STAT_CARDS = [
  { label: "Total Requests", value: "2,847", change: "+12.4%", icon: "swap_horiz" },
  { label: "Avg Latency", value: "1.24s", change: "-8.2%", icon: "speed" },
  { label: "Error Rate", value: "0.34%", change: "-0.1%", icon: "error_outline" },
  { label: "Tokens Processed", value: "4.2M", change: "+18.7%", icon: "token" },
];

export default function LogsPage() {
  return (
    <SettingsLayout activeTab="logs">
      <div className="p-8 max-w-7xl mx-auto flex-1">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">Logs</h2>
            <p className="text-on-surface-variant text-sm">
              Real-time API request logs with latency, token usage, and error tracking.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">pause</span>
              Pause Stream
            </button>
            <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{stat.label}</p>
                <span className="material-symbols-outlined text-primary text-[18px]">{stat.icon}</span>
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-xl font-bold font-headline">{stat.value}</h3>
                <span className={`text-[10px] font-semibold mb-0.5 ${stat.change.startsWith("+") && stat.label !== "Error Rate" ? "text-emerald-600" : stat.change.startsWith("-") && stat.label === "Error Rate" ? "text-emerald-600" : stat.change.startsWith("-") ? "text-emerald-600" : "text-emerald-600"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Filter by model, path, or status..."
              className="w-full bg-white border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-outline"
            />
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-outline-variant/30 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-1 focus:ring-primary transition-all">
              <option>All Status</option>
              <option>2xx Success</option>
              <option>4xx Client Error</option>
              <option>5xx Server Error</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
              expand_more
            </span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-outline-variant/30 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-1 focus:ring-primary transition-all">
              <option>Last 1 hour</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
              expand_more
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-container/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Live
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-low/50">
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Endpoint</th>
                <th className="text-left px-4 py-3">Model</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Latency</th>
                <th className="text-right px-4 py-3">Tokens</th>
                <th className="text-right px-4 py-3">Cost</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {LOG_ENTRIES.map((log, i) => (
                <tr key={i} className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-on-surface-variant">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${log.method === "GET" ? "text-emerald-600" : "text-blue-600"}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface">{log.path}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{log.model}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 200
                          ? "bg-emerald-50 text-emerald-700"
                          : log.status === 429
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right ${parseInt(log.latency.replace(/,/g, "")) > 3000 ? "text-amber-600" : "text-on-surface"}`}>
                    {log.latency}
                  </td>
                  <td className="px-4 py-3 text-right text-on-surface-variant">{log.tokens}</td>
                  <td className="px-4 py-3 text-right text-on-surface">{log.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/10 bg-surface-container-low/30">
            <p className="text-xs text-on-surface-variant">Showing 10 of 2,847 requests</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 text-xs font-medium text-primary bg-primary-container/10 rounded">
                1
              </button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded transition-colors">
                2
              </button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded transition-colors">
                3
              </button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
