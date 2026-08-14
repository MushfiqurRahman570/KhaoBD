import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchRestaurant } from '../api/restaurants';
import { fetchReviews } from '../api/reviews';
import { fetchMenu } from '../api/menu';
import { addFavorite, removeFavorite, fetchFavorites } from '../api/favorites';
import { useAuth } from '../context/AuthContext';
import { FEATURES } from '../config/features';
import StarRating from '../components/StarRating';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import BookingForm from '../components/BookingForm';
import MenuList from '../components/MenuList';
import RestaurantMap from '../components/RestaurantMap';
import Lightbox from '../components/Lightbox';
import Spinner from '../components/Spinner';
import Seo from '../components/Seo';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

function resolveUrl(url) {
  if (!url) return url;
  return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
}

const TABS = ['overview', 'menu', 'reviews', 'photos'];

export default function RestaurantDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isBn = i18n.language === 'bn';

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const loadReviews = useCallback(() => {
    fetchReviews(id).then((d) => setReviews(d.reviews)).catch(() => {});
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchRestaurant(id).then((d) => setRestaurant(d.restaurant)).finally(() => setLoading(false));
    loadReviews();
    fetchMenu(id).then((d) => setMenuItems(d.menuItems)).catch(() => {});
    if (user) {
      fetchFavorites().then((d) => {
        setIsFavorite(d.favorites.some((f) => f.restaurant_id === Number(id)));
      }).catch(() => {});
    }
  }, [id, user, loadReviews]);

  const photoGallery = useMemo(() => (restaurant?.photos || []).map((p) => ({
    src: resolveUrl(p.url),
    caption: restaurant ? ((isBn && restaurant.name_bn) ? restaurant.name_bn : restaurant.name_en) : '',
  })), [restaurant, isBn]);

  async function toggleFavorite() {
    if (!user) return;
    if (isFavorite) {
      await removeFavorite(id);
      setIsFavorite(false);
    } else {
      await addFavorite(id);
      setIsFavorite(true);
    }
  }

  if (loading) return <Spinner size="lg" label={t('common.loading')} className="py-24" />;
  if (!restaurant) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-sm">{t('restaurant.notFound')}</p>
        <Link to="/restaurants" className="text-brand-600 text-sm font-medium mt-2 inline-block">
          {t('common.seeAll')}
        </Link>
      </div>
    );
  }

  const name = (isBn && restaurant.name_bn) ? restaurant.name_bn : restaurant.name_en;
  const description = (isBn && restaurant.description_bn) ? restaurant.description_bn : restaurant.description_en;
  const areaName = restaurant.Area ? ((isBn && restaurant.Area.name_bn) ? restaurant.Area.name_bn : restaurant.Area.name_en) : '';

  const heroImage = restaurant.cover_photo_url
    || (restaurant.photos && restaurant.photos[0] && restaurant.photos[0].url);
  const heroSrc = resolveUrl(heroImage);

  // Structured data helps Google show a rich result (star rating, price
  // range, address) directly in search results for this restaurant.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address,
      addressLocality: restaurant.Area?.city,
    },
    telephone: restaurant.phone || undefined,
    servesCuisine: (restaurant.Cuisines || []).map((c) => c.name_en),
    priceRange: restaurant.price_range,
    image: heroSrc || undefined,
    ...(restaurant.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: restaurant.avg_rating,
        reviewCount: restaurant.review_count,
      },
    }),
  };

  return (
    <div>
      <Seo
        title={name}
        description={description || t('seo.restaurantFallback', { area: areaName })}
        path={`/restaurants/${id}`}
        image={heroSrc}
        jsonLd={jsonLd}
      />

      {/* Hero image */}
      <div className="h-56 sm:h-72 bg-gray-200 relative overflow-hidden">
        {heroSrc ? (
          <img src={heroSrc} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-brand-100 to-brand-50">
            🍽️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">{name}</h1>
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <span className="text-white/90 text-sm">
              {areaName}
              {' · '}
              {restaurant.price_range}
            </span>
            <span className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
              <StarRating value={Number(restaurant.avg_rating)} size="text-xs" />
              <span className="text-xs font-medium text-gray-800">
                {Number(restaurant.avg_rating).toFixed(1)}
              </span>
            </span>
            <span className="text-white/80 text-xs">
              (
              {restaurant.review_count}
              {' '}
              {t('restaurant.reviews')}
              )
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Cuisine tags + favorite button, just below hero */}
        <div className="flex items-center justify-between gap-4 py-4 border-b">
          <div className="flex flex-wrap gap-2">
            {restaurant.Cuisines && restaurant.Cuisines.map((c) => (
              <span key={c.id} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {isBn ? c.name_bn : c.name_en}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user?.is_admin && (
              <Link
                to={`/restaurants/${id}/edit`}
                className="text-sm font-medium px-4 py-2 rounded-full border text-gray-600 border-gray-300 whitespace-nowrap hover:border-gray-400"
              >
                {t('addRestaurant.editButton')}
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={toggleFavorite}
                className={`text-sm font-medium px-4 py-2 rounded-full border whitespace-nowrap ${isFavorite ? 'bg-brand-500 text-white border-brand-500' : 'text-brand-600 border-brand-300'}`}
              >
                {isFavorite ? t('restaurant.removeFavorite') : t('restaurant.addFavorite')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
          <div className="md:col-span-2">
            {/* Tab navigation */}
            <div className="flex gap-1 border-b mb-6 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t(`tabs.${tab}`)}
                  {tab === 'reviews' && ` (${reviews.length})`}
                  {tab === 'menu' && menuItems.length > 0 && ` (${menuItems.length})`}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {description && (
                  <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
                )}
                <div className="border rounded-xl p-4 space-y-2 text-sm">
                  <p><span className="text-gray-500">{t('restaurant.address')}: </span>{restaurant.address}</p>
                  {restaurant.phone && <p><span className="text-gray-500">{t('restaurant.phone')}: </span>{restaurant.phone}</p>}
                  {restaurant.opening_hours && <p><span className="text-gray-500">{t('restaurant.hours')}: </span>{restaurant.opening_hours}</p>}
                </div>
                {menuItems.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">{t('menu.popularItems')}</h3>
                    <MenuList items={menuItems.filter((i) => i.is_popular).slice(0, 4)} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'menu' && <MenuList items={menuItems} />}

            {activeTab === 'reviews' && (
              <div>
                {user && (
                  <div className="mb-6">
                    <ReviewForm restaurantId={id} onSubmitted={loadReviews} />
                  </div>
                )}
                <ReviewList reviews={reviews} onChanged={loadReviews} />
              </div>
            )}

            {activeTab === 'photos' && (
              restaurant.photos && restaurant.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {restaurant.photos.map((p, i) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setLightboxIndex(i)}
                      className="cursor-zoom-in"
                    >
                      <img
                        src={resolveUrl(p.url)}
                        alt={name}
                        className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t('restaurant.noPhotos')}</p>
              )
            )}
          </div>

          {/* Sidebar: booking when enabled, otherwise a map (booking is
              paused, not removed — flip FEATURES.booking back on to restore
              it instantly). */}
          <aside>
            <div className="border rounded-xl p-4 sticky top-20">
              {FEATURES.booking ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('restaurant.bookTable')}</h3>
                  {user ? (
                    <BookingForm restaurantId={id} />
                  ) : (
                    <p className="text-sm text-gray-500">{t('auth.noAccount')}</p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('map.title')}</h3>
                  <RestaurantMap
                    lat={restaurant.lat}
                    lng={restaurant.lng}
                    name={name}
                    address={restaurant.address}
                  />
                  <p className="text-xs text-gray-500 mt-2">{restaurant.address}</p>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Lightbox
        images={photoGallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
