import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAreas, fetchCuisines } from '../api/restaurants';

export default function SearchFilters({ filters, onChange }) {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [areas, setAreas] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    fetchAreas().then((d) => setAreas(d.areas)).catch(() => {});
    fetchCuisines().then((d) => setCuisines(d.cuisines)).catch(() => {});
  }, []);

  function update(field, value) {
    onChange({ ...filters, [field]: value, page: 1 });
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="text"
        value={filters.q || ''}
        onChange={(e) => update('q', e.target.value)}
        placeholder={t('search.placeholder')}
        className="flex-1 min-w-[220px] border rounded-lg px-3 py-2 text-sm"
      />

      <select
        value={filters.area || ''}
        onChange={(e) => update('area', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">{t('search.allAreas')}</option>
        {areas.map((a) => (
          <option key={a.id} value={a.id}>
            {isBn ? a.name_bn : a.name_en}
            {' '}
            (
            {a.city}
            )
          </option>
        ))}
      </select>

      <select
        value={filters.cuisine || ''}
        onChange={(e) => update('cuisine', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">{t('search.allCuisines')}</option>
        {cuisines.map((c) => (
          <option key={c.id} value={c.id}>{isBn ? c.name_bn : c.name_en}</option>
        ))}
      </select>

      <select
        value={filters.price || ''}
        onChange={(e) => update('price', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">{t('search.anyPrice')}</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
        <option value="$$$$">$$$$</option>
      </select>

      <select
        value={filters.sort || 'rating'}
        onChange={(e) => update('sort', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="rating">{t('search.sortRating')}</option>
        <option value="reviews">{t('search.sortReviews')}</option>
        <option value="newest">{t('search.sortNewest')}</option>
        <option value="name">{t('search.sortName')}</option>
      </select>
    </div>
  );
}
