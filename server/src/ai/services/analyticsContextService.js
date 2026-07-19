import Match from '../../models/Match.js';
import Ticket from '../../models/Ticket.js';
import Incident from '../../models/Incident.js';
import Crowd from '../../models/Crowd.js';
import { Parking } from '../../models/Parking.js';
import Emergency from '../../models/Emergency.js';
import User from '../../models/User.js';

export const buildAnalyticsContext = async () => {
  const context = {
    timestamp: new Date().toISOString(),
    match: null,
    kpis: {
      attendance: 0,
      revenue: 0,
      activeIncidents: 0,
      parkingUtilization: 0,
      availableVolunteers: 0
    },
    crowdHighlights: [],
    incidentsSummary: { Open: 0, 'In Progress': 0, Resolved: 0 },
    activeEmergencies: []
  };

  try {
    // 1. Get today's match
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const match = await Match.findOne({ date: { $gte: today } }).sort({ date: 1 }).populate('stadium');
    
    if (match) {
      context.match = {
        title: match.title,
        status: match.status,
        date: match.date
      };

      // 2. Tickets (Revenue & Attendance)
      const tickets = await Ticket.find({ match: match._id });
      context.kpis.attendance = tickets.length;
      context.kpis.revenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
    } else {
      // Fallback if no match today to show some data
      const recentMatch = await Match.findOne().sort({ date: -1 });
      if (recentMatch) {
        context.match = { title: recentMatch.title, status: 'Completed', date: recentMatch.date };
        const tickets = await Ticket.find({ match: recentMatch._id });
        context.kpis.attendance = tickets.length;
        context.kpis.revenue = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
      }
    }

    // 3. Incidents
    const incidents = await Incident.find({});
    context.kpis.activeIncidents = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    incidents.forEach(i => {
      if (context.incidentsSummary[i.status] !== undefined) {
        context.incidentsSummary[i.status]++;
      }
    });

    // 4. Emergencies
    const emergencies = await Emergency.find({ status: { $in: ['Reported', 'Verified', 'In Progress'] } });
    context.activeEmergencies = emergencies.map(e => ({ type: e.type, severity: e.severity, zone: e.zone }));

    // 5. Crowd
    const crowd = await Crowd.find({});
    context.crowdHighlights = crowd
      .filter(c => c.riskLevel === 'High' || c.riskLevel === 'Critical')
      .map(c => ({ zone: c.zone, density: c.densityPercentage, risk: c.riskLevel }));

    // 6. Parking
    const parkingLots = await Parking.find({});
    let totalCap = 0;
    let totalOcc = 0;
    parkingLots.forEach(p => {
      totalCap += p.capacity || 0;
      totalOcc += p.occupied || 0;
    });
    context.kpis.parkingUtilization = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;

    // 7. Volunteers
    const volunteers = await User.countDocuments({ role: 'Volunteer' });
    context.kpis.availableVolunteers = Math.max(0, Math.floor(volunteers * 0.7)); // Est. 70% available

  } catch (error) {
    console.error('Error building analytics context:', error);
  }

  return context;
};
