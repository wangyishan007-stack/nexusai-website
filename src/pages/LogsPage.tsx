import { useState } from "react";
import SettingsLayout from "../components/SettingsLayout";

const TABS = ["Generations", "Jobs", "Sessions"] as const;

const LOG_ENTRIES = [
  { time: "Mar 31, 02:57", provider: "Anthropic", model: "Claude 3.5 Sonnet", app: "NexusAI: Gateway", tokensIn: 182, tokensOut: 1660, cost: "$ 0.02760", speed: "42.1 tps", finish: "stop" },
  { time: "Mar 31, 02:55", provider: "OpenAI", model: "GPT-4o", app: "NexusAI: Gateway", tokensIn: 304, tokensOut: 2800, cost: "$ 0.04650", speed: "35.8 tps", finish: "stop" },
  { time: "Mar 31, 02:41", provider: "OpenAI", model: "Text Embedding 3 Large", app: "NexusAI: Gateway", tokensIn: 256, tokensOut: 0, cost: "$ 0.00010", speed: "—", finish: "stop" },
  { time: "Mar 31, 02:33", provider: "Mistral", model: "Mistral 7B Instruct", app: "NexusAI: Gateway", tokensIn: 128, tokensOut: 384, cost: "$ 0.00020", speed: "18.2 tps", finish: "stop" },
  { time: "Mar 31, 02:20", provider: "Anthropic", model: "Claude 3.5 Sonnet", app: "NexusAI: Gateway", tokensIn: 0, tokensOut: 0, cost: "$ 0.00000", speed: "—", finish: "error" },
  { time: "Mar 31, 02:19", provider: "OpenAI", model: "DALL-E 3", app: "NexusAI: Gateway", tokensIn: 0, tokensOut: 0, cost: "$ 0.04000", speed: "—", finish: "stop" },
  { time: "Mar 31, 02:18", provider: "Meta", model: "Llama 3.1 405B", app: "NexusAI: Gateway", tokensIn: 480, tokensOut: 4800, cost: "$ 0.01580", speed: "19.4 tps", finish: "stop" },
  { time: "Mar 31, 02:17", provider: "OpenAI", model: "GPT-4o", app: "NexusAI: Gateway", tokensIn: 0, tokensOut: 0, cost: "$ 0.00000", speed: "—", finish: "error" },
  { time: "Mar 31, 02:16", provider: "Google", model: "Gemini 1.5 Pro", app: "NexusAI: Gateway", tokensIn: 248, tokensOut: 1800, cost: "$ 0.01020", speed: "28.6 tps", finish: "stop" },
  { time: "Mar 31, 02:15", provider: "DeepSeek", model: "DeepSeek V3 0324", app: "NexusAI: Gateway", tokensIn: 161, tokensOut: 224, cost: "$ 0.00023", speed: "25.2 tps", finish: "stop" },
];

// Simple bar chart data
const CHART_DATA = [
  { label: "Mar 24", value: 0 },
  { label: "Mar 25", value: 0 },
  { label: "Mar 26", value: 4 },
  { label: "Mar 27", value: 0 },
  { label: "Mar 28", value: 0 },
  { label: "Mar 29", value: 0 },
  { label: "Mar 30", value: 2 },
  { label: "Mar 31", value: 10 },
];

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Generations");
  const maxVal = Math.max(...CHART_DATA.map((d) => d.value), 1);

  return (
    <SettingsLayout activeTab="logs">
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-on-surface border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">refresh</span>
          </button>
        </div>

        {/* Date Range & Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant font-medium">From:</span>
            <input
              type="datetime-local"
              defaultValue="2026-03-24T21:46"
              className="bg-surface-container-lowest rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant font-medium">To:</span>
            <input
              type="datetime-local"
              defaultValue="2026-03-31T21:46"
              className="bg-surface-container-lowest rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Filters
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[16px]">flag</span>
              <span className="hidden sm:inline">Report Feedback</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-surface-container-lowest rounded-xl p-6 mb-8">
          <div className="flex items-end gap-1.5 h-20">
            {CHART_DATA.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full max-w-[36px] bg-primary rounded-sm transition-all"
                  style={{ height: d.value > 0 ? `${Math.max((d.value / maxVal) * 64, 4)}px` : "0px" }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-3">
            {CHART_DATA.map((d) => (
              <div key={d.label} className="flex-1 text-center text-[10px] text-on-surface-variant font-medium">
                {d.label}
              </div>
            ))}
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  <th className="text-left px-5 py-3.5">
                    Timestamp
                  </th>
                  <th className="text-left px-5 py-3.5">
                    Provider / Model
                  </th>
                  <th className="text-left px-5 py-3.5">
                    App
                  </th>
                  <th className="text-right px-5 py-3.5">
                    Tokens
                  </th>
                  <th className="text-right px-5 py-3.5">
                    Cost
                  </th>
                  <th className="text-right px-5 py-3.5">
                    Speed
                  </th>
                  <th className="text-right px-5 py-3.5">Finish</th>
                </tr>
              </thead>
              <tbody>
                {LOG_ENTRIES.map((log, i) => (
                  <tr
                    key={i}
                    className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-on-surface-variant text-xs font-medium">{log.time}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                          {log.provider.charAt(0)}
                        </span>
                        <span className="text-sm text-primary font-medium">{log.model}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-on-surface-variant">{log.app}</td>
                    <td className="px-5 py-3.5 text-right text-xs text-on-surface tabular-nums">
                      {log.tokensIn} <span className="text-on-surface-variant">&rarr;</span> {log.tokensOut}
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-on-surface tabular-nums">{log.cost}</td>
                    <td className="px-5 py-3.5 text-right text-xs text-on-surface-variant tabular-nums">{log.speed}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-xs font-medium ${log.finish === "error" ? "text-error" : "text-on-surface-variant"}`}>
                        {log.finish}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 py-5 border-t border-outline-variant/10">
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-primary bg-primary/8 rounded-lg">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden space-y-3">
          {LOG_ENTRIES.map((log, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                    {log.provider.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-primary">{log.model}</span>
                </div>
                <span className={`text-xs font-medium ${log.finish === "error" ? "text-error" : "text-on-surface-variant"}`}>
                  {log.finish}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mb-2">{log.time}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant tabular-nums">{log.tokensIn} &rarr; {log.tokensOut}</span>
                <span className="text-on-surface-variant tabular-nums">{log.speed}</span>
                <span className="text-on-surface font-medium tabular-nums">{log.cost}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-1 py-4">
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-primary bg-primary/8 rounded-lg">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
