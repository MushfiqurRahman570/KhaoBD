import React from 'react';

export default function StarRating({ value = 0, size = 'text-base', onChange }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === 'function';

  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`}>
      {stars.map((s) => {
        const filled = value >= s;
        const half = !filled && value >= s - 0.5;
        return (
          <button
            type="button"
            key={s}
            disabled={!interactive}
            onClick={() => interactive && onChange(s)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} leading-none`}
            aria-label={`${s} star`}
          >
            <span className={filled ? 'text-brand-500' : half ? 'text-brand-300' : 'text-gray-300'}>
              ★
            </span>
          </button>
        );
      })}
    </span>
  );
}
