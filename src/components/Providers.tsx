import { PROVIDERS } from "../data/mockData";

interface ProvidersProps {
  readonly className?: string;
}

export const Providers: React.FC<ProvidersProps> = ({ className = "" }) => {
  return (
    <section className={`py-10 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {PROVIDERS.map((name) => (
            <span key={name} className="font-headline font-bold text-xl">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
