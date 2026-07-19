import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const VolunteerLayer = ({ volunteers }) => {
  if (!volunteers || volunteers.length === 0) return null;

  const createIcon = () => {
    const html = `
      <div style="
        background-color: #8b5cf6;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
      "></div>
    `;

    return L.divIcon({
      html,
      className: 'custom-volunteer-marker',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <>
      {volunteers.map((vol) => {
        if (!vol.location || !vol.location.coordinates) return null;
        return (
          <Marker
            key={`vol-${vol._id}`}
            position={[vol.location.coordinates[1], vol.location.coordinates[0]]}
            icon={createIcon()}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-900">{vol.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Status: {vol.status}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default VolunteerLayer;
