import React from 'react';
import { Circle, Tooltip } from 'react-leaflet';

const HeatmapLayer = ({ zones }) => {
  if (!zones || zones.length === 0) return null;

  const getColor = (density) => {
    if (density > 85) return '#ef4444'; // Red
    if (density > 60) return '#f97316'; // Orange
    if (density > 30) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <>
      {zones.map((zone) => (
        <Circle
          key={`heatmap-${zone.id}`}
          center={[zone.latitude, zone.longitude]}
          radius={zone.radius || 150}
          pathOptions={{
            color: getColor(zone.density),
            fillColor: getColor(zone.density),
            fillOpacity: 0.4,
            weight: 0
          }}
        >
          <Tooltip>
            <div className="text-center">
              <strong>{zone.name}</strong><br/>
              Density: {zone.density}%
            </div>
          </Tooltip>
        </Circle>
      ))}
    </>
  );
};

export default HeatmapLayer;
