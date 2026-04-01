import { useTranslation } from "react-i18next";
import { STATS } from "../data/mockData";

interface StatsProps {
  readonly className?: string;
}

export const Stats: React.FC<StatsProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  return (
    <section className={`bg-surface-container-low py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.labelKey} className="text-center md:text-left">
              <div className="text-3xl font-headline font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
