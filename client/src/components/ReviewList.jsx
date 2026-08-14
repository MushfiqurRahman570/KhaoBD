import React from 'react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import { likeReview } from '../api/reviews';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export default function ReviewList({ reviews, onChanged }) {
  const { t } = useTranslation();

  if (!reviews.length) {
    return <p className="text-gray-500 text-sm">{t('restaurant.noReviews')}</p>;
  }

  async function handleLike(id) {
    await likeReview(id);
    onChanged();
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-5 last:border-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{review.author?.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating value={Number(review.rating)} size="text-sm" />
                {review.visited_date && (
                  <span className="text-xs text-gray-400">
                    {new Date(review.visited_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-2">{review.text}</p>

          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {review.photos.map((p) => (
                <img
                  key={p.id}
                  src={p.url.startsWith('http') ? p.url : `${UPLOADS_URL}${p.url}`}
                  alt=""
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleLike(review.id)}
            className="text-xs text-gray-500 hover:text-brand-600 mt-2"
          >
            {t('review.like')}
            {' '}
            (
            {review.like_count || 0}
            )
          </button>
        </div>
      ))}
    </div>
  );
}
