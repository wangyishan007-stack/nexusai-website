import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import { LoginModal } from "./LoginModal";

const USER_MENU_ITEMS = [
  { icon: "bar_chart", label: "Activity", href: "/settings/activity" },
  { icon: "format_list_bulleted", label: "Logs", href: "/settings/logs" },
  { icon: "credit_card", label: "Credits", href: "/settings/credits" },
  { icon: "settings", label: "Settings", href: "/settings/preferences" },
];

interface NavbarProps {
  readonly className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const { pathname } = useLocation();
  const { isLoggedIn, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogin = useCallback(() => {
    login();
    setShowLogin(false);
  }, [login]);

  // Close menu on outside click
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const visibleLinks = isLoggedIn
    ? NAV_LINKS.filter((link) => link.href !== "/pricing")
    : NAV_LINKS;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/10 ${className}`}>
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">
            NexusAI
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {visibleLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-rose-800 text-white flex items-center justify-center text-sm font-bold hover:opacity-90 transition-all"
              >
                x
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden py-1 z-50">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10">
                    <div className="w-9 h-9 rounded-full bg-rose-800 text-white flex items-center justify-center text-sm font-bold">
                      x
                    </div>
                    <span className="font-semibold text-on-surface">Personal</span>
                    <Link
                      to="/settings/preferences"
                      onClick={() => setShowUserMenu(false)}
                      className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">settings</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    {USER_MENU_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container/60 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl text-on-surface-variant">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-outline-variant/10 py-1">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-surface-container/60 transition-colors w-full"
                    >
                      <span className="material-symbols-outlined text-xl">logout</span>
                      Sign Out
                    </button>
                  </div>

                  <div className="border-t border-outline-variant/10 px-3 py-2">
                    <div className="flex items-center bg-surface-container rounded-lg p-0.5">
                      <button className="flex-1 flex items-center justify-center py-1.5 rounded-md bg-surface-container-lowest shadow-sm text-on-surface text-xs font-medium transition-all">
                        <span className="material-symbols-outlined text-base mr-1">light_mode</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:text-on-surface transition-all">
                        <span className="material-symbols-outlined text-base mr-1">dark_mode</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center py-1.5 rounded-md text-on-surface-variant text-xs font-medium hover:text-on-surface transition-all">
                        <span className="material-symbols-outlined text-base mr-1">desktop_windows</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLogin(true)}
                className="text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
              >
                Sign In
              </button>
              <Link
                to="/settings/api-keys"
                className="bg-primary-container text-on-primary px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 duration-150 transition-all"
              >
                Get API Key
              </Link>
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </>
  );
};
