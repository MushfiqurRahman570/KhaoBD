import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export default function RestaurantCard({ restaurant }) {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const name = (isBn && restaurant.name_bn) ? restaurant.name_bn : restaurant.name_en;
  const areaName = restaurant.Area
    ? ((isBn && restaurant.Area.name_bn) ? restaurant.Area.name_bn : restaurant.Area.name_en)
    : '';
  const cover = restaurant.cover_photo_url
    || (restaurant.photos && restaurant.photos[0] && restaurant.photos[0].url);

  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="block bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {cover ? (
          <img
            src={cover.startsWith('http') ? cover : `${UPLOADS_URL}${cover}`}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No photo</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {areaName}
          {' · '}
          {restaurant.price_range}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <StarRating value={Number(restaurant.avg_rating)} size="text-sm" />
          <span className="text-sm text-gray-600">{Number(restaurant.avg_rating).toFixed(1)}</span>
          <span className="text-sm text-gray-400">
            (
            {restaurant.review_count}
            {' '}
            {restaurant.review_count === 1 ? t('restaurant.review') : t('restaurant.reviews')}
            )
          </span>
        </div>
      </div>
    </Link>
  );
}
