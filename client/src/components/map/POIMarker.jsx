import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerPopup from './MarkerPopup';

const createCustomIcon = (iconStr, isMain) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center ${isMain ? 'w-12 h-12 text-3xl' : 'w-8 h-8 text-xl'} bg-white rounded-full shadow-lg border-2 ${isMain ? 'border-blue-600' : 'border-gray-200'} transform -translate-y-1/2">
        <span>${iconStr || '📍'}</span>
      </div>
    `,
    className: 'custom-leaflet-icon',
    iconSize: isMain ? [48, 48] : [32, 32],
    iconAnchor: isMain ? [24, 48] : [16, 32],
    popupAnchor: [0, -32]
  });
};

const POIMarker = ({ poi, isMain = false, onNavigate }) => {
  if (!poi.latitude || !poi.longitude) return null;

  return (
    <Marker 
      position={[poi.latitude, poi.longitude]}
      icon={createCustomIcon(poi.icon, isMain)}
    >
      <Popup className="custom-popup">
        <MarkerPopup poi={poi} isMain={isMain} onNavigate={onNavigate} />
      </Popup>
    </Marker>
  );
};

export default POIMarker;
