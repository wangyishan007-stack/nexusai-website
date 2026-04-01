import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FOOTER_SECTIONS } from "../data/mockData";

interface FooterProps {
  readonly className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  return (
    <footer className={`w-full pt-8 sm:pt-16 pb-6 sm:pb-8 bg-surface-container-low border-t border-outline-variant/10 ${className}`}>
      {/* Link sections - hidden on mobile */}
      <div className="hidden sm:grid max-w-7xl mx-auto px-6 grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1 space-y-6">
          <Link to="/" className="text-xl font-bold text-on-surface font-headline">NexusAI</Link>
          <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
            {t("footer.tagline")}
          </p>
        </div>
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.titleKey}>
            <h5 className="font-headline font-semibold uppercase tracking-widest text-xs mb-6 text-on-surface">
              {t(section.titleKey)}
            </h5>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={link.labelKey}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {t(link.labelKey)}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {t(link.labelKey)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:pt-8 sm:border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        <p className="text-xs sm:text-sm text-on-surface-variant">{t("footer.copyright")}</p>
        <div className="flex gap-4 sm:gap-8">
          <Link to="/docs" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">{t("footer.privacyPolicy")}</Link>
          <Link to="/docs" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">{t("footer.termsOfService")}</Link>
          <Link to="/docs" className="text-xs sm:text-sm text-on-surface-variant hover:text-primary transition-colors">{t("footer.cookiePolicy")}</Link>
        </div>
      </div>
    </footer>
  );
};
