import { getIO } from '../../socket/socketServer.js';
import Incident from '../../models/Incident.js';
import User from '../../models/User.js';
import POI from '../../models/POI.js';
// import removed

export class MapSocketService {
  static intervalId = null;
  static lastAiInsights = null;

  static startBroadcasting() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    console.log('[MapSocket] Starting Live Map Broadcasting loop (every 10s)...');
    
    // Broadcast every 10 seconds
    this.intervalId = setInterval(async () => {
      try {
        const io = getIO();
        if (!io) return;

        // 1. Fetch active incidents (Live Markers)
        const incidents = await Incident.find({ status: { $ne: 'Resolved' } }).select('_id type priority status location title description');
        
        // Mock coordinates for incidents since DB stores them as strings (e.g. "Gate 4")
        const stadiumLat = 25.3548;
        const stadiumLng = 51.1839;
        
        const mappedIncidents = incidents.map(inc => ({
          ...inc.toObject(),
          location: {
            coordinates: [
              stadiumLng + (Math.random() - 0.5) * 0.01,
              stadiumLat + (Math.random() - 0.5) * 0.01
            ]
          }
        }));

        // 2. Fetch volunteers (Live Tracking)
        const volunteers = await User.find({ role: 'Volunteer', availability: { $ne: 'Offline' } }).select('_id name role currentLocation availability performanceScore');
        
        const mappedVolunteers = volunteers.map(vol => {
          let coords = vol.currentLocation?.coordinates;
          // If 0,0, mock them around stadium
          if (!coords || (coords[0] === 0 && coords[1] === 0)) {
            coords = [
              stadiumLng + (Math.random() - 0.5) * 0.01,
              stadiumLat + (Math.random() - 0.5) * 0.01
            ];
          }
          return {
            ...vol.toObject(),
            location: { coordinates: coords },
            status: vol.availability
          };
        });

        // 3. Fetch Parking Status (Color-coded Zones)
        let parkingPois = await POI.find({ type: 'Parking', isDeleted: false });
        if (!parkingPois || parkingPois.length === 0) {
          parkingPois = [
            { _id: 'park-1', name: 'P1 VIP Parking', location: { coordinates: [stadiumLng - 0.006, stadiumLat + 0.006] } },
            { _id: 'park-2', name: 'P2 General Parking', location: { coordinates: [stadiumLng + 0.006, stadiumLat - 0.006] } },
            { _id: 'park-3', name: 'P3 Staff Parking', location: { coordinates: [stadiumLng + 0.006, stadiumLat + 0.006] } }
          ];
        }
        
        // 4. Fetch Gate/Crowd zones for Heatmap
        const gates = await POI.find({ type: 'Gate', isDeleted: false });
        let heatmapZones = gates.map(gate => ({
          id: gate._id,
          name: gate.name,
          latitude: gate.latitude,
          longitude: gate.longitude,
          density: Math.floor(Math.random() * 100), // Simulated density for heatmap
          radius: 100 // meters
        }));

        // Mock gates if none exist
        if (heatmapZones.length === 0) {
          heatmapZones = [
            { id: 'mock-1', name: 'North Gate', latitude: stadiumLat + 0.003, longitude: stadiumLng, density: Math.floor(Math.random() * 100), radius: 150 },
            { id: 'mock-2', name: 'South Gate', latitude: stadiumLat - 0.003, longitude: stadiumLng, density: Math.floor(Math.random() * 100), radius: 150 },
            { id: 'mock-3', name: 'East Gate', latitude: stadiumLat, longitude: stadiumLng + 0.003, density: Math.floor(Math.random() * 100), radius: 150 },
            { id: 'mock-4', name: 'West Gate', latitude: stadiumLat, longitude: stadiumLng - 0.003, density: Math.floor(Math.random() * 100), radius: 150 }
          ];
        }

        // 5. Generate AI Overlays (Floating Recommendations)
        // We throttle AI generation to avoid spamming the Groq API (e.g. only every 30s or mock if rate limited).
        const aiOverlays = await this.generateMockAIOverlays(heatmapZones, mappedIncidents);

        // Bundle everything into a single performant payload
        const mapPayload = {
          incidents: mappedIncidents,
          volunteers: mappedVolunteers,
          parking: parkingPois,
          heatmap: heatmapZones,
          aiOverlays,
          timestamp: new Date()
        };

        // Broadcast to all clients (in production, we'd filter by user role rooms)
        io.emit('map:live:updated', mapPayload);

      } catch (error) {
        console.error('[MapSocket] Error in broadcast loop:', error);
      }
    }, 10000); // 10 seconds
  }

  static stopBroadcasting() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static async generateMockAIOverlays(heatmapZones, incidents) {
    const overlays = [];
    
    // Find highest density zone
    const criticalZone = heatmapZones.sort((a, b) => b.density - a.density)[0];
    if (criticalZone && criticalZone.density > 80) {
      overlays.push({
        id: `ai-crowd-${criticalZone.id}`,
        latitude: criticalZone.latitude,
        longitude: criticalZone.longitude,
        type: 'CrowdAlert',
        message: `High congestion at ${criticalZone.name}. Recommend redirecting flow.`,
        priority: 'High'
      });
    }

    // Add overlay for critical incidents
    incidents.filter(i => i.priority === 'Critical').forEach(inc => {
      if (inc.location?.coordinates) {
        overlays.push({
          id: `ai-inc-${inc._id}`,
          latitude: inc.location.coordinates[1], // GeoJSON is [lng, lat]
          longitude: inc.location.coordinates[0],
          type: 'EmergencyRouting',
          message: `Evacuation perimeter active around ${inc.title}. Keep clear.`,
          priority: 'Critical'
        });
      }
    });

    return overlays;
  }
}
