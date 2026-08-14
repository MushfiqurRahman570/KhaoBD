import React from 'react';

const SIZES = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

export default function Spinner({ size = 'md', label, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-8 ${className}`}>
      <span
        className={`${SIZES[size]} rounded-full border-brand-200 border-t-brand-500 animate-spin`}
        role="status"
        aria-label={label || 'Loading'}
      />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  );
}
