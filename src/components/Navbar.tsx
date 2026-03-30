import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";

interface NavbarProps {
  readonly className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { pathname } = useLocation();

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-6 h-20 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900 font-headline">
          NexusAI
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
            Sign In
          </button>
          <Link
            to="/settings/api-keys"
            className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all"
          >
            Get API Key
          </Link>
        </div>
      </div>
    </nav>
  );
};
