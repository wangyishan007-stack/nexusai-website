import { Link } from "react-router-dom";

interface HeroProps {
  readonly className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = "" }) => {
  return (
    <section className={`relative overflow-hidden hero-gradient pt-24 pb-20 md:pt-32 md:pb-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="inline-block py-1 px-4 mb-6 rounded-full bg-secondary/10 text-primary font-label text-sm font-semibold tracking-wider uppercase">
          Intelligence Unified
        </span>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-background tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
          Access Any AI Model, One Integration
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Route to 300+ models from 50+ providers with a single API. OpenAI-compatible, high-performance, and infinitely scalable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/settings/api-keys"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold text-lg ambient-shadow hover:scale-[1.02] transition-transform text-center"
          >
            Get API Key
          </Link>
          <Link
            to="/models"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-container-high text-primary font-semibold text-lg hover:bg-surface-container-highest transition-colors text-center"
          >
            Explore Models
          </Link>
        </div>
      </div>
    </section>
  );
};
