import { useTranslation } from "react-i18next";
import { SHOWCASE_APPS } from "../data/mockData";

interface ShowcaseProps {
  readonly className?: string;
}

export const Showcase: React.FC<ShowcaseProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  return (
    <section className={`py-24 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="font-headline text-3xl font-extrabold mb-4">{t("showcase.title")}</h2>
        <p className="text-on-surface-variant">
          {t("showcase.subtitle")}
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {SHOWCASE_APPS.map((app) => (
          <div key={app.name} className="group cursor-pointer">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-surface-container-highest">
              <img
                alt={`${app.name} Preview`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                src={app.imageUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">{app.icon}</span>
                </div>
              </div>
            </div>
            <h4 className="font-headline font-bold text-xl mb-2">{app.name}</h4>
            <p className="text-on-surface-variant text-sm">{t(app.categoryKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
