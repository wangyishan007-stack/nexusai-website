import SettingsLayout from "../components/SettingsLayout";

const NOTIFICATION_SETTINGS = [
  { label: "Usage alerts", desc: "Get notified when spending exceeds thresholds", enabled: true },
  { label: "Model updates", desc: "New model releases and deprecation notices", enabled: true },
  { label: "Security alerts", desc: "Unusual activity or failed authentication attempts", enabled: true },
  { label: "Marketing emails", desc: "Product tips, case studies, and promotions", enabled: false },
  { label: "Weekly digest", desc: "Summary of usage, costs, and performance metrics", enabled: false },
];

const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "Europe/London (GMT)",
  "Asia/Shanghai (CST)",
  "Asia/Tokyo (JST)",
];

const TEAM_MEMBERS = [
  { name: "Wang Xing", email: "wangxing@nexusai.dev", role: "Owner", avatar: "WX" },
  { name: "Sarah Chen", email: "sarah@nexusai.dev", role: "Admin", avatar: "SC" },
  { name: "Alex Kim", email: "alex@nexusai.dev", role: "Developer", avatar: "AK" },
  { name: "CI Bot", email: "ci@nexusai.dev", role: "Service Account", avatar: "CI" },
];

export default function PreferencesPage() {
  return (
    <SettingsLayout activeTab="preferences">
      <div className="p-8 max-w-7xl mx-auto flex-1">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">Preferences</h2>
          <p className="text-on-surface-variant text-sm">
            Configure your account settings, notifications, and team access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <div className="p-6 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">Profile</h4>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold ring-4 ring-primary/10">
                    WX
                  </div>
                  <div>
                    <button className="text-xs text-primary font-semibold hover:underline">Change avatar</button>
                    <p className="text-[10px] text-on-surface-variant mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Wang Xing"
                      className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="wangxing@nexusai.dev"
                      className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Organization
                  </label>
                  <input
                    type="text"
                    defaultValue="NexusAI Labs"
                    className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* General Settings */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <div className="p-6 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">General</h4>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Timezone
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-outline-variant/30 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz}>{tz}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Language
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-outline-variant/30 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                        <option>English</option>
                        <option>中文 (简体)</option>
                        <option>日本語</option>
                        <option>한국어</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Default Model
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-outline-variant/30 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                      <option>Anthropic: Claude 3.5 Sonnet</option>
                      <option>OpenAI: GPT-4o</option>
                      <option>Google: Gemini 1.5 Pro</option>
                      <option>Meta: Llama 3.1 405B</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-on-surface-variant">Use dark theme for the dashboard</p>
                  </div>
                  <div className="w-10 h-5 bg-surface-container-high rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
                  <div>
                    <p className="text-sm font-medium">Compact Layout</p>
                    <p className="text-xs text-on-surface-variant">Reduce spacing in tables and lists</p>
                  </div>
                  <div className="w-10 h-5 bg-surface-container-high rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <div className="p-6 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">Notifications</h4>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {NOTIFICATION_SETTINGS.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer ${item.enabled ? "bg-primary" : "bg-surface-container-high"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm ${item.enabled ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-surface-container-lowest rounded-xl border border-red-200">
              <div className="p-6 border-b border-red-100">
                <h4 className="font-headline font-bold text-lg text-red-600">Danger Zone</h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delete Organization</p>
                    <p className="text-xs text-on-surface-variant">Permanently remove all data, keys, and configurations</p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors">
                    Delete Organization
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Team */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">Team</h4>
                <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person_add</span>
                  Invite
                </button>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.email} className="flex items-center gap-3 px-6 py-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold ${member.role === "Owner" ? "bg-primary text-white" : member.role === "Service Account" ? "bg-slate-200 text-slate-600" : "bg-primary-container/20 text-primary"}`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">{member.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${member.role === "Owner" ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"}`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sessions */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15">
              <div className="p-6 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">Active Sessions</h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">computer</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">macOS · Chrome</p>
                    <p className="text-[10px] text-on-surface-variant">192.168.1.42 · Current session</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] mt-0.5">phone_iphone</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">iOS · Safari</p>
                    <p className="text-[10px] text-on-surface-variant">10.0.1.15 · 2 days ago</p>
                  </div>
                  <button className="text-[10px] text-red-500 font-semibold hover:underline">Revoke</button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full py-3 bg-primary text-white font-semibold rounded-lg text-sm shadow-sm hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
