import { useState, useEffect } from "react";

interface LoginModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onLogin();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mt-[20vh] w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h3 className="text-lg font-headline font-bold">Sign in to continue</h3>
            <p className="text-sm text-on-surface-variant">
              Sign in to access this feature.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
          <p className="text-center text-xs text-on-surface-variant">
            Don't have an account?{" "}
            <button className="text-primary font-semibold hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
