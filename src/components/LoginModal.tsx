import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useConnect } from "wagmi";
import { GitHubIcon } from "./icons/GitHubIcon";
import { GoogleIcon } from "./icons/GoogleIcon";
import { MetaMaskIcon } from "./icons/MetaMaskIcon";

interface LoginModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onLogin: () => void;
  readonly onLoginWithWallet: (address: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, onLoginWithWallet }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [walletError, setWalletError] = useState<string | null>(null);
  const { connect, connectors, isPending } = useConnect();

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
      setWalletError(null);
    }
  }, [isOpen]);

  const handleWalletConnect = useCallback(() => {
    setWalletError(null);
    const injected = connectors.find((c) => c.id === "injected");
    if (!injected) {
      setWalletError(t("login.noWallet"));
      return;
    }
    connect(
      { connector: injected },
      {
        onSuccess: (data) => {
          onLoginWithWallet(data.accounts[0]);
        },
        onError: (err) => {
          if (err.message?.includes("rejected")) {
            setWalletError(t("login.connectionRejected"));
          } else {
            setWalletError(t("login.connectionFailed"));
          }
        },
      }
    );
  }, [connect, connectors, onLoginWithWallet]);

  if (!isOpen) return null;

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
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-headline font-bold">{t("login.title")}</h3>
            <p className="text-sm text-on-surface-variant">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Social + Wallet Buttons */}
          <div className="flex gap-3">
            <button
              disabled
              className="flex-1 flex items-center justify-center py-3 rounded-lg border border-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed"
            >
              <GitHubIcon className="w-5 h-5" />
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center py-3 rounded-lg border border-outline-variant/20 text-on-surface-variant/40 cursor-not-allowed"
            >
              <GoogleIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleWalletConnect}
              disabled={isPending}
              className="flex-1 flex items-center justify-center py-3 rounded-lg border border-outline-variant/20 hover:bg-surface-container-low hover:border-primary/30 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
              ) : (
                <MetaMaskIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {walletError && (
            <p className="text-xs text-error text-center">
              {walletError}{" "}
              {walletError.includes("install") && (
                <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t("login.installMetamask")}
                </a>
              )}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-xs text-on-surface-variant font-medium">{t("login.or")}</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Email Form */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1.5">{t("login.emailLabel")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("login.emailPlaceholder")}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={onLogin}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {t("login.continue")}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </button>

          <p className="text-center text-xs text-on-surface-variant">
            {t("login.noAccount")}{" "}
            <button onClick={onLogin} className="text-primary font-semibold hover:underline">
              {t("login.signUp")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
