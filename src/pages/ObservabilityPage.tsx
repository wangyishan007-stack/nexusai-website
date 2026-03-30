import SettingsLayout from "../components/SettingsLayout";

interface ObservabilityPageProps {
  readonly className?: string;
}

const DESTINATIONS = [
  { name: "Arize AI", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4RO8Z8uxaCe9joiQ9yVoCyMnJIf1Br5O_c58QGMbY7fLlcyViILtvxc4Ogh92diCvXD9QY_3j0jG3VwSCaTMj9tPmDx-vlFVUIBFqVjVGMxXIOt7Snzcy5s6CAyvX7wFN3F1jh85EIr0wQ5XBzlbTRdZCNnb7V1HX7RcYJbNCBytauErs_Z7--oLGT7QkczTtjUDQBnmlh4kHowXrYJ11zuWCNxFibg9Zl1DFWL7h-arf2BnJZd_AiPm1LlUXJ2V5QK-BheNI1eIH" },
  { name: "Braintrust", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4aKtFtdZYQa_9D1tnE_vAYtHnVhwyN74HcfmbhuYdTCBP5CCeblgXQFASM-JEg_PsaZ4VPNx-Zl86suxSAi-vENQ5_BExvtxUywjWdpWomwINh5WPgraP9sx6sD5elEpOyc-eAx7AgJjWniPJU-H-GSABxW0YMeurxIuM1LJeO98IgwK_FiWHkMkusfUXcyy21vLVNsUtHTF_2ruhKjA8GLHkxW8w3uJ3NqGJOvWEgZmTOhIpH3HFwJHMQwOJdBLV6lJmfNmlr9An" },
  { name: "ClickHouse", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0nB6zEhop_nol4dkfIDCqGNVe0KIAOF7f3qwwMs0ErjcMq5YZCCWtGa1deXHU6QYQCU02Wc3lM-zKV6peetc5PJeT5yKlaY9qlT7J4LpTtee5MKXgl0NDN7wR2pNUag65pQjznhOnVqDRpJ8qW-plC58nQheMTdySIeL0oKZveIa4VkXQamD1hEnsSSRUzfYvI49K1OGdOAaiCZsy9auXOCibUDn96JdCU4s_SR3EOOFf9WV_mUk22R5IzKUq3LZTDubJ4svjH4sy" },
  { name: "Comet Opik", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXXtu95Ufvgw9RICggCuoIOZZX4CGcGKPYJaPEm1N37us8M7n3LXpFRe_5pFL7le4GVaA7_zlgRwAP-Xs6ybdMdOzEGi8Az6MNrc8VSt-OsxqTQzz-yqThpNUYSujHylfEIJTPAzNSQ2YQR6E8VbeeUMoShPhEUcZJuhrT2eWpHlee-bXKh1NeAI86mdnDwm9cAdvzKNOIvBX8wS_AWVhgz3-cD0baI7EViOKBwxV07gxcCFi3_8pj8XIX0vd7Sj5PNizIxz-dMuYW" },
  { name: "Datadog", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuABzOBnjvRiyiNqUtxEZZ4Yvjz80mWwN7qY_MTa5mshhTcXG4GvcElgaD629nDlCf7EN1XxHIdP_nzoJIH-fwfIZgotZVlu3uWqplndVJyQiPMNMh1nMxQ2Jrb1kdu0jbUmGkDE9eHk_9_asgOL02mkhdhUsSJIixsZABym8KolgYB7K_9y2cyfQiVdqV2ZVTEWavqumWOF4jSbtrMLQezMkmtOtWxbiCh6pWOwRO5khXixW_0ShMhNPRzU4rn3bUjdsnSgPGAkvB-4" },
  { name: "Grafana Cloud", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGKbfN5l4HxcCtRMyoOR6BBXqPDZOeHCHt7iTMtjdOzEtTJXwNjiyac_J3c-MR-PJOLvnjavAFVMiBJ4PH32Umjn-hy0g366YBJJhcD8aqf66CrWgm2mc9JO8Eg7VSiTTD7GLg7EZ7KhjLRDBQVq7oTSL4JeMRe9NlB-dPIah3EmhbeSuDTFUROBedmr_UtmGgy1h5PL91b1OJBIZGbIOrMIzq0IatIjkPGeDU7NJOczanDdDWrWmSqxHCXA03Go07L6r151JLYnDo" },
  { name: "Langfuse", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDFPfPO1UY53Go5cZMGBwOPTxke3VZei6Alj4zbnYTyIo8n_CQawYtePJi-Riz60OeQIs3HBuICBIM_-1_hTg6G9HPdeO9c0_WLi3kncq63VzJTU3JpFP0mSTkuCKFtxQJBLjFxkxJsB9WbCJhokXj7Xw77vqLd-DkUOSsz4sqG7f-F0cat5veUfzdww4ad2LNo1ImJqllMuhBDgv86zrACl7i8xiv41WILDqC4jqpeimyQajNIJcDTP1sfdhAgNwYjvgtle2wppyM" },
  { name: "LangSmith", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJmoWvxbe3tc0b0wp0Z7USM2AURnQOFEDpgztZND5IurpqbB8pqkAXexIdlVoqZ-En7obDzGBORQvXaAYq7r3JYrKncaxTRHVMrdBMEgAcRMkzLODKticHXAMLn7w1P-PU73mBWM4ll9W-yKfsG_qEpVAPWHK3p89TlNn4TPHZ6mM91KO99MavTywEAibq2UpbF9RE9HTwJbANg8jdyySf92AZlJ-NtkpyIvIR5sMMLkDrg9_oSvfhACU1sGDwBHD7S4xvMhiwBtDI" },
  { name: "New Relic AI", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzPuNnKmTc5Qf--Y41df4tqAS6djAkRsbwDffwv-le2yUo01ouved4bUT3iZkHSNOSFjluFBMIxCy9FBlFocLbjH2ru56FSXk4XZkqKH3eqaeLE0nSwB0OaWNokIzoKUe7JQgXrKGJjEIu9CDn-NFV9uF7uCpOcjvK9uPjPgaT57lLC9cb2p3NE_Ea5IRsCMb8jOmd-v1UYUF-tNOHFgtXJkRLuVnTfVJLN4W5PIZOMpDfJYX-_d3Q7btQC2II7YvBPe0k7NAAcQAG" },
  { name: "OpenTelemetry Collector", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE9PeCixOzLzURdT8a4Lkl_44It-QIU5U9lfHR5AbGghdW8uHqte4QVNN7jusXaup_k7VtcxUoSAqS2dj4OHai-VduGNrkco9pA9lynOLa18s8QVZpRoBFNXu6tVJ2tQ-3VDLE1aPVVJQjtS22aomYEg_YnSBnHCCavwKVIgEyzZeaYDEu9nruemZJPMCDiLZRK2efHuyjvuvPcuKrjZ0tY0j9jcS12yq3kLH8JnfClX6XDS1b6vb95SLbaiFLGq0RVp6FPC_l7BhJ" },
  { name: "PostHog", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDYl-fS44BWVDFUf5MV9I6Go_uLtWJhcQ80k4sX71Bip4WaF1WItw6WjM30TJXsYdAKQ28J-E4jzwc7nmdyrekkkPcBl88_szv0WdUXggiRmcmiDAF3lPI4Y1LRqtoC7LLldp1-TaNkCK8ncJjzpkuqmAUYY4o4FOFr3BBMCUBCFIv18TsHLvw5lW53tMyk3mCSzv_aIWMzMWQrrch8TdsWrBv7LyU1KA80T-2HiR3O6zXaA8XeXVzWnA1DIADUWxvaayl49u1Hgyd" },
];

export default function ObservabilityPage({ className }: ObservabilityPageProps) {
  return (
    <SettingsLayout activeTab="observability" className={className}>
      <div className="flex-1 p-10 max-w-6xl w-full mx-auto overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">
            Observability
          </h2>
          <p className="text-on-surface-variant text-sm">
            Integrate with leading performance monitoring and LLM evaluation tools to track every
            token, latency, and trace in real-time.
          </p>
        </header>

        {/* Broadcast Section Card */}
        <section className="mb-12">
          <div className="bg-surface-container-low rounded-xl p-8 border-none relative overflow-hidden group">
            {/* Glassy Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
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
              <div className="flex items-center gap-4 bg-surface-container-lowest px-4 py-2.5 rounded-lg shadow-sm">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Enabled
                </span>
                <button
                  aria-checked="true"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-primary"
                  role="switch"
                >
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
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
            <span className="text-[0.75rem] font-medium text-slate-400">11 Integrations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between group hover:bg-slate-50 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0px_12px_32px_rgba(25,28,30,0.04)] border border-outline-variant/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center p-2 overflow-hidden">
                    <img
                      alt={dest.name}
                      className="w-full h-full object-contain"
                      src={dest.logo}
                    />
                  </div>
                  <span className="font-semibold text-sm text-on-surface tracking-tight">
                    {dest.name}
                  </span>
                </div>
                <button className="px-3 py-1.5 text-[0.7rem] font-bold text-primary hover:bg-primary/5 rounded-md transition-colors flex items-center gap-1">
                  Add Destination <span className="text-lg">+</span>
                </button>
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
    </SettingsLayout>
  );
}
