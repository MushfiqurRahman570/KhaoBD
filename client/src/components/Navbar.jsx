import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function toggleLang() {
    const next = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-brand-600 whitespace-nowrap">
          {t('appName')}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {/* <Link to="/restaurants" className="hover:text-brand-600">{t('nav.restaurants')}</Link> */}
          <Link to="/about" className="hover:text-brand-600">{t('nav.about')}</Link>
          {user?.is_admin && <Link to="/restaurants/new" className="hover:text-brand-600">{t('nav.addRestaurant')}</Link>}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="text-sm font-medium border rounded-full px-3 py-1 hover:bg-gray-50"
          >
            {i18n.language === 'en' ? 'বাংলা' : 'English'}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm font-medium hover:text-brand-600">
                {user.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-brand-600"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium hover:text-brand-600">
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-brand-500 text-white px-4 py-1.5 rounded-full hover:bg-brand-600"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
