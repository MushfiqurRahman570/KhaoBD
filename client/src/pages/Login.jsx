import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.loginTitle')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-gray-600">
          {t('auth.email')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm text-gray-600">
          {t('auth.password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-500 text-white font-medium py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60"
        >
          {t('auth.loginButton')}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        {t('auth.noAccount')}
        {' '}
        <Link to="/register" className="text-brand-600 font-medium">{t('nav.register')}</Link>
      </p>
    </div>
  );
}
