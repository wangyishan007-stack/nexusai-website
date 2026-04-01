import { useState, useCallback } from "react";
import SettingsLayout from "../components/SettingsLayout";

interface ObservabilityPageProps {
  readonly className?: string;
}

interface Destination {
  name: string;
  logo: string;
  fields?: { label: string; placeholder: string; hasEye?: boolean; hasInfo?: boolean }[];
}

const DESTINATIONS: Destination[] = [
  {
    name: "Arize AI",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4RO8Z8uxaCe9joiQ9yVoCyMnJIf1Br5O_c58QGMbY7fLlcyViILtvxc4Ogh92diCvXD9QY_3j0jG3VwSCaTMj9tPmDx-vlFVUIBFqVjVGMxXIOt7Snzcy5s6CAyvX7wFN3F1jh85EIr0wQ5XBzlbTRdZCNnb7V1HX7RcYJbNCBytauErs_Z7--oLGT7QkczTtjUDQBnmlh4kHowXrYJ11zuWCNxFibg9Zl1DFWL7h-arf2BnJZd_AiPm1LlUXJ2V5QK-BheNI1eIH",
    fields: [
      { label: "API Key", placeholder: "arize_...", hasEye: true, hasInfo: true },
      { label: "Space Key", placeholder: "space_...", hasEye: true, hasInfo: false },
      { label: "Model ID", placeholder: "model_...", hasEye: false, hasInfo: true },
      { label: "Base URL (optional)", placeholder: "https://otlp.arize.com", hasEye: false, hasInfo: true },
      { label: "Headers (optional)", placeholder: '{"Authorization": "Bearer token", "X-Custom-Header": "value"}', hasEye: false, hasInfo: true },
    ],
  },
  {
    name: "Braintrust",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4aKtFtdZYQa_9D1tnE_vAYtHnVhwyN74HcfmbhuYdTCBP5CCeblgXQFASM-JEg_PsaZ4VPNx-Zl86suxSAi-vENQ5_BExvtxUywjWdpWomwINh5WPgraP9sx6sD5elEpOyc-eAx7AgJjWniPJU-H-GSABxW0YMeurxIuM1LJeO98IgwK_FiWHkMkusfUXcyy21vLVNsUtHTF_2ruhKjA8GLHkxW8w3uJ3NqGJOvWEgZmTOhIpH3HFwJHMQwOJdBLV6lJmfNmlr9An",
    fields: [
      { label: "API Key", placeholder: "bt_...", hasEye: true, hasInfo: true },
      { label: "Project Name", placeholder: "my-project", hasEye: false, hasInfo: false },
    ],
  },
  {
    name: "ClickHouse",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0nB6zEhop_nol4dkfIDCqGNVe0KIAOF7f3qwwMs0ErjcMq5YZCCWtGa1deXHU6QYQCU02Wc3lM-zKV6peetc5PJeT5yKlaY9qlT7J4LpTtee5MKXgl0NDN7wR2pNUag65pQjznhOnVqDRpJ8qW-plC58nQheMTdySIeL0oKZveIa4VkXQamD1hEnsSSRUzfYvI49K1OGdOAaiCZsy9auXOCibUDn96JdCU4s_SR3EOOFf9WV_mUk22R5IzKUq3LZTDubJ4svjH4sy",
    fields: [
      { label: "Connection URL", placeholder: "https://...", hasEye: false, hasInfo: true },
      { label: "Username", placeholder: "default", hasEye: false, hasInfo: false },
      { label: "Password", placeholder: "••••••", hasEye: true, hasInfo: false },
      { label: "Database", placeholder: "default", hasEye: false, hasInfo: false },
    ],
  },
  { name: "Comet Opik", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXXtu95Ufvgw9RICggCuoIOZZX4CGcGKPYJaPEm1N37us8M7n3LXpFRe_5pFL7le4GVaA7_zlgRwAP-Xs6ybdMdOzEGi8Az6MNrc8VSt-OsxqTQzz-yqThpNUYSujHylfEIJTPAzNSQ2YQR6E8VbeeUMoShPhEUcZJuhrT2eWpHlee-bXKh1NeAI86mdnDwm9cAdvzKNOIvBX8wS_AWVhgz3-cD0baI7EViOKBwxV07gxcCFi3_8pj8XIX0vd7Sj5PNizIxz-dMuYW" },
  { name: "Datadog", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuABzOBnjvRiyiNqUtxEZZ4Yvjz80mWwN7qY_MTa5mshhTcXG4GvcElgaD629nDlCf7EN1XxHIdP_nzoJIH-fwfIZgotZVlu3uWqplndVJyQiPMNMh1nMxQ2Jrb1kdu0jbUmGkDE9eHk_9_asgOL02mkhdhUsSJIixsZABym8KolgYB7K_9y2cyfQiVdqV2ZVTEWavqumWOF4jSbtrMLQezMkmtOtWxbiCh6pWOwRO5khXixW_0ShMhNPRzU4rn3bUjdsnSgPGAkvB-4" },
  { name: "Grafana Cloud", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGKbfN5l4HxcCtRMyoOR6BBXqPDZOeHCHt7iTMtjdOzEtTJXwNjiyac_J3c-MR-PJOLvnjavAFVMiBJ4PH32Umjn-hy0g366YBJJhcD8aqf66CrWgm2mc9JO8Eg7VSiTTD7GLg7EZ7KhjLRDBQVq7oTSL4JeMRe9NlB-dPIah3EmhbeSuDTFUROBedmr_UtmGgy1h5PL91b1OJBIZGbIOrMIzq0IatIjkPGeDU7NJOczanDdDWrWmSqxHCXA03Go07L6r151JLYnDo" },
  { name: "Langfuse", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDFPfPO1UY53Go5cZMGBwOPTxke3VZei6Alj4zbnYTyIo8n_CQawYtePJi-Riz60OeQIs3HBuICBIM_-1_hTg6G9HPdeO9c0_WLi3kncq63VzJTU3JpFP0mSTkuCKFtxQJBLjFxkxJsB9WbCJhokXj7Xw77vqLd-DkUOSsz4sqG7f-F0cat5veUfzdww4ad2LNo1ImJqllMuhBDgv86zrACl7i8xiv41WILDqC4jqpeimyQajNIJcDTP1sfdhAgNwYjvgtle2wppyM" },
  { name: "LangSmith", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJmoWvxbe3tc0b0wp0Z7USM2AURnQOFEDpgztZND5IurpqbB8pqkAXexIdlVoqZ-En7obDzGBORQvXaAYq7r3JYrKncaxTRHVMrdBMEgAcRMkzLODKticHXAMLn7w1P-PU73mBWM4ll9W-yKfsG_qEpVAPWHK3p89TlNn4TPHZ6mM91KO99MavTywEAibq2UpbF9RE9HTwJbANg8jdyySf92AZlJ-NtkpyIvIR5sMMLkDrg9_oSvfhACU1sGDwBHD7S4xvMhiwBtDI" },
  { name: "New Relic AI", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzPuNnKmTc5Qf--Y41df4tqAS6djAkRsbwDffwv-le2yUo01ouved4bUT3iZkHSNOSFjluFBMIxCy9FBlFocLbjH2ru56FSXk4XZkqKH3eqaeLE0nSwB0OaWNokIzoKUe7JQgXrKGJjEIu9CDn-NFV9uF7uCpOcjvK9uPjPgaT57lLC9cb2p3NE_Ea5IRsCMb8jOmd-v1UYUF-tNOHFgtXJkRLuVnTfVJLN4W5PIZOMpDfJYX-_d3Q7btQC2II7YvBPe0k7NAAcQAG" },
  { name: "OpenTelemetry Collector", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE9PeCixOzLzURdT8a4Lkl_44It-QIU5U9lfHR5AbGghdW8uHqte4QVNN7jusXaup_k7VtcxUoSAqS2dj4OHai-VduGNrkco9pA9lynOLa18s8QVZpRoBFNXu6tVJ2tQ-3VDLE1aPVVJQjtS22aomYEg_YnSBnHCCavwKVIgEyzZeaYDEu9nruemZJPMCDiLZRK2efHuyjvuvPcuKrjZ0tY0j9jcS12yq3kLH8JnfClX6XDS1b6vb95SLbaiFLGq0RVp6FPC_l7BhJ" },
  { name: "PostHog", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDYl-fS44BWVDFUf5MV9I6Go_uLtWJhcQ80k4sX71Bip4WaF1WItw6WjM30TJXsYdAKQ28J-E4jzwc7nmdyrekkkPcBl88_szv0WdUXggiRmcmiDAF3lPI4Y1LRqtoC7LLldp1-TaNkCK8ncJjzpkuqmAUYY4o4FOFr3BBMCUBCFIv18TsHLvw5lW53tMyk3mCSzv_aIWMzMWQrrch8TdsWrBv7LyU1KA80T-2HiR3O6zXaA8XeXVzWnA1DIADUWxvaayl49u1Hgyd" },
];

const DEFAULT_FIELDS = [
  { label: "API Key", placeholder: "key_...", hasEye: true, hasInfo: true },
  { label: "Base URL (optional)", placeholder: "https://...", hasEye: false, hasInfo: true },
  { label: "Headers (optional)", placeholder: '{"Authorization": "Bearer token"}', hasEye: false, hasInfo: true },
];

const API_KEYS_MOCK = ["sk-or-v1-prod-****a3f2", "sk-or-v1-dev-****b7d1", "sk-or-v1-test-****c9e4"];

function DestinationDetailView({
  dest,
  onBack,
  onAdd,
}: {
  dest: Destination;
  onBack: () => void;
  onAdd: () => void;
}) {
  const fields = dest.fields ?? DEFAULT_FIELDS;
  const [showFields, setShowFields] = useState<Record<string, boolean>>({});
  const [privacyMode, setPrivacyMode] = useState(false);
  const [samplingRate, setSamplingRate] = useState("1");
  const [_apiKeyFilter, _setApiKeyFilter] = useState("");
  const [apiKeyDropOpen, setApiKeyDropOpen] = useState(false);
  const [selectedApiKeys, setSelectedApiKeys] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [traceStatus, setTraceStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleTestConnection = useCallback(() => {
    setTestStatus("loading");
    setTimeout(() => setTestStatus("success"), 1500);
  }, []);

  const handleSendTrace = useCallback(() => {
    setTraceStatus("loading");
    setTimeout(() => setTraceStatus("success"), 1200);
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-4xl w-full mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center p-1.5 overflow-hidden">
          <img alt={dest.name} className="w-full h-full object-contain" src={dest.logo} />
        </div>
        <h2 className="text-xl font-bold font-headline tracking-tight">
          New {dest.name} Destination
        </h2>
        <button
          onClick={onAdd}
          className="ml-auto px-5 py-2 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Add
        </button>
      </div>

      <div className="space-y-10">
        {/* Connection Fields */}
        <section className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            Configure your connection before saving.{" "}
            <a href="/docs" className="text-primary hover:underline inline-flex items-center gap-0.5">
              Visit {dest.name}
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
            </a>
          </p>
          {fields.map((f) => (
            <div key={f.label}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="text-sm font-medium text-on-surface">{f.label}</label>
                {f.hasInfo && (
                  <div className="relative group/tip">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                    <div className="absolute left-0 bottom-full mb-2 w-52 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                      Enter your {f.label.toLowerCase()} from {dest.name}.
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type={f.hasEye && !showFields[f.label] ? "password" : "text"}
                  placeholder={f.placeholder}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all pr-10"
                />
                {f.hasEye && (
                  <button
                    onClick={() => setShowFields((prev) => ({ ...prev, [f.label]: !prev[f.label] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {showFields[f.label] ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Test Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testStatus === "loading"}
              className="px-4 py-2 border border-outline-variant/30 text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {testStatus === "loading" && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>}
              {testStatus === "success" && <span className="material-symbols-outlined text-green-600" style={{ fontSize: 16 }}>check_circle</span>}
              Test Connection
            </button>
            <button
              onClick={handleSendTrace}
              disabled={traceStatus === "loading"}
              className="px-4 py-2 border border-outline-variant/30 text-on-surface text-sm font-medium rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {traceStatus === "loading" && <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>}
              {traceStatus === "success" && <span className="material-symbols-outlined text-green-600" style={{ fontSize: 16 }}>check_circle</span>}
              Send Trace
            </button>
            {testStatus === "success" && <span className="text-xs text-green-600 font-medium">Connection successful</span>}
            {traceStatus === "success" && testStatus !== "success" && <span className="text-xs text-green-600 font-medium">Trace sent</span>}
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* Privacy */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>shield</span>
              <h3 className="font-semibold text-sm text-on-surface">Privacy</h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Control what data is sent to this destination.
            </p>
          </div>
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyMode}
                onChange={() => setPrivacyMode(!privacyMode)}
                className="w-4 h-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-on-surface">Privacy Mode</span>
                <p className="text-xs text-on-surface-variant mt-0.5">When enabled, excludes prompt and completion data from traces.</p>
              </div>
            </label>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* Sampling */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>tune</span>
              <h3 className="font-semibold text-sm text-on-surface">Sampling</h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Control what percentage of traces are sent to this destination.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-sm font-medium text-on-surface">Rate</label>
              <div className="relative group/tip">
                <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                <div className="absolute left-0 bottom-full mb-2 w-52 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                  Value between 0 and 1. For example, 0.5 means 50% of traces will be sent.
                </div>
              </div>
            </div>
            <input
              type="text"
              value={samplingRate}
              onChange={(e) => setSamplingRate(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
            />
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* API Key Filter */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>key</span>
              <h3 className="font-semibold text-sm text-on-surface">API Key Filter</h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Optionally filter traces by API key.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-sm font-medium text-on-surface">API Key Filter (optional)</label>
              <div className="relative group/tip">
                <span className="material-symbols-outlined text-on-surface-variant cursor-help" style={{ fontSize: 16 }}>info</span>
                <div className="absolute left-0 bottom-full mb-2 w-52 bg-surface-container-high border border-outline-variant/20 rounded-xl shadow-lg p-3 z-30 opacity-0 pointer-events-none group-hover/tip:opacity-100 group-hover/tip:pointer-events-auto transition-opacity text-xs text-on-surface leading-relaxed">
                  Only send traces from selected API keys.
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setApiKeyDropOpen(!apiKeyDropOpen)}
                className="w-full flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className={selectedApiKeys.length > 0 ? "text-on-surface" : "text-on-surface-variant/50"}>
                  {selectedApiKeys.length > 0 ? `${selectedApiKeys.length} key(s) selected` : "Select API keys"}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>unfold_more</span>
              </button>
              {apiKeyDropOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-lg z-20 py-1">
                  {API_KEYS_MOCK.map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setSelectedApiKeys((prev) =>
                          prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
                        );
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <span className={`material-symbols-outlined ${selectedApiKeys.includes(k) ? "text-primary" : "text-on-surface-variant/30"}`} style={{ fontSize: 18 }}>
                        {selectedApiKeys.includes(k) ? "check_box" : "check_box_outline_blank"}
                      </span>
                      <span className="font-mono text-xs">{k}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <hr className="border-outline-variant/10" />

        {/* Filter Rules */}
        <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>filter_alt</span>
              <h3 className="font-semibold text-sm text-on-surface">Filter Rules</h3>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Only send traces that match specific criteria.
            </p>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant mb-3">No filter rules configured. All traces will be sent to this destination.</p>
            <button className="flex items-center gap-1.5 text-sm text-on-surface font-medium border border-outline-variant/30 rounded-lg px-3.5 py-2 hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
              Add Filter Rule
            </button>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}

export default function ObservabilityPage({ className }: ObservabilityPageProps) {
  const [broadcastEnabled, setBroadcastEnabled] = useState(true);
  const [activeDestinations, setActiveDestinations] = useState<Set<string>>(new Set());
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const handleAddDest = useCallback(() => {
    if (selectedDest) {
      setActiveDestinations((prev) => new Set(prev).add(selectedDest.name));
      setSelectedDest(null);
    }
  }, [selectedDest]);

  return (
    <SettingsLayout activeTab="observability" className={className}>
      {selectedDest ? (
        <DestinationDetailView
          dest={selectedDest}
          onBack={() => setSelectedDest(null)}
          onAdd={handleAddDest}
        />
      ) : (
        <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto overflow-y-auto">
          <header className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
              Observability
            </h2>
            <p className="text-on-surface-variant text-sm">
              Integrate with leading performance monitoring and LLM evaluation tools to track every
              token, latency, and trace in real-time.
            </p>
          </header>

          {/* Broadcast Section Card */}
          <section className="mb-12">
            <div className="bg-surface-container-low rounded-xl p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-primary/8 rounded-xl flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-primary text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      sensors
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-background tracking-tight">
                      Broadcast
                    </h2>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Stream your logs and traces automatically to third-party providers. When enabled,
                      every interaction through the gateway is securely dispatched to your active
                      destinations.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-surface-container-lowest px-4 py-2.5 rounded-lg">
                  <span className={`text-xs font-semibold tracking-wider uppercase ${broadcastEnabled ? "text-primary" : "text-on-surface-variant"}`}>
                    {broadcastEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    aria-checked={broadcastEnabled}
                    onClick={() => setBroadcastEnabled((prev) => !prev)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${broadcastEnabled ? "bg-primary" : "bg-surface-container-highest"}`}
                    role="switch"
                  >
                    <span className={`${broadcastEnabled ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Destinations Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-[0.15em]">
                Available Destinations
              </h3>
              <div className="h-px flex-1 bg-outline-variant/20 mx-6" />
              <span className="text-[0.75rem] font-medium text-on-surface-variant">{DESTINATIONS.length} Integrations</span>
            </div>
            <div className="rounded-xl overflow-hidden bg-surface-container-lowest">
              {DESTINATIONS.map((dest, i) => (
                <div
                  key={dest.name}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-surface-container/40 transition-colors ${i < DESTINATIONS.length - 1 ? "border-b border-outline-variant/10" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center p-1.5 overflow-hidden">
                      <img alt={dest.name} className="w-full h-full object-contain" src={dest.logo} />
                    </div>
                    <span className="font-medium text-sm text-on-surface">{dest.name}</span>
                  </div>
                  {activeDestinations.has(dest.name) ? (
                    <span className="flex items-center gap-1.5 text-sm text-primary font-medium">
                      Connected
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedDest(dest)}
                      className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Add Destination
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Technical Info Footer */}
          <footer className="mt-16 bg-surface-container-low rounded-xl p-6 flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant">info</span>
            <p className="text-sm text-on-surface-variant font-medium">
              Looking for a different provider? NexusAI supports custom{" "}
              <span className="text-primary hover:underline cursor-pointer font-bold">
                Webhook Destinations
              </span>{" "}
              for custom telemetry pipelines.
            </p>
          </footer>
        </div>
      )}
    </SettingsLayout>
  );
}
