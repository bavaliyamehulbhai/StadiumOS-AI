import Crowd from '../../models/Crowd.js';
import Match from '../../models/Match.js';
import { Parking } from '../../models/Parking.js';
import Emergency from '../../models/Emergency.js';
import User from '../../models/User.js';

export const buildCrowdContext = async (stadiumId) => {
  let context = {
    timestamp: new Date().toISOString(),
    match: null,
    stadium: null,
    totalAttendance: 0,
    zones: [],
    parking: [],
    activeIncidents: [],
    volunteerStats: {
      totalActive: 0,
      medical: 0
    }
  };

  try {
    // 1. Get Ongoing Match (safe teams access)
    const match = await Match.findOne({ status: 'Ongoing' }).populate('stadium');
    if (match) {
      context.match = match.teams
        ? `${match.teams.home} vs ${match.teams.away}`
        : match.title || match.name || 'Ongoing Match';
      context.stadium = match.stadium?.name || 'Main Stadium';
      // Store stadiumId from match if not provided
      if (!stadiumId && match.stadium?._id) {
        stadiumId = match.stadium._id;
      }
    }

    // 2. Get Crowd Data (Gates, Food, Washroom, etc.)
    const crowdQuery = stadiumId ? { stadium: stadiumId } : {};
    const crowds = await Crowd.find(crowdQuery);
    
    let totalPeople = 0;
    context.zones = crowds.map(c => {
      totalPeople += (c.currentPeople || 0);
      return {
        zone: c.zone,
        category: c.category,
        currentPeople: c.currentPeople || 0,
        maxCapacity: c.maxCapacity || 0,
        densityPercentage: c.densityPercentage || 0,
        riskLevel: c.riskLevel || 'Low',
        averageWaitTime: c.averageWaitTime || 0
      };
    });
    context.totalAttendance = totalPeople;

    // 3. Get Parking Data — use actual Parking model fields: zone, capacity, occupied, status
    const parkingQuery = stadiumId ? { stadium: stadiumId } : {};
    const parkingLots = await Parking.find(parkingQuery);
    context.parking = parkingLots.map(p => {
      const available = (p.capacity || 0) - (p.occupied || 0);
      const fillPct = p.capacity > 0
        ? Math.round(((p.capacity - available) / p.capacity) * 100)
        : 0;
      return {
        lot: p.zone || 'Unknown',
        type: p.type || 'General',
        status: p.status || 'Open',
        capacity: p.capacity || 0,
        available,
        fillPercentage: fillPct
      };
    });

    // 4. Get Active Incidents/Emergencies — Emergency.location has latitude/longitude, not description
    const emergencies = await Emergency.find({ status: { $in: ['Reported', 'In Progress'] } });
    context.activeIncidents = emergencies.map(e => ({
      type: e.type,
      zone: e.zone || 'Unknown',
      location: `Lat ${e.location?.latitude?.toFixed(4) || 'N/A'}, Lng ${e.location?.longitude?.toFixed(4) || 'N/A'}`,
      severity: e.severity,
      description: e.description || e.title || ''
    }));

    // 5. Get Volunteer Counts (no isOnline field — just count total Volunteers)
    const totalVolunteers = await User.countDocuments({ role: 'Volunteer' });
    context.volunteerStats.totalActive = totalVolunteers;
    context.volunteerStats.medical = Math.floor(totalVolunteers * 0.2);

    return context;

  } catch (error) {
    console.error('Error building crowd context:', error);
    // Return partial context instead of throwing — keeps the AI call alive
    return context;
  }
};
