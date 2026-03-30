import { Link } from "react-router-dom";
import { FOOTER_SECTIONS } from "../data/mockData";

interface FooterProps {
  readonly className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`w-full pt-16 pb-8 bg-slate-50 border-t border-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="text-xl font-bold text-slate-900 font-headline">NexusAI</Link>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            The intelligent layer for modern AI engineering. One API, every frontier model.
          </p>
        </div>
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h5 className="font-headline font-semibold uppercase tracking-widest text-xs mb-6 text-slate-900">
              {section.title}
            </h5>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-blue-500 transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-slate-500">&copy; 2024 NexusAI Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="text-sm text-slate-500 hover:text-blue-500 transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-slate-500 hover:text-blue-500 transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-slate-500 hover:text-blue-500 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
