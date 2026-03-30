import { Link } from "react-router-dom";
import { FEATURED_MODELS, type ModelCard } from "../data/mockData";

interface FeaturedModelsProps {
  readonly className?: string;
}

const BADGE_STYLES: Record<ModelCard["badgeStyle"], string> = {
  new: "bg-tertiary-fixed text-on-tertiary-fixed",
  popular: "bg-primary-fixed text-on-primary-fixed",
  value: "bg-secondary/20 text-secondary",
};

export const FeaturedModels: React.FC<FeaturedModelsProps> = ({ className = "" }) => {
  return (
    <section className={`py-24 bg-surface-container-lowest ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-4">
              Featured Models
            </h2>
            <p className="text-on-surface-variant text-lg">
              The highest rated intelligence available today.
            </p>
          </div>
          <Link to="/models" className="text-primary font-semibold flex items-center gap-2 group">
            View all
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_outward
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_MODELS.map((model) => (
            <div
              key={model.name}
              className="ambient-shadow bg-surface border border-outline-variant/15 rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-headline font-bold text-xl">{model.name}</h4>
                    <p className="text-xs font-label text-on-surface-variant">
                      {model.provider}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[model.badgeStyle]}`}
                  >
                    {model.badge}
                  </span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Input cost</span>
                    <span className="font-mono font-medium">{model.inputCost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Context</span>
                    <span className="font-mono font-medium">{model.context}</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-lg bg-surface-container-high text-on-surface font-semibold hover:bg-primary-container hover:text-on-primary transition-all">
                  Try Model
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
