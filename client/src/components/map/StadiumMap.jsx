import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useEmergency } from '../../context/EmergencyContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Accessibility Icon using divIcon to prevent CORS/hotlinking issues
const accessibleIcon = new L.divIcon({
  className: 'custom-accessible-icon',
  html: '<div style="background-color: #2563eb; color: white; border: 2px solid white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">♿</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Lusail Stadium Coordinates
const STADIUM_CENTER = [25.4206, 51.4904]; 

const gates = [
  { id: 1, name: "Gate A (North)", pos: [25.4220, 51.4904], status: "Open", crowd: "Low" },
  { id: 2, name: "Gate B (East)", pos: [25.4206, 51.4920], status: "Congested", crowd: "High" },
  { id: 3, name: "Gate C (South)", pos: [25.4190, 51.4904], status: "Open", crowd: "Medium", isAccessible: true },
  { id: 4, name: "Gate D (West)", pos: [25.4206, 51.4888], status: "Closed", crowd: "None" }
];

const facilities = [
  { id: 101, name: "North Gate Ramp", type: "Ramp", pos: [25.4216, 51.4904] },
  { id: 102, name: "Main Elevator A", type: "Elevator", pos: [25.4206, 51.4894] },
  { id: 103, name: "Accessible Washroom", type: "Washroom", pos: [25.4196, 51.4914] },
  { id: 104, name: "Wheelchair Parking P5", type: "Parking", pos: [25.4226, 51.4924] }
];

const accessibleRouteCoords = [
  [25.4226, 51.4924], // Parking P5
  [25.4216, 51.4904], // Ramp
  [25.4206, 51.4894], // Elevator
  [25.4190, 51.4904]  // Gate C
];

const StadiumMap = () => {
  const { profile } = useAccessibility();
  const { isCrisisMode, crisisData } = useEmergency();
  const showAccessible = profile?.wheelchair || false;

  // Derive danger zones and safe exits from crisisData
  const dangerZones = isCrisisMode && crisisData?.avoidZoneIds 
    ? gates.filter(g => crisisData.avoidZoneIds.some(avoid => g.name.includes(avoid)))
    : [];
  
  const safeExits = isCrisisMode && crisisData?.safeExitIds 
    ? gates.filter(g => crisisData.safeExitIds.some(safe => g.name.includes(safe)))
    : [];

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden border shadow-sm relative z-0">
      <MapContainer center={STADIUM_CENTER} zoom={16} className="h-full w-full">
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Center Stadium Circle */}
        <Circle center={STADIUM_CENTER} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} radius={150} />

        {/* Gate Markers */}
        {gates.map((gate) => (
          <Marker key={gate.id} position={gate.pos}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{gate.name}</p>
                <p>Status: <span className={gate.status === 'Open' ? 'text-green-600' : 'text-red-600'}>{gate.status}</span></p>
                <p>Crowd: {gate.crowd}</p>
                {gate.isAccessible && showAccessible && <p className="text-blue-600 mt-1 font-semibold">♿ Accessible Gate</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Accessible Facilities (Rendered only if Accessibility Mode is ON) */}
        {showAccessible && facilities.map((facility) => (
          <Marker key={facility.id} position={facility.pos} icon={accessibleIcon}>
            <Popup>
              <div className="text-sm font-bold text-blue-800">
                ♿ {facility.name}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Accessible Navigation Route */}
        {showAccessible && !isCrisisMode && (
          <Polyline 
            positions={accessibleRouteCoords} 
            pathOptions={{ color: '#2563eb', weight: 4, dashArray: '8, 8' }} 
          />
        )}

        {/* Emergency Overlays */}
        {isCrisisMode && dangerZones.map(dz => (
          <Circle key={`danger-${dz.id}`} center={dz.pos} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }} radius={80}>
            <Popup><span className="text-red-700 font-bold">🚨 DANGER ZONE: AVOID</span></Popup>
          </Circle>
        ))}

        {isCrisisMode && safeExits.map(sz => (
          <Circle key={`safe-${sz.id}`} center={sz.pos} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.4 }} radius={80}>
            <Popup><span className="text-green-700 font-bold">✅ SAFE EXIT</span></Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};

export default StadiumMap;
