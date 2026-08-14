import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createBooking } from '../api/bookings';

export default function BookingForm({ restaurantId }) {
  const { t } = useTranslation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createBooking(restaurantId, {
        date, time, party_size: partySize, note,
      });
      setSuccess(true);
      setDate('');
      setTime('');
      setNote('');
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{t('booking.success')}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-gray-600">
          {t('booking.date')}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-gray-600">
          {t('booking.time')}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="text-sm text-gray-600 block">
        {t('booking.partySize')}
        <input
          type="number"
          min={1}
          max={30}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
        />
      </label>

      <label className="text-sm text-gray-600 block">
        {t('booking.note')}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-600 disabled:opacity-60"
      >
        {t('booking.submit')}
      </button>
    </form>
  );
}
