import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import { createReview, uploadReviewPhotos } from '../api/reviews';

export default function ReviewForm({ restaurantId, onSubmitted }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [food, setFood] = useState(5);
  const [service, setService] = useState(5);
  const [value, setValue] = useState(5);
  const [atmosphere, setAtmosphere] = useState(5);
  const [text, setText] = useState('');
  const [visitedDate, setVisitedDate] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const { review } = await createReview(restaurantId, {
        rating,
        food_rating: food,
        service_rating: service,
        value_rating: value,
        atmosphere_rating: atmosphere,
        text,
        visited_date: visitedDate || null,
      });

      if (files.length) {
        const formData = new FormData();
        files.forEach((f) => formData.append('photos', f));
        await uploadReviewPhotos(review.id, formData);
      }

      setText('');
      setFiles([]);
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 space-y-3 border">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <RatingField label={t('review.rating')} value={rating} onChange={setRating} />
        <RatingField label={t('review.food')} value={food} onChange={setFood} />
        <RatingField label={t('review.service')} value={service} onChange={setService} />
        <RatingField label={t('review.value')} value={value} onChange={setValue} />
        <RatingField label={t('review.atmosphere')} value={atmosphere} onChange={setAtmosphere} />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('review.textPlaceholder')}
        required
        rows={3}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm text-gray-600">
          {t('review.visitedDate')}
          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            className="ml-2 border rounded-lg px-2 py-1 text-sm"
          />
        </label>

        <label className="text-sm text-gray-600">
          {t('review.addPhotos')}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="ml-2 text-sm"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60"
      >
        {t('review.submit')}
      </button>
    </form>
  );
}

function RatingField({ label, value, onChange }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <StarRating value={value} onChange={onChange} />
    </div>
  );
}
