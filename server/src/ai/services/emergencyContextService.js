import Emergency from '../../models/Emergency.js';
import Crowd from '../../models/Crowd.js';
import { Parking } from '../../models/Parking.js';
import User from '../../models/User.js';
import Incident from '../../models/Incident.js';
import { rankSafeExits } from './evacuationService.js';
import { getResourceSummary } from './resourcePlanningService.js';

/**
 * Builds a rich context object for the AI Emergency prompt.
 * @param {string} emergencyId - MongoDB ObjectId of the Emergency document
 * @returns {Object} context
 */
export const buildEmergencyContext = async (emergencyId) => {
  // 1. Fetch the core emergency document
  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) throw new Error(`Emergency ${emergencyId} not found.`);

  const context = {
    emergencyId: emergency._id.toString(),
    type: emergency.type,
    title: emergency.title,
    severity: emergency.severity,
    zone: emergency.zone,
    description: emergency.description || '',
    status: emergency.status,
    evacuationRequired: emergency.evacuationRequired,
    timestamp: emergency.createdAt?.toISOString() || new Date().toISOString(),
    crowd: {
      affectedZone: null,
      nearbyZones: [],
      totalAttendance: 0
    },
    parking: [],
    volunteers: { total: 0, available: 0 },
    openGates: [],
    activeIncidents: [],
    recommendedResources: '',
    preComputedSafeExits: []
  };

  try {
    // 2. Get crowd density at affected zone and neighbours
    const allCrowd = await Crowd.find({});
    let totalPeople = 0;

    allCrowd.forEach(c => { totalPeople += (c.currentPeople || 0); });
    context.crowd.totalAttendance = totalPeople;

    const affectedCrowd = allCrowd.find(c =>
      c.zone?.toLowerCase().includes(emergency.zone?.toLowerCase())
    );
    if (affectedCrowd) {
      context.crowd.affectedZone = {
        zone: affectedCrowd.zone,
        density: affectedCrowd.densityPercentage,
        riskLevel: affectedCrowd.riskLevel,
        people: affectedCrowd.currentPeople
      };
    }

    context.crowd.nearbyZones = allCrowd
      .filter(c => c.riskLevel === 'High' || c.riskLevel === 'Critical')
      .map(c => ({ zone: c.zone, density: c.densityPercentage, risk: c.riskLevel }))
      .slice(0, 5);

    // 3. Pre-compute safe exits using the deterministic helper
    context.preComputedSafeExits = rankSafeExits(allCrowd, emergency.zone);
    context.openGates = context.preComputedSafeExits.map(e => e.exit);

    // 4. Parking status
    const parkingLots = await Parking.find({});
    context.parking = parkingLots.map(p => ({
      lot: p.zone || 'Unknown',
      status: p.status,
      fillPercentage: p.capacity > 0
        ? Math.round(((p.occupied || 0) / p.capacity) * 100) : 0
    }));

    // 5. Volunteer availability
    const totalVols = await User.countDocuments({ role: 'Volunteer' });
    context.volunteers.total = totalVols;
    context.volunteers.available = Math.max(0, Math.floor(totalVols * 0.6)); // conservative estimate

    // 6. Other active incidents (for multi-incident awareness)
    const activeIncidents = await Incident.find({
      status: { $in: ['Open', 'In Progress'] },
      _id: { $ne: emergencyId }
    }).limit(5);
    context.activeIncidents = activeIncidents.map(i => ({
      type: i.type,
      location: i.location,
      severity: i.severity
    }));

    // 7. Pre-populate standard resource summary (to inform AI)
    context.recommendedResources = getResourceSummary(emergency.type);

  } catch (err) {
    // Return partial context — never throw from context builder
    console.error('Error enriching emergency context:', err.message);
  }

  return context;
};
