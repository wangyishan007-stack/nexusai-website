import { useState, useCallback, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";
import { useTheme } from "../contexts/ThemeContext";

const NOTIFICATION_SETTINGS = [
  { labelKey: "preferences.notif_usage_alerts", descKey: "preferences.notif_usage_alerts_desc", id: "usage_alerts", enabled: true },
  { labelKey: "preferences.notif_model_updates", descKey: "preferences.notif_model_updates_desc", id: "model_updates", enabled: true },
  { labelKey: "preferences.notif_security", descKey: "preferences.notif_security_desc", id: "security", enabled: true },
  { labelKey: "preferences.notif_marketing", descKey: "preferences.notif_marketing_desc", id: "marketing", enabled: false },
  { labelKey: "preferences.notif_weekly_digest", descKey: "preferences.notif_weekly_digest_desc", id: "weekly_digest", enabled: false },
];

const TIMEZONE_OPTIONS = [
  "UTC",
  "America/New_York (EST)",
  "America/Los_Angeles (PST)",
  "Europe/London (GMT)",
  "Asia/Shanghai (CST)",
  "Asia/Tokyo (JST)",
];


export default function PreferencesPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, resolved } = useTheme();
  const darkMode = resolved === "dark";
  const [compactLayout, setCompactLayout] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const item of NOTIFICATION_SETTINGS) init[item.id] = item.enabled;
    return init;
  });

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }, []);

  return (
    <SettingsLayout activeTab="preferences">
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">{t("preferences.title")}</h2>
          <p className="text-on-surface-variant text-sm">
            {t("preferences.subtitle")}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
            {/* Profile Section */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">{t("preferences.section_profile")}</h4>
              </div>
              <div className="p-5 sm:p-6 space-y-6">
                <div className="flex items-center gap-6">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/10" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-xl font-bold ring-4 ring-primary/10">
                      WX
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-primary font-semibold hover:underline cursor-pointer">
                      {t("preferences.change_avatar")}
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                    <p className="text-[10px] text-on-surface-variant mt-1">{t("preferences.avatar_hint")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      {t("preferences.label_display_name")}
                    </label>
                    <input
                      type="text"
                      defaultValue="Wang Xing"
                      className="w-full bg-surface-container-lowest rounded-lg px-3 py-2 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      {t("preferences.label_email")}
                    </label>
                    <input
                      type="email"
                      defaultValue="wangxing@nexusai.dev"
                      className="w-full bg-surface-container-lowest rounded-lg px-3 py-2 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    {t("preferences.label_organization")}
                  </label>
                  <input
                    type="text"
                    defaultValue="NexusAI Labs"
                    className="w-full bg-surface-container-lowest rounded-lg px-3 py-2 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* General Settings */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">{t("preferences.section_general")}</h4>
              </div>
              <div className="p-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      {t("preferences.label_timezone")}
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-surface-container-lowest rounded-lg px-3 py-2 pr-10 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all">
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz}>{tz}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 18 }}>
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      {t("preferences.label_language")}
                    </label>
                    <div className="relative">
                      <select
                        value={i18n.language.startsWith('zh') ? 'zh' : 'en'}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest rounded-lg px-3 py-2 pr-10 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all"
                      >
                        <option value="en">English</option>
                        <option value="zh">中文 (简体)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 18 }}>
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    {t("preferences.label_default_model")}
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-surface-container-lowest rounded-lg px-3 py-2 pr-10 text-sm border border-outline-variant/10 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all">
                      <option>Anthropic: Claude 3.5 Sonnet</option>
                      <option>OpenAI: GPT-4o</option>
                      <option>Google: Gemini 1.5 Pro</option>
                      <option>Meta: Llama 3.1 405B</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" style={{ fontSize: 18 }}>
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
                  <div>
                    <p className="text-sm font-medium">{t("preferences.toggle_dark_mode")}</p>
                    <p className="text-xs text-on-surface-variant">{t("preferences.toggle_dark_mode_desc")}</p>
                  </div>
                  <div onClick={() => setTheme(darkMode ? "light" : "dark")} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${darkMode ? "bg-primary" : "bg-surface-container-highest"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${darkMode ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
                  <div>
                    <p className="text-sm font-medium">{t("preferences.toggle_compact_layout")}</p>
                    <p className="text-xs text-on-surface-variant">{t("preferences.toggle_compact_layout_desc")}</p>
                  </div>
                  <div onClick={() => setCompactLayout((p) => !p)} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${compactLayout ? "bg-primary" : "bg-surface-container-highest"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${compactLayout ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-outline-variant/10">
                <h4 className="font-headline font-bold text-lg">{t("preferences.section_notifications")}</h4>
              </div>
              <div className="divide-y divide-outline-variant/10">
                {NOTIFICATION_SETTINGS.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{t(item.labelKey)}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{t(item.descKey)}</p>
                    </div>
                    <div
                      onClick={() => setNotifications((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${notifications[item.id] ? "bg-primary" : "bg-surface-container-highest"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${notifications[item.id] ? "right-0.5" : "left-0.5"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-error/10">
                <h4 className="font-headline font-bold text-lg text-error">{t("preferences.section_danger")}</h4>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{t("preferences.delete_organization")}</p>
                    <p className="text-xs text-on-surface-variant">{t("preferences.delete_organization_desc")}</p>
                  </div>
                  <button className="px-4 py-2 text-error bg-error/5 text-xs font-semibold rounded-lg hover:bg-error/10 transition-colors w-fit">
                    {t("preferences.delete_organization")}
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
