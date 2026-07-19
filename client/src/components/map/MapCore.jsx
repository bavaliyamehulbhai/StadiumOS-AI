import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, Polyline, Circle, Popup } from 'react-leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import 'leaflet/dist/leaflet.css';
import POIMarker from './POIMarker';
import HeatmapLayer from './HeatmapLayer';
import IncidentLayer from './IncidentLayer';
import VolunteerLayer from './VolunteerLayer';
import ParkingLayer from './ParkingLayer';
import AILayer from './AILayer';
import L from 'leaflet';

// Fix for default marker icons in Leaflet when using Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapCore = ({ center, zoom, stadium, pois, route, onNavigate, liveData = null, operationsMode = 'All' }) => {
  const mapRef = useRef();
  const { isCrisisMode, crisisData } = useEmergency();

  // Helper to find POI by name for emergency zones
  const findPoiByName = (nameMatch) => {
    return pois?.find(p => p.name.includes(nameMatch)) || null;
  };

  // If a route is provided, auto-fit the map bounds to the route
  useEffect(() => {
    if (route && route.path && route.path.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(route.path);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route]);

  // Route colors based on type
  const getRouteColor = () => {
    if (!route) return '#3b82f6';
    if (route.type === 'Emergency') return '#ef4444';
    if (route.type === 'Accessible') return '#10b981';
    return '#3b82f6';
  };

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      className="w-full h-full"
      zoomControl={false} // Disable default to move it
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {/* Move zoom control to bottom right so it doesn't overlap header */}
      <ZoomControl position="bottomright" />

      {/* Render Stadium Marker if we are on a specific stadium */}
      {stadium && stadium.latitude && stadium.longitude && (
        <POIMarker 
          poi={{
            ...stadium,
            type: 'Stadium',
            icon: '🏟',
            description: stadium.description || 'Main Stadium Facility'
          }} 
          isMain={true}
        />
      )}

      {/* Static POIs (only show if operationsMode is All or specific) */}
      {(operationsMode === 'All' || operationsMode === 'POIs') && pois && pois.map(poi => (
        <POIMarker 
          key={poi._id} 
          poi={poi} 
          onNavigate={() => onNavigate && onNavigate(poi)}
        />
      ))}

      {/* Live Digital Twin Layers */}
      {liveData && (
        <>
          {(operationsMode === 'All' || operationsMode === 'Crowd') && (
            <HeatmapLayer zones={liveData.heatmap} />
          )}
          
          {(operationsMode === 'All' || operationsMode === 'Incident') && (
            <IncidentLayer incidents={liveData.incidents} />
          )}

          {(operationsMode === 'All' || operationsMode === 'Volunteer') && (
            <VolunteerLayer volunteers={liveData.volunteers} />
          )}

          {(operationsMode === 'All' || operationsMode === 'Parking') && (
            <ParkingLayer parkingPois={liveData.parking} />
          )}

          {(operationsMode === 'All' || operationsMode === 'AI') && (
            <AILayer overlays={liveData.aiOverlays} />
          )}
        </>
      )}

      {/* Render Route Polyline if active */}
      {route && route.path && (
        <Polyline 
          positions={route.path} 
          pathOptions={{ 
            color: getRouteColor(), 
            weight: 6, 
            opacity: 0.8, 
            dashArray: route.type === 'Accessible' ? '10, 10' : undefined 
          }} 
        />
      )}

      {/* Emergency Overlays (Global across all modes) */}
      {isCrisisMode && crisisData?.avoidZoneIds && crisisData.avoidZoneIds.map((zone, idx) => {
        const poi = findPoiByName(zone);
        if (poi) {
          return (
            <Circle key={`danger-${idx}`} center={[poi.latitude, poi.longitude]} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} radius={80}>
              <Popup><span className="text-red-700 font-bold">🚨 DANGER ZONE: AVOID</span></Popup>
            </Circle>
          );
        }
        return null;
      })}

      {isCrisisMode && crisisData?.safeExitIds && crisisData.safeExitIds.map((zone, idx) => {
        const poi = findPoiByName(zone);
        if (poi) {
          return (
            <Circle key={`safe-${idx}`} center={[poi.latitude, poi.longitude]} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.4 }} radius={80}>
              <Popup><span className="text-green-700 font-bold">✅ SAFE EXIT</span></Popup>
            </Circle>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};

export default MapCore;
