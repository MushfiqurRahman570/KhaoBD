import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <p>
          © {year} {t('appName')}. {t('footer.rights')}
        </p>
        <nav className="flex items-center gap-5">
          <Link to="/about" className="hover:text-brand-600">{t('nav.about')}</Link>
          {/* <Link to="/restaurants" className="hover:text-brand-600">{t('nav.restaurants')}</Link> */}
          <a href="mailto:hello@khaobd.com" className="hover:text-brand-600">{t('footer.contact')}</a>
        </nav>
      </div>
    </footer>
  );
}
