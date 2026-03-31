import SettingsLayout from "../components/SettingsLayout";

interface PluginsPageProps {
  readonly className?: string;
}

const PLUGINS = [
  {
    name: "Web Search",
    description: "Augment LLM responses with real-time web search results",
    icon: "language",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    status: "Active",
    statusBg: "bg-green-100",
    statusColor: "text-green-700",
    hasToggle: false,
  },
  {
    name: "PDF Inputs",
    description: "Parse and extract content from uploaded PDF files",
    icon: "picture_as_pdf",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    status: "Enabled",
    statusBg: "bg-surface-container",
    statusColor: "text-on-surface-variant",
    hasToggle: false,
  },
  {
    name: "Response Healing",
    description: "Automatically fix malformed JSON responses from LLMs",
    icon: "auto_fix",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    status: null,
    statusBg: "",
    statusColor: "",
    hasToggle: true,
  },
];

export default function PluginsPage({ className }: PluginsPageProps) {
  return (
    <SettingsLayout activeTab="plugins" className={className}>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8">
        {/* Page Header */}
        <div className="max-w-4xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">
            Plugins
          </h2>
          <p className="text-on-surface-variant text-sm">
            Extend your LLM capabilities with modular integrations and specialized tools.
          </p>
        </div>

        {/* Bento Layout Section */}
        <section className="max-w-4xl space-y-6">
          {/* Section Descriptor Card */}
          <div className="bg-surface-container-low rounded-xl p-6 flex items-start space-x-4">
            <div className="p-2 bg-primary/8 rounded-lg text-primary">
              <span className="material-symbols-outlined">info</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Default Plugin Settings
              </h3>
              <p className="text-on-surface-variant text-sm mt-1">
                Configure default plugin behavior for your API requests. These settings apply
                globally unless overridden in specific request payloads.
              </p>
            </div>
          </div>

          {/* Plugin Vertical List */}
          <div className="space-y-3">
            {PLUGINS.map((plugin) => (
              <div
                key={plugin.name}
                className="group bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-300 p-5 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${plugin.iconBg} flex items-center justify-center ${plugin.iconColor} group-hover:scale-110 transition-transform`}
                  >
                    <span className="material-symbols-outlined text-2xl">{plugin.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface">{plugin.name}</h4>
                    <p className="text-on-surface-variant text-sm">{plugin.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {plugin.status && (
                    <span
                      className={`px-2.5 py-1 ${plugin.statusBg} ${plugin.statusColor} text-[10px] font-bold uppercase tracking-wider rounded-md`}
                    >
                      {plugin.status}
                    </span>
                  )}
                  {plugin.hasToggle && (
                    <div className="flex items-center cursor-pointer">
                      <div className="relative w-11 h-6 bg-surface-container-highest rounded-full transition-colors">
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all" />
                      </div>
                      <span className="ml-3 text-xs font-medium text-on-surface-variant">OFF</span>
                    </div>
                  )}
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SettingsLayout>
  );
}
