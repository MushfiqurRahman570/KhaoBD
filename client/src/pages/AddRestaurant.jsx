import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  fetchAreas, fetchCuisines, fetchRestaurant, createRestaurant, updateRestaurant,
  uploadRestaurantPhotos,
} from '../api/restaurants';
import {
  fetchMenu, createMenuItem, deleteMenuItem, uploadMenuItemPhoto,
} from '../api/menu';

const PRICE_OPTIONS = ['$', '$$', '$$$', '$$$$'];
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

const emptyForm = {
  name_en: '',
  name_bn: '',
  description_en: '',
  description_bn: '',
  area_id: '',
  address: '',
  phone: '',
  price_range: '$$',
  opening_hours: '',
  cuisine_ids: [],
};

export default function AddRestaurant() {
  const { id } = useParams(); // present when editing an existing restaurant
  const isEditing = Boolean(id);
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [restaurantId, setRestaurantId] = useState(id || null);
  const [photos, setPhotos] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetchAreas().then((d) => setAreas(d.areas)).catch(() => {});
    fetchCuisines().then((d) => setCuisines(d.cuisines)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    fetchRestaurant(id).then((d) => {
      const r = d.restaurant;
      setForm({
        name_en: r.name_en || '',
        name_bn: r.name_bn || '',
        description_en: r.description_en || '',
        description_bn: r.description_bn || '',
        area_id: r.area_id || '',
        address: r.address || '',
        phone: r.phone || '',
        price_range: r.price_range || '$$',
        opening_hours: r.opening_hours || '',
        cuisine_ids: (r.Cuisines || []).map((c) => c.id),
      });
      setPhotos(r.photos || []);
    }).finally(() => setLoading(false));
    fetchMenu(id).then((d) => setMenuItems(d.menuItems)).catch(() => {});
  }, [id, isEditing]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCuisine(cuisineId) {
    setForm((f) => {
      const has = f.cuisine_ids.includes(cuisineId);
      return {
        ...f,
        cuisine_ids: has
          ? f.cuisine_ids.filter((cid) => cid !== cuisineId)
          : [...f.cuisine_ids, cuisineId],
      };
    });
  }

  async function handleSaveBasicInfo(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedMsg('');
    try {
      if (restaurantId) {
        await updateRestaurant(restaurantId, form);
        setSavedMsg(t('addRestaurant.savedInfo'));
      } else {
        const { restaurant } = await createRestaurant(form);
        setRestaurantId(restaurant.id);
        setSavedMsg(t('addRestaurant.created'));
      }
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length || !restaurantId) return;
    const formData = new FormData();
    files.forEach((f) => formData.append('photos', f));
    const { photos: uploaded } = await uploadRestaurantPhotos(restaurantId, formData);
    setPhotos((p) => [...p, ...uploaded]);
    e.target.value = '';
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">
        {isEditing ? t('addRestaurant.editTitle') : t('addRestaurant.createTitle')}
      </h1>
      <p className="text-sm text-gray-500 mt-1">{t('addRestaurant.subtitle')}</p>

      {loading ? (
        <p className="text-sm text-gray-500 mt-8">{t('common.loading')}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {/* Step 1: Basic info */}
          <section className="border rounded-xl p-5 bg-white">
            <h2 className="font-semibold text-gray-900 mb-4">{t('addRestaurant.basicInfo')}</h2>
            <form onSubmit={handleSaveBasicInfo} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('addRestaurant.nameEn')} required>
                  <input
                    type="text"
                    value={form.name_en}
                    onChange={(e) => update('name_en', e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </Field>
                <Field label={t('addRestaurant.nameBn')}>
                  <input
                    type="text"
                    value={form.name_bn}
                    onChange={(e) => update('name_bn', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('addRestaurant.descriptionEn')}>
                  <textarea
                    value={form.description_en}
                    onChange={(e) => update('description_en', e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </Field>
                <Field label={t('addRestaurant.descriptionBn')}>
                  <textarea
                    value={form.description_bn}
                    onChange={(e) => update('description_bn', e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('search.area')} required>
                  <select
                    value={form.area_id}
                    onChange={(e) => update('area_id', e.target.value)}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
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
                </Field>
                <Field label={t('search.price')}>
                  <select
                    value={form.price_range}
                    onChange={(e) => update('price_range', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    {PRICE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
              </div>

              <Field label={t('restaurant.address')} required>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t('restaurant.phone')}>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </Field>
                <Field label={t('restaurant.hours')}>
                  <input
                    type="text"
                    value={form.opening_hours}
                    onChange={(e) => update('opening_hours', e.target.value)}
                    placeholder="11:00 AM - 11:00 PM"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </Field>
              </div>

              <Field label={t('restaurant.cuisines')}>
                <div className="flex flex-wrap gap-2">
                  {cuisines.map((c) => {
                    const active = form.cuisine_ids.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCuisine(c.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border ${active ? 'bg-brand-500 text-white border-brand-500' : 'text-gray-600 border-gray-300'}`}
                      >
                        {isBn ? c.name_bn : c.name_en}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {savedMsg && <p className="text-sm text-green-700">{savedMsg}</p>}

              <button
                type="submit"
                disabled={saving}
                className="bg-brand-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-600 disabled:opacity-60"
              >
                {restaurantId ? t('common.save') : t('addRestaurant.createButton')}
              </button>
            </form>
          </section>

          {/* Step 2: Photos — only once the restaurant exists */}
          <section className={`border rounded-xl p-5 bg-white ${!restaurantId ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="font-semibold text-gray-900 mb-1">{t('addRestaurant.photos')}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {restaurantId ? t('addRestaurant.photosSub') : t('addRestaurant.saveFirst')}
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              {photos.map((p) => (
                <img
                  key={p.id}
                  src={p.url.startsWith('http') ? p.url : `${UPLOADS_URL}${p.url}`}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              disabled={!restaurantId}
              className="text-sm"
            />
          </section>

          {/* Step 3: Menu items — only once the restaurant exists */}
          <section className={`border rounded-xl p-5 bg-white ${!restaurantId ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="font-semibold text-gray-900 mb-1">{t('addRestaurant.menu')}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {restaurantId ? t('addRestaurant.menuSub') : t('addRestaurant.saveFirst')}
            </p>

            {restaurantId && (
              <MenuItemManager
                restaurantId={restaurantId}
                items={menuItems}
                onChange={setMenuItems}
              />
            )}
          </section>

          {restaurantId && (
            <div className="flex justify-end">
              <Link
                to={`/restaurants/${restaurantId}`}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {t('addRestaurant.viewRestaurant')}
                {' →'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block text-sm text-gray-600">
      {label}
      {required && <span className="text-brand-500"> *</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function MenuItemManager({ restaurantId, items, onChange }) {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [form, setForm] = useState({
    name_en: '', name_bn: '', description_en: '', price: '', category: '', is_popular: false,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name_en || !form.price) return;
    setSubmitting(true);
    setError('');
    try {
      const { menuItem } = await createMenuItem(restaurantId, form);
      let finalItem = menuItem;
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        const { menuItem: withPhoto } = await uploadMenuItemPhoto(menuItem.id, formData);
        finalItem = withPhoto;
      }
      onChange([...items, finalItem]);
      setForm({
        name_en: '', name_bn: '', description_en: '', price: '', category: '', is_popular: false,
      });
      setPhotoFile(null);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(itemId) {
    await deleteMenuItem(itemId);
    onChange(items.filter((i) => i.id !== itemId));
  }

  return (
    <div className="space-y-4">
      {items.length > 0 && (
        <ul className="divide-y border rounded-lg">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-3 py-2 text-sm">
              {item.photo_url ? (
                <img
                  src={item.photo_url.startsWith('http') ? item.photo_url : `${UPLOADS_URL}${item.photo_url}`}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg">🍽️</span>
              )}
              <span className="flex-1">
                <span className="font-medium text-gray-900">
                  {(isBn && item.name_bn) ? item.name_bn : item.name_en}
                </span>
                {item.category && <span className="text-gray-400"> · {item.category}</span>}
                <span className="text-gray-500"> · ৳{Number(item.price).toFixed(0)}</span>
              </span>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-xs text-red-600 font-medium flex-shrink-0"
              >
                {t('common.cancel')}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3 border">
        <input
          type="text"
          placeholder={t('addRestaurant.nameEn')}
          value={form.name_en}
          onChange={(e) => update('name_en', e.target.value)}
          required
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder={t('addRestaurant.nameBn')}
          value={form.name_bn}
          onChange={(e) => update('name_bn', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder={t('addRestaurant.category')}
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder={t('addRestaurant.price')}
          value={form.price}
          onChange={(e) => update('price', e.target.value)}
          required
          min={0}
          className="border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder={t('addRestaurant.descriptionEn')}
          value={form.description_en}
          onChange={(e) => update('description_en', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
        />
        <label className="text-sm text-gray-600 sm:col-span-2">
          {t('addRestaurant.menuItemPhoto')}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="block mt-1 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.is_popular}
            onChange={(e) => update('is_popular', e.target.checked)}
          />
          {t('menu.popular')}
        </label>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60 sm:col-start-2 sm:justify-self-end"
        >
          {submitting ? t('common.loading') : t('addRestaurant.addMenuItem')}
        </button>
      </form>
    </div>
  );
}
