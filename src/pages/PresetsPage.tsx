import SettingsLayout from "../components/SettingsLayout";

interface PresetsPageProps {
  readonly className?: string;
}

export default function PresetsPage({ className }: PresetsPageProps) {
  return (
    <SettingsLayout activeTab="presets" className={className}>
      <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">
            Presets
          </h1>
        </div>

        {/* Content Area: Empty State */}
        <div className="bg-surface-container-lowest rounded-xl min-h-[500px] flex items-center justify-center border border-outline-variant/15 ambient-shadow">
          <div className="max-w-sm w-full text-center flex flex-col items-center">
            {/* Decorative Icon Container */}
            <div className="w-24 h-24 bg-surface-container rounded-3xl flex items-center justify-center mb-8 rotate-3">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm -rotate-6">
                <span
                  className="material-symbols-outlined text-4xl text-blue-600"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bookmark
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-on-surface mb-3">Create your first preset</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8 px-4">
              Presets are shortcuts for your system prompts and request parameters.{" "}
              <a className="text-primary font-medium hover:underline" href="#">
                Learn more
              </a>
            </p>
            <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                add
              </span>
              New Preset
            </button>
            {/* Subtle Hint Icons */}
            <div className="mt-12 flex items-center gap-4 justify-center grayscale opacity-30">
              <span className="material-symbols-outlined text-2xl">description</span>
              <span className="material-symbols-outlined text-2xl">schema</span>
              <span className="material-symbols-outlined text-2xl">settings_input_component</span>
            </div>
          </div>
        </div>
      </main>
    </SettingsLayout>
  );
}
