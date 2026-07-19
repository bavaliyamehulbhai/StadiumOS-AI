import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const IncidentLayer = ({ incidents }) => {
  if (!incidents || incidents.length === 0) return null;

  const createIcon = (priority) => {
    let color = '#3b82f6'; // Blue default
    if (priority === 'Critical') color = '#ef4444'; // Red
    if (priority === 'High') color = '#f97316'; // Orange
    if (priority === 'Medium') color = '#eab308'; // Yellow

    const html = `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px ${color};
        animation: pulse 1.5s infinite;
      "></div>
    `;

    return L.divIcon({
      html,
      className: 'custom-incident-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <>
      {incidents.map((inc) => {
        if (!inc.location || !inc.location.coordinates) return null;
        return (
          <Marker
            key={`inc-${inc._id}`}
            position={[inc.location.coordinates[1], inc.location.coordinates[0]]}
            icon={createIcon(inc.priority)}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-gray-900">{inc.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{inc.type}</p>
                <div className="mt-2 text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700 inline-block">
                  {inc.priority} Priority
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default IncidentLayer;
