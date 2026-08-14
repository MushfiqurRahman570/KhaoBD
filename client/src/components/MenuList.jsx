import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from './Lightbox';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

function resolveUrl(url) {
  return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
}

// Pure image grid: each dish is a photo tile with just its name and price as
// a caption underneath — tapping a tile opens it full-screen. Items without
// a photo still get a placeholder tile so the menu stays browsable, but
// they're not clickable since there's no image to enlarge.
export default function MenuList({ items }) {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [openIndex, setOpenIndex] = useState(null);

  const photoItems = useMemo(() => items.filter((i) => i.photo_url), [items]);
  const lightboxImages = useMemo(() => photoItems.map((item) => {
    const name = (isBn && item.name_bn) ? item.name_bn : item.name_en;
    return {
      src: resolveUrl(item.photo_url),
      caption: `${name} · ৳${item.price}`,
    };
  }), [photoItems, isBn]);

  if (!items.length) {
    return <p className="text-sm text-gray-500">{t('menu.empty')}</p>;
  }

  const byCategory = items.reduce((acc, item) => {
    const cat = item.category || t('menu.uncategorized');
    (acc[cat] = acc[cat] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(byCategory).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categoryItems.map((item) => {
              const name = (isBn && item.name_bn) ? item.name_bn : item.name_en;
              const lightboxIndex = item.photo_url
                ? photoItems.findIndex((p) => p.id === item.id)
                : -1;

              return (
                <button
                  type="button"
                  key={item.id}
                  disabled={lightboxIndex === -1}
                  onClick={() => setOpenIndex(lightboxIndex)}
                  className={`group relative aspect-square rounded-xl overflow-hidden bg-gray-100 ${lightboxIndex !== -1 ? 'cursor-zoom-in' : 'cursor-default'}`}
                >
                  {item.photo_url ? (
                    <img
                      src={resolveUrl(item.photo_url)}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍽️
                    </div>
                  )}

                  {item.is_popular && (
                    <span className="absolute top-2 left-2 text-[10px] font-medium bg-brand-500 text-white px-2 py-0.5 rounded-full">
                      {t('menu.popular')}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-4 pb-2 text-left">
                    <p className="text-white text-xs font-medium truncate">{name}</p>
                    <p className="text-white/90 text-xs">৳{item.price}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Lightbox
        images={lightboxImages}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </div>
  );
}
