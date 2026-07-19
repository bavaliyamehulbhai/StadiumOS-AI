import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Bot } from 'lucide-react';
import { renderToString } from 'react-dom/server';

const AILayer = ({ overlays }) => {
  if (!overlays || overlays.length === 0) return null;

  const createIcon = (priority) => {
    let borderColor = '#6366f1'; // Indigo
    if (priority === 'Critical') borderColor = '#ef4444'; // Red
    if (priority === 'High') borderColor = '#f97316'; // Orange

    const iconHtml = renderToString(<Bot size={20} color="white" />);

    const html = `
      <div style="
        background-color: ${borderColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 15px ${borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        animation: float 3s ease-in-out infinite;
      ">
        ${iconHtml}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-ai-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32], // Point bottom to coordinate
      popupAnchor: [0, -32]
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
      {overlays.map((overlay) => (
        <Marker
          key={overlay.id}
          position={[overlay.latitude, overlay.longitude]}
          icon={createIcon(overlay.priority)}
        >
          <Popup className="ai-popup">
            <div className="p-2 w-48">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm">AI Suggestion</h3>
              </div>
              <p className="text-sm text-gray-700">{overlay.message}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default AILayer;
