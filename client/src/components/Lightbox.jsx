import React, { useEffect } from 'react';

// Full-screen image viewer. `images` is an array of { src, caption }.
// `index` is the currently shown image; `onClose`/`onNavigate` are callbacks.
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const isOpen = index !== null && index !== undefined && !!images[index];

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && index < images.length - 1) onNavigate(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, index, images, onClose, onNavigate]);

  if (!isOpen) return null;
  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-white text-3xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
      >
        ×
      </button>

      {index > 0 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(index - 1); }}
          aria-label="Previous"
          className="absolute left-2 sm:left-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          ‹
        </button>
      )}

      {index < images.length - 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNavigate(index + 1); }}
          aria-label="Next"
          className="absolute right-2 sm:right-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          ›
        </button>
      )}

      <div
        className="max-w-4xl max-h-[85vh] w-full mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.caption || ''}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg"
        />
        {current.caption && (
          <p className="text-white/90 text-sm mt-3 text-center">{current.caption}</p>
        )}
      </div>
    </div>
  );
}
