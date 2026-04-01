import { useTranslation } from "react-i18next";
import { GET_STARTED_STEPS, CODE_SNIPPET } from "../data/mockData";

interface GetStartedProps {
  readonly className?: string;
}

export const GetStarted: React.FC<GetStartedProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  return (
    <section className={`py-24 bg-surface-container-low ${className}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-headline text-3xl font-extrabold mb-10">
            {t("getStarted.title")}
          </h2>
          <div className="space-y-8">
            {GET_STARTED_STEPS.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-bold mb-1">{t(item.titleKey)}</h4>
                  <p className="text-on-surface-variant text-sm">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0f172a] rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="flex gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <pre className="text-sm font-mono text-slate-300 leading-relaxed overflow-x-auto">
            <code>{CODE_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};
