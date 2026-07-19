import Ticket from '../../models/Ticket.js';
import VolunteerTask from '../../models/VolunteerTask.js';
import Match from '../../models/Match.js';

export const buildContext = async (req, customData = {}) => {
  const user = req.user || {};
  const role = user.role || 'Fan';
  const userId = user._id || null;
  
  let additionalContext = {};

  if (userId) {
    try {
      if (role === 'Fan') {
        // Find user's active ticket
        const ticket = await Ticket.findOne({ user: userId }).populate('match').sort({ createdAt: -1 });
        if (ticket) {
          additionalContext.ticket = {
            gate: ticket.gate,
            seat: ticket.seat,
            section: ticket.section,
            qrCode: ticket.qrCode
          };
          if (ticket.match) {
            additionalContext.match = ticket.match.teams ? `${ticket.match.teams.home} vs ${ticket.match.teams.away}` : ticket.match.name || 'Unknown Match';
            additionalContext.stadium = ticket.match.stadium;
          }
        }
      } else if (role === 'Volunteer') {
        // Find assigned tasks
        const tasks = await VolunteerTask.find({ assignedTo: userId, status: { $ne: 'Completed' } });
        additionalContext.tasks = tasks.map(t => ({
          title: t.title,
          location: t.location,
          priority: t.priority
        }));
      } else if (role === 'Organizer' || role === 'Admin') {
        // Find current ongoing match
        const match = await Match.findOne({ status: 'Ongoing' }).populate('stadium');
        if (match) {
          additionalContext.match = match.teams ? `${match.teams.home} vs ${match.teams.away}` : match.name || 'Unknown Match';
          additionalContext.stadium = match.stadium?.name;
        }
      }
    } catch (err) {
      console.error('Error fetching context:', err);
    }
  }
  
  const context = {
    role,
    language: req.headers['accept-language'] || 'English',
    userId,
    ...additionalContext,
    ...customData
  };

  return context;
};
