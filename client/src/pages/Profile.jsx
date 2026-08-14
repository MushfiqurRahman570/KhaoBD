import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { fetchMyBookings, cancelBooking } from '../api/bookings';
import { fetchFavorites } from '../api/favorites';
import { updateProfile, changePassword, uploadAvatar } from '../api/auth';
import { FEATURES } from '../config/features';
import Spinner from '../components/Spinner';
import Seo from '../components/Seo';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

function resolveUrl(url) {
  if (!url) return url;
  return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
}

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(FEATURES.booking ? 'bookings' : 'favorites');

  function loadBookings() {
    if (!FEATURES.booking) return;
    fetchMyBookings().then((d) => setBookings(d.bookings)).finally(() => setLoading(false));
  }

  function loadFavorites() {
    fetchFavorites().then((d) => setFavorites(d.favorites || [])).catch(() => setFavorites([]));
  }

  useEffect(() => {
    loadBookings();
    loadFavorites();
    if (!FEATURES.booking) setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCancel(id) {
    await cancelBooking(id);
    loadBookings();
  }

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title={t('nav.profile')} path="/profile" />

      {/* Profile Header Card */}
      <div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            {user?.avatar_url ? (
              <img
                src={resolveUrl(user.avatar_url)}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="top-16 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8 text-sm font-medium text-gray-600 overflow-x-auto">
            {FEATURES.booking && (
              <button
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`py-4 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent hover:text-gray-900'
                }`}
              >
                {t('booking.myBookings')}
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`py-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'favorites'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent hover:text-gray-900'
              }`}
            >
              {t('nav.favorites')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`py-4 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'settings'
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent hover:text-gray-900'
              }`}
            >
              {t('profile.settings')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {FEATURES.booking && activeTab === 'bookings' && (
          <div className="space-y-8">
            {/* Confirmed Bookings */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">✅</span>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('booking.myBookings')}
                  {' '}
                  - Confirmed
                </h2>
              </div>
              {loading ? (
                <Spinner label={t('common.loading')} />
              ) : confirmedBookings.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <p className="text-blue-700">{t('common.noResults')}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {confirmedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {b.Restaurant?.name_en}
                          </h3>
                          <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span>
                                {b.date}
                                {' at '}
                                {b.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>👥</span>
                              <span>
                                {b.party_size}
                                {' guests'}
                              </span>
                            </div>
                          </div>
                          <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            {t(`booking.status.${b.status}`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Pending Bookings */}
            {pendingBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⏳</span>
                  <h2 className="text-lg font-semibold text-gray-900">Pending Confirmation</h2>
                </div>
                <div className="grid gap-4">
                  {pendingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl p-6 border border-yellow-200 bg-yellow-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {b.Restaurant?.name_en}
                          </h3>
                          <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span>
                                {b.date}
                                {' at '}
                                {b.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>👥</span>
                              <span>
                                {b.party_size}
                                {' guests'}
                              </span>
                            </div>
                          </div>
                          <span className="inline-block mt-3 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                            {t(`booking.status.${b.status}`)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCancel(b.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-lg hover:bg-red-200 transition-colors"
                        >
                          {t('booking.cancel')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">❌</span>
                  <h2 className="text-lg font-semibold text-gray-900">Cancelled</h2>
                </div>
                <div className="grid gap-4">
                  {cancelledBookings.map((b) => (
                    <div key={b.id} className="bg-white rounded-xl p-6 border border-gray-200 opacity-75">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {b.Restaurant?.name_en}
                          </h3>
                          <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span>
                                {b.date}
                                {' at '}
                                {b.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>👥</span>
                              <span>
                                {b.party_size}
                                {' guests'}
                              </span>
                            </div>
                          </div>
                          <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                            {t(`booking.status.${b.status}`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {loading === false && bookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">📭</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <Link
                  to="/restaurants"
                  className="inline-block px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Explore Restaurants
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">📌</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6">Add restaurants to your favorites for quick access!</p>
                <Link
                  to="/restaurants"
                  className="inline-block px-6 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((fav) => {
                  const restaurant = fav.Restaurant || fav;
                  return (
                    <Link
                      key={restaurant.id}
                      to={`/restaurants/${restaurant.id}`}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {restaurant.cover_photo_url && (
                        <img
                          src={resolveUrl(restaurant.cover_photo_url)}
                          alt={restaurant.name_en}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name_en}</h3>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-sm font-semibold text-gray-900">
                            ⭐
                            {' '}
                            {restaurant.avg_rating || 'N/A'}
                          </span>
                          <span className="text-sm text-gray-500">
                            (
                            {restaurant.review_count || 0}
                            {' '}
                            reviews)
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsPanel user={user} updateUser={updateUser} />
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ user, updateUser }) {
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMsg, setNameMsg] = useState('');
  const [nameError, setNameError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  async function handleNameSave(e) {
    e.preventDefault();
    setNameSaving(true);
    setNameError('');
    setNameMsg('');
    try {
      const { user: updated } = await updateProfile({ name });
      updateUser(updated);
      setNameMsg(t('profile.saved'));
    } catch (err) {
      setNameError(err.response?.data?.message || t('common.error'));
    } finally {
      setNameSaving(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError('');
    setPasswordMsg('');
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMsg(t('profile.passwordSaved'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || t('common.error'));
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { user: updated } = await uploadAvatar(formData);
      updateUser(updated);
    } catch (err) {
      setAvatarError(err.response?.data?.message || t('common.error'));
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-8 max-w-lg">
      {/* Avatar */}
      <section className="border rounded-xl p-5 bg-white">
        <h2 className="font-semibold text-gray-900 mb-4">{t('profile.avatar')}</h2>
        <div className="flex items-center gap-4">
          {user?.avatar_url ? (
            <img
              src={resolveUrl(user.avatar_url)}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <label className="text-sm font-medium text-brand-600 cursor-pointer">
            {avatarUploading ? t('common.loading') : t('profile.changeAvatar')}
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={avatarUploading} />
          </label>
        </div>
        {avatarError && <p className="text-sm text-red-600 mt-2">{avatarError}</p>}
      </section>

      {/* Name */}
      <section className="border rounded-xl p-5 bg-white">
        <h2 className="font-semibold text-gray-900 mb-4">{t('profile.editName')}</h2>
        <form onSubmit={handleNameSave} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {nameError && <p className="text-sm text-red-600">{nameError}</p>}
          {nameMsg && <p className="text-sm text-green-700">{nameMsg}</p>}
          <button
            type="submit"
            disabled={nameSaving}
            className="bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60"
          >
            {t('common.save')}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="border rounded-xl p-5 bg-white">
        <h2 className="font-semibold text-gray-900 mb-4">{t('profile.changePassword')}</h2>
        <form onSubmit={handlePasswordSave} className="space-y-3">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t('profile.currentPassword')}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('profile.newPassword')}
            required
            minLength={6}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordMsg && <p className="text-sm text-green-700">{passwordMsg}</p>}
          <button
            type="submit"
            disabled={passwordSaving}
            className="bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60"
          >
            {t('common.save')}
          </button>
        </form>
      </section>
    </div>
  );
}
