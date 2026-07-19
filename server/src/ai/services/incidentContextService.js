import Incident from '../../models/Incident.js';
import User from '../../models/User.js';
import Match from '../../models/Match.js';
import Stadium from '../../models/Stadium.js';

export const buildIncidentContext = async (incidentId) => {
  const incident = await Incident.findById(incidentId)
    .populate('stadium')
    .populate('match')
    .populate('reportedBy', 'name role')
    .populate('assignedVolunteer', 'name');

  if (!incident) {
    throw new Error('Incident not found');
  }

  // Find nearby available volunteers (simplified logic)
  const availableVolunteers = await User.countDocuments({
    role: 'Volunteer',
    stadium: incident.stadium._id
  });

  return {
    incidentTitle: incident.title,
    incidentDescription: incident.description,
    incidentType: incident.incidentType,
    reportedPriority: incident.priority,
    location: incident.location,
    reporter: incident.reportedBy?.name || 'Unknown',
    stadiumName: incident.stadium?.name || 'Unknown Stadium',
    matchName: incident.match ? `${incident.match.homeTeam} vs ${incident.match.awayTeam}` : 'No active match',
    availableVolunteers,
    timestamp: incident.createdAt
  };
};
