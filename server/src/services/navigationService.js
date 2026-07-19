import Stadium from '../models/Stadium.js';
import POI from '../models/POI.js';

// Helper to calculate distance between two coordinates in meters (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.round(R * c);
};

// Simulated Indoor Routing Engine
// In a real production app, you would use MapsPeople, Pointr, or a pre-calculated graph of hallway nodes.
// Here we generate a realistic "mock" path between A and B by adding right-angle waypoints.
export const generateRoute = async (startLat, startLng, endLat, endLng, routeType = 'Fastest') => {
  
  // 1. Calculate straight line distance
  const straightDistance = calculateDistance(startLat, startLng, endLat, endLng);
  
  // 2. Adjust distance based on routeType to simulate detours
  let actualDistance = straightDistance * 1.3; // Base 30% overhead for hallways
  if (routeType === 'Accessible') actualDistance *= 1.2; // Ramps/elevators might take longer path
  if (routeType === 'Emergency') actualDistance *= 0.9; // More direct emergency exits
  
  actualDistance = Math.round(actualDistance);

  // 3. Calculate ETA (avg walking speed ~80 meters per minute)
  let speedMpm = 80;
  if (routeType === 'Emergency') speedMpm = 120; // Running/fast walking
  if (routeType === 'Accessible') speedMpm = 60; // Slower pace
  
  const etaMinutes = Math.max(1, Math.round(actualDistance / speedMpm));

  // 4. Generate Polyline Waypoints (creating a slight L-shape or zigzag to look like corridors)
  const waypoints = [];
  waypoints.push([startLat, startLng]);
  
  // Midpoint with a 90-degree offset to simulate turning a corner
  const midLat = (startLat + endLat) / 2;
  const midLng = (startLng + endLng) / 2;
  
  // Offset to create the bend
  const latOffset = (endLng - startLng) * 0.2;
  
  waypoints.push([midLat + latOffset, startLng]); // Walk North/South
  waypoints.push([midLat + latOffset, endLng]);   // Turn East/West
  
  waypoints.push([endLat, endLng]);

  // 5. Generate Turn-by-Turn Instructions
  const instructions = [
    `Start heading towards the main corridor.`,
    `Walk straight for approximately ${Math.round(actualDistance * 0.4)} meters.`,
    `Turn ${latOffset > 0 ? 'Right' : 'Left'} at the intersection.`,
    `Continue for another ${Math.round(actualDistance * 0.5)} meters.`,
    `Your destination is straight ahead.`
  ];

  if (routeType === 'Accessible') {
    instructions.splice(2, 0, `Use the elevator to access the correct level.`);
  }

  return {
    distance: actualDistance,
    eta: etaMinutes,
    path: waypoints,
    instructions,
    type: routeType
  };
};

export const findNearby = async (lat, lng, type = null, radius = 500) => {
  // MongoDB requires GeoJSON for actual $near, but since we seeded raw lat/lng,
  // we'll fetch POIs and manually sort them for the hackathon demo.
  
  let query = { isDeleted: false };
  if (type) query.type = type;

  const allPois = await POI.find(query);
  
  const poisWithDistance = allPois.map(poi => {
    const dist = calculateDistance(lat, lng, poi.latitude, poi.longitude);
    return { ...poi.toObject(), distance: dist };
  });

  return poisWithDistance
    .filter(p => p.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Return top 5 closest
};
