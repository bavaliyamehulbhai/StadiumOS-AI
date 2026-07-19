import Ticket from '../../models/Ticket.js';
import Crowd from '../../models/Crowd.js';
import Incident from '../../models/Incident.js';
import { Parking } from '../../models/Parking.js';
import POI from '../../models/POI.js';

export const buildNavigationContext = async (user, destination, options = {}) => {
  const context = {
    role: user.role,
    userId: user._id,
    destination,
    accessibilityMode: options.accessibilityMode || false,
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Fetch Ticket Info (if Fan)
    if (user.role === 'Fan') {
      const ticket = await Ticket.findOne({ user: user._id, status: 'Active' })
        .populate('match')
        .populate('stadium');
        
      if (ticket) {
        context.ticket = {
          gate: ticket.gate,
          seat: ticket.seat,
          section: ticket.section,
          match: ticket.match?.title,
          stadium: ticket.stadium?.name
        };
        // Set default destination to gate if not provided
        if (!destination) {
          context.destination = `Gate ${ticket.gate}`;
        }
      }
    }

    // 2. Fetch Parking (if Fan)
    if (user.role === 'Fan') {
      const parking = await Parking.findOne({ user: user._id, status: 'Reserved' });
      if (parking) {
        context.parking = {
          lot: parking.lotName,
          spot: parking.spotNumber
        };
      }
    }

    // 3. Fetch Active Incidents
    const activeIncidents = await Incident.find({ status: { $in: ['Open', 'In Progress'] } });
    if (activeIncidents.length > 0) {
      context.incidents = activeIncidents.map(inc => ({
        type: inc.type,
        location: inc.location,
        severity: inc.severity,
        description: inc.description
      }));
    } else {
      context.incidents = [];
    }

    // 4. Fetch Crowd Data (Highly Congested Areas)
    const crowdedZones = await Crowd.find({ density: { $gt: 75 } });
    if (crowdedZones.length > 0) {
      context.crowd = crowdedZones.map(zone => ({
        zone: zone.zoneName,
        density: zone.density
      }));
    } else {
      context.crowd = [];
    }

    return context;
  } catch (error) {
    console.error('Error building navigation context:', error);
    return context; // return basic context if advanced fetching fails
  }
};
