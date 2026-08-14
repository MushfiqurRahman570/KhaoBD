import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('auth.registerTitle')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-gray-600">
          {t('auth.name')}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </label>
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
            minLength={6}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-500 text-white font-medium py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60"
        >
          {t('auth.registerButton')}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        {t('auth.hasAccount')}
        {' '}
        <Link to="/login" className="text-brand-600 font-medium">{t('nav.login')}</Link>
      </p>
    </div>
  );
}
