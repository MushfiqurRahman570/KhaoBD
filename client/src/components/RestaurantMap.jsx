import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';

// react-leaflet's default marker icon references image files by path, which
// Vite doesn't resolve automatically. A simple emoji-based divIcon avoids the
// broken-image issue entirely without needing to bundle Leaflet's PNG assets.
const pinIcon = L.divIcon({
  html: '<div style="font-size:28px;line-height:1;transform:translateY(-4px)">📍</div>',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

export default function RestaurantMap({ lat, lng, name, address }) {
  const { t } = useTranslation();

  if (!lat || !lng) {
    return (
      <div className="h-56 rounded-xl border bg-gray-50 flex items-center justify-center text-sm text-gray-400 text-center px-4">
        {t('map.unavailable')}
      </div>
    );
  }

  const position = [Number(lat), Number(lng)];

  return (
    <div className="h-56 rounded-xl overflow-hidden border">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={pinIcon}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
