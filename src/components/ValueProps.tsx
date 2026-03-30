import { VALUE_PROPS } from "../data/mockData";

interface ValuePropsProps {
  readonly className?: string;
}

export const ValueProps: React.FC<ValuePropsProps> = ({ className = "" }) => {
  return (
    <section className={`py-24 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.title}
              className="p-8 rounded-2xl bg-surface-container-low transition-all hover:bg-surface-container-high group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-6 group-hover:bg-primary-container/20 transition-colors">
                <span className="material-symbols-outlined text-primary">
                  {prop.icon}
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold mb-3">{prop.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
