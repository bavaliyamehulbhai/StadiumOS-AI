import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '@/services/api';
import { useSocket } from '@/socket/hooks/useSocket';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LusailCenter = [25.4206, 51.4904];

const CrowdMap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  const { socket } = useSocket();

  const fetchHeatmap = async () => {
    try {
      const res = await api.get('/crowd/heatmap');
      setHeatmapData(res.data.data);
    } catch (error) {
      console.error('Error fetching heatmap:', error);
    }
  };

  useEffect(() => {
    fetchHeatmap();

    if (socket) {
      socket.on('heatmap:updated', (updatedZones) => {
        // Just refetch for simplicity, or we could manually merge the updated zones.
        // For a hackathon, refetching ensures we don't desync.
        fetchHeatmap();
      });
      socket.on('crowd:updated', fetchHeatmap);
    }

    return () => {
      if (socket) {
        socket.off('heatmap:updated', fetchHeatmap);
        socket.off('crowd:updated', fetchHeatmap);
      }
    };
  }, [socket]);

  const getColor = (riskLevel) => {
    switch(riskLevel) {
      case 'Critical': return '#ef4444'; // red-500
      case 'High': return '#f97316'; // orange-500
      case 'Medium': return '#eab308'; // yellow-500
      case 'Low': return '#22c55e'; // green-500
      default: return '#3b82f6';
    }
  };

  const getRadius = (density) => {
    // The higher the density, the larger the visual "heat" radius
    return Math.max(30, (density / 100) * 100); 
  };

  return (
    <MapContainer center={LusailCenter} zoom={16} className="h-full w-full rounded-b-xl z-0">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Main Stadium Boundary */}
      <Circle center={LusailCenter} pathOptions={{ color: '#94a3b8', fillColor: 'transparent', weight: 2, dashArray: '5, 5' }} radius={200} />

      {heatmapData.map((point, idx) => (
        <React.Fragment key={idx}>
          {/* Inner Core (The actual POI) */}
          <CircleMarker 
            center={[point.lat, point.lng]} 
            radius={8}
            pathOptions={{ color: 'white', fillColor: getColor(point.riskLevel), fillOpacity: 1, weight: 2 }}
          >
            <Popup>
              <strong>{point.zoneName}</strong><br/>
              Density: {point.density}%<br/>
              Status: {point.riskLevel}
            </Popup>
          </CircleMarker>
          
          {/* Outer Heat Glow (Density radius) */}
          <Circle 
            center={[point.lat, point.lng]} 
            radius={getRadius(point.density)}
            pathOptions={{ 
              color: 'transparent', 
              fillColor: getColor(point.riskLevel), 
              fillOpacity: (point.density / 100) * 0.4 // Higher density = more opaque glow
            }} 
          />
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default CrowdMap;
