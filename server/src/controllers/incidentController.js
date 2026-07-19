import Incident from '../models/Incident.js';
import NotificationService from '../services/notificationService.js';
import User from '../models/User.js';
import { IncidentTimelineService } from '../services/incidentTimelineService.js';
import { IncidentSocketService } from '../services/incidentSocketService.js';
import { aiEventBus, AI_EVENTS } from '../ai/events/aiEvents.js';

// Helper to fully populate an incident
const populateIncident = async (id) => {
  return await Incident.findById(id)
    .populate('reportedBy', 'name role')
    .populate('assignedVolunteer', 'name email')
    .populate('stadium', 'name city')
    .populate('timeline.user', 'name role');
};

// @desc    Create incident
// @route   POST /api/v1/incidents
// @access  Private
export const createIncident = async (req, res) => {
  try {
    let incident = await Incident.create({
      ...req.body,
      reportedBy: req.user._id,
      status: 'Reported'
    });

    // 1. Add Timeline Entry
    await IncidentTimelineService.addTimelineEntry(incident._id, {
      action: 'Incident Created',
      userId: req.user._id,
      role: req.user.role,
      newStatus: 'Reported'
    });

    incident = await populateIncident(incident._id);

    // 2. Notify Organizers/Admins
    const organizers = await User.find({ role: { $in: ['Organizer', 'Admin'] } });
    await Promise.all(organizers.map(org => {
      const rolePrefix = org.role === 'Admin' ? '/admin' : '/organizer';
      return NotificationService.sendIncidentNotification(
        org._id,
        'New Incident Reported',
        `[${incident.priority}] ${incident.title} at ${incident.stadium.name}`,
        `${rolePrefix}/incidents/${incident._id}`,
        incident.priority,
        req.user._id,
        incident._id
      );
    }));

    // 3. Socket Push
    IncidentSocketService.emitCreated(incident);

    // 4. Phase 8: Emit to AI Event Orchestrator
    aiEventBus.emit(AI_EVENTS.INCIDENT_CREATED, {
      incidentId: incident._id,
      priority: incident.priority,
      status: incident.status
    });

    res.status(201).json({
      success: true,
      data: incident
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign volunteer to incident
// @route   PATCH /api/v1/incidents/:id/assign
// @access  Private (Organizer/Admin)
export const assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    let incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

    const previousStatus = incident.status;
    incident.assignedVolunteer = volunteerId;
    incident.status = 'Assigned';
    await incident.save();

    await IncidentTimelineService.addTimelineEntry(incident._id, {
      action: 'Volunteer Assigned',
      userId: req.user._id,
      role: req.user.role,
      previousStatus,
      newStatus: 'Assigned'
    });

    incident = await populateIncident(incident._id);

    // Notify the volunteer
    if (volunteerId) {
      await NotificationService.sendIncidentNotification(
        volunteerId,
        'New Task Assigned',
        `You have been assigned to handle: ${incident.title}`,
        `/volunteer/incidents/${incident._id}`,
        incident.priority,
        req.user._id,
        incident._id
      );
    }

    IncidentSocketService.emitUpdated(incident);

    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change incident status
// @route   PATCH /api/v1/incidents/:id/status
// @access  Private
export const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let incident = await Incident.findById(req.params.id);

    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

    // Business Rules
    if (req.user.role === 'Volunteer' && incident.assignedVolunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only update incidents assigned to you.' });
    }
    if (incident.status === 'Resolved' && status === 'Reported') {
      return res.status(400).json({ success: false, message: 'Resolved incidents cannot be moved back to Reported.' });
    }
    if (status === 'Closed' && incident.status !== 'Resolved') {
      return res.status(400).json({ success: false, message: 'Incident must be Resolved before it can be Closed.' });
    }

    const previousStatus = incident.status;
    incident.status = status;
    if (status === 'Resolved') incident.resolvedAt = new Date();
    if (status === 'Closed') incident.closedAt = new Date();
    
    await incident.save();

    await IncidentTimelineService.addTimelineEntry(incident._id, {
      action: `Status changed to ${status}`,
      userId: req.user._id,
      role: req.user.role,
      previousStatus,
      newStatus: status
    });

    incident = await populateIncident(incident._id);

    if (status === 'Resolved') {
      IncidentSocketService.emitResolved(incident);
      if (req.user.role === 'Volunteer') {
        const organizers = await User.find({ role: { $in: ['Organizer', 'Admin'] } });
        await Promise.all(organizers.map(org => {
          const rolePrefix = org.role === 'Admin' ? '/admin' : '/organizer';
          return NotificationService.sendIncidentNotification(
            org._id,
            'Incident Resolved',
            `Volunteer resolved: ${incident.title}`,
            `${rolePrefix}/incidents/${incident._id}`,
            'NORMAL',
            req.user._id,
            incident._id
          );
        }));
      }
    } else if (status === 'Closed') {
      IncidentSocketService.emitClosed(incident);
    } else {
      IncidentSocketService.emitUpdated(incident);
    }

    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all incidents
// @route   GET /api/v1/incidents
// @access  Private
export const getAllIncidents = async (req, res) => {
  try {
    const { priority, status, incidentType, search, stadium, assignedVolunteer } = req.query;
    
    let query = {};
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (incidentType) query.incidentType = incidentType;
    if (stadium) query.stadium = stadium;
    
    if (req.user.role === 'Volunteer') {
      query.$or = [{ assignedVolunteer: req.user._id }, { reportedBy: req.user._id }];
    } else if (assignedVolunteer) {
      query.assignedVolunteer = assignedVolunteer;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const incidents = await Incident.find(query)
      .populate('stadium', 'name city')
      .populate('reportedBy', 'name role')
      .populate('assignedVolunteer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single incident
// @route   GET /api/v1/incidents/:id
// @access  Private
export const getIncidentById = async (req, res) => {
  try {
    const incident = await populateIncident(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });
    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete incident
// @route   DELETE /api/v1/incidents/:id
// @access  Private
export const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' });

    if (req.user.role !== 'Admin' && req.user.role !== 'Organizer' && req.user._id.toString() !== incident.reportedBy.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this incident' });
    }

    await incident.deleteOne();
    // Use the socket server directly to emit delete event since we just need to pass ID
    import('../socket/socketServer.js').then(({ getIO }) => {
      getIO().emit('incident:deleted', incident._id);
    });
    
    res.status(200).json({ success: true, message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
