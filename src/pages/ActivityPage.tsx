import SettingsLayout from "../components/SettingsLayout";

interface ActivityPageProps {
  readonly className?: string;
}

const USAGE_CARDS = [
  {
    label: "Spend",
    value: "$0.000046",
    bars: [40, 60, 30, 80, 100],
    detailLabel: "Mistral 7B Instruct v0.1",
    detailValue: "$0.000046",
  },
  {
    label: "Requests",
    value: "4",
    bars: [20, 40, 50, 20, 90],
    detailLabel: "Mistral 7B Instruct v0.1",
    detailValue: "4",
  },
  {
    label: "Tokens",
    value: "284",
    bars: [70, 30, 45, 15, 60],
    detailLabel: "Mistral 7B Instruct v0.1",
    detailValue: "284",
  },
];

const CHART_BARS = [
  { label: "Oct 24", height: "h-12", active: false },
  { label: "Oct 25", height: "h-16", active: false },
  { label: "Oct 26", height: "h-48", active: true },
  { label: "Oct 27", height: "h-4", active: false },
  { label: "Oct 28", height: "h-4", active: false },
  { label: "Oct 29", height: "h-4", active: false },
];

export default function ActivityPage({ className }: ActivityPageProps) {
  return (
    <SettingsLayout activeTab="activity" className={className}>
      <div className="flex-1 p-10 max-w-6xl w-full mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">Activity</h2>
            <p className="text-on-surface-variant text-sm">
              Monitor your model usage, token consumption, and financial spend.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
            </button>
            <div className="relative">
              <select className="appearance-none bg-surface-container-high text-on-surface pl-4 pr-10 py-2 rounded-lg text-sm font-medium border-none focus:ring-1 focus:ring-primary">
                <option>1 Month</option>
                <option>7 Days</option>
                <option>24 Hours</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                expand_more
              </span>
            </div>
            <div className="relative">
              <select className="appearance-none bg-surface-container-high text-on-surface pl-4 pr-10 py-2 rounded-lg text-sm font-medium border-none focus:ring-1 focus:ring-primary">
                <option>By Model</option>
                <option>By API Key</option>
                <option>By Project</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="mb-8 bg-secondary-container/10 border border-secondary-container/20 rounded-xl p-4 flex items-center gap-4">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          <p className="text-sm text-on-surface">
            Logs have moved. Your API request logs now have their own{" "}
            <a className="text-primary font-semibold hover:underline" href="#">
              dedicated page
            </a>
            .
          </p>
        </div>

        {/* Usage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {USAGE_CARDS.map((card) => (
            <div
              key={card.label}
              className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    {card.label}
                  </p>
                  <div className="flex items-end gap-[2px] h-8">
                    {card.bars.map((height, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full ${i === card.bars.length - 1 ? "bg-primary" : "bg-primary/20"}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline">{card.value}</h3>
              </div>
              <div className="pt-4 border-t border-surface-container-low">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">{card.detailLabel}</span>
                  <span className="font-medium text-on-surface">{card.detailValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bento-style Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Over Time */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline font-bold text-lg">Usage distribution</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Mistral 7B
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-secondary-container" />
                  GPT-4o
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {CHART_BARS.map((bar) => (
                <div
                  key={bar.label}
                  className="flex-1 flex flex-col gap-1 items-center group cursor-pointer"
                >
                  <div
                    className={`w-full rounded-t-sm ${bar.height} transition-all ${
                      bar.active
                        ? "bg-primary relative"
                        : bar.height === "h-4"
                          ? "bg-surface-container-high"
                          : "bg-primary/20 group-hover:bg-primary/30"
                    }`}
                  >
                    {bar.active && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        $0.000046 (Current)
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel: Recent Activity Details */}
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 flex flex-col">
            <h4 className="font-headline font-bold text-lg mb-6">Recent Models</h4>
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Mistral 7B Instruct</p>
                  <p className="text-[11px] text-on-surface-variant">v0.1 -- Active</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">4 reqs</p>
                  <p className="text-[10px] text-on-surface-variant">80% of total</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group opacity-50">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">GPT-4 Turbo</p>
                  <p className="text-[11px] text-on-surface-variant">0314 -- Idle</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">0 reqs</p>
                  <p className="text-[10px] text-on-surface-variant">--</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-3 bg-surface-container-low text-primary text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors">
              View detailed metrics
            </button>
          </div>
        </div>

        {/* Feature Highlight / Export Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-primary-container/5 rounded-2xl p-8 border border-primary/10">
          <div>
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block">
              Pro Feature
            </span>
            <h3 className="text-2xl font-bold font-headline mb-4">Export Usage Reports</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Need to share billing details with your team? Generate detailed CSV or PDF reports of
              all model activity, token usage, and costs across your entire organization.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Download CSV
              </button>
              <button className="px-6 py-2.5 bg-white border border-outline-variant/30 text-on-surface font-semibold rounded-lg text-sm hover:bg-surface-container-low transition-colors">
                Preview PDF
              </button>
            </div>
          </div>
          <div className="relative h-64 bg-white/50 rounded-xl overflow-hidden border border-outline-variant/15 flex items-center justify-center backdrop-blur-sm">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#004ac6 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="z-10 text-center">
              <span className="material-symbols-outlined text-[48px] text-primary/40 mb-3">
                analytics
              </span>
              <p className="text-xs font-medium text-on-surface-variant">
                Visualizing your efficiency pipeline...
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
