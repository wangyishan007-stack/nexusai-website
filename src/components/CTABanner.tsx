import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginModal } from "./LoginModal";

interface CTABannerProps {
  readonly className?: string;
}

export const CTABanner: React.FC<CTABannerProps> = ({ className = "" }) => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const handleClaim = useCallback(() => {
    if (isLoggedIn) {
      navigate("/settings/credits");
    } else {
      setShowLogin(true);
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = useCallback(() => {
    login();
    setShowLogin(false);
    navigate("/settings/credits");
  }, [login, navigate]);

  return (
    <section className={`py-24 bg-surface ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden ambient-shadow">
          <div className="relative z-10">
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-primary mb-8">
              Ready to build the next frontier?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleClaim}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg hover:scale-[1.05] transition-transform"
              >
                Claim Free Credits
              </button>
              <Link
                to="/docs"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Read Documentation
              </Link>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </section>
  );
};
