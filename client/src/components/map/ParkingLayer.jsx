import React from 'react';
import { Polygon, Tooltip } from 'react-leaflet';

const ParkingLayer = ({ parkingPois }) => {
  if (!parkingPois || parkingPois.length === 0) return null;

  return (
    <>
      {parkingPois.map((parking) => {
        if (!parking.location || !parking.location.coordinates || parking.location.coordinates.length < 3) return null;
        
        // Mock occupancy for demonstration (since we don't have a real parking sensor integration yet)
        const occupancy = Math.floor(Math.random() * 100);
        const isFull = occupancy > 90;
        
        // GeoJSON uses [lng, lat] while Leaflet uses [lat, lng]
        // Assuming coordinates here are an array of points for a polygon if it was a real parking zone.
        // Wait, POI model usually stores Point. Let's just draw a small circle or a mocked square around the point.
        const centerLng = parking.location.coordinates[0];
        const centerLat = parking.location.coordinates[1];
        
        const size = 0.001; // roughly 100m
        const polygonPositions = [
          [centerLat + size, centerLng - size],
          [centerLat + size, centerLng + size],
          [centerLat - size, centerLng + size],
          [centerLat - size, centerLng - size]
        ];

        return (
          <Polygon
            key={`parking-${parking._id}`}
            positions={polygonPositions}
            pathOptions={{
              color: isFull ? '#ef4444' : '#3b82f6',
              fillColor: isFull ? '#ef4444' : '#3b82f6',
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Tooltip>
              <div className="text-center">
                <strong>{parking.name}</strong><br/>
                Occupancy: {occupancy}%<br/>
                {isFull ? <span className="text-red-600 font-bold">FULL</span> : <span className="text-blue-600 font-bold">AVAILABLE</span>}
              </div>
            </Tooltip>
          </Polygon>
        );
      })}
    </>
  );
};

export default ParkingLayer;
