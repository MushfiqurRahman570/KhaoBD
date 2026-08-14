import React, { useState } from 'react';

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

function resolveUrl(url) {
  return url.startsWith('http') ? url : `${UPLOADS_URL}${url}`;
}

export default function PhotoHero({ coverUrl, photos = [], name }) {
  const allUrls = [
    ...(coverUrl ? [coverUrl] : []),
    ...photos.map((p) => p.url).filter((u) => u !== coverUrl),
  ];
  const [active, setActive] = useState(0);

  if (allUrls.length === 0) {
    return (
      <div className="w-full h-64 sm:h-80 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No photo available</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="w-full h-64 sm:h-96 overflow-hidden">
          <img
            src={resolveUrl(allUrls[active])}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        {allUrls.length > 1 && (
          <div className="flex gap-2 p-2 overflow-x-auto bg-black">
            {allUrls.map((url, i) => (
              <button
                type="button"
                key={url + i}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                  i === active ? 'border-brand-500' : 'border-transparent opacity-70'
                }`}
              >
                <img src={resolveUrl(url)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
