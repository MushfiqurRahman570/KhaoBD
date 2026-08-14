import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchFavorites } from '../api/favorites';
import RestaurantCard from '../components/RestaurantCard';

export default function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites().then((d) => setFavorites(d.favorites)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('nav.favorites')}</h1>
      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('common.noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((f) => <RestaurantCard key={f.id} restaurant={f.Restaurant} />)}
        </div>
      )}
    </div>
  );
}
