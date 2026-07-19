import systemHealthService from '../services/systemHealthService.js';
import systemIncidentService from '../services/systemIncidentService.js';
import healthSnapshotService from '../services/healthSnapshotService.js';

export const getHealth = async (req, res, next) => {
  try {
    const health = await systemHealthService.getOverallHealth();
    // This is the lightweight endpoint, return minimal info
    res.status(200).json({
      success: true,
      data: {
        status: health.status,
        timestamp: health.timestamp,
        services: {
          api: health.services.api.status,
          database: health.services.database.status,
          socket: health.services.socket.status,
          ai: health.services.ai.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemHealthDetailed = async (req, res, next) => {
  try {
    const health = await systemHealthService.getOverallHealth();
    res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthHistory = async (req, res, next) => {
  try {
    const history = await healthSnapshotService.getHistory(req.query.hours || 24);
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveIncidents = async (req, res, next) => {
  try {
    const incidents = await systemIncidentService.getActiveIncidents();
    res.status(200).json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  } catch (error) {
    next(error);
  }
};

export const acknowledgeIncident = async (req, res, next) => {
  try {
    const incident = await systemIncidentService.detectAndCreateIncident(); 
    // Wait, we need to fetch and update
    const { id } = req.params;
    const IncidentModel = (await import('../../models/SystemIncident.js')).default;
    
    const inc = await IncidentModel.findById(id);
    if (!inc) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    inc.status = 'ACKNOWLEDGED';
    inc.acknowledgedAt = new Date();
    inc.acknowledgedBy = req.user._id;
    await inc.save();

    res.status(200).json({
      success: true,
      data: inc
    });
  } catch (error) {
    next(error);
  }
};

export const resolveIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const IncidentModel = (await import('../../models/SystemIncident.js')).default;
    
    const inc = await IncidentModel.findById(id);
    if (!inc) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    inc.status = 'RESOLVED';
    inc.resolvedAt = new Date();
    await inc.save();
    
    await systemIncidentService.notifyAdmins(inc, 'Incident Manually Resolved');
    systemIncidentService.emitSocketEvent('system.incident.resolved', inc);

    res.status(200).json({
      success: true,
      data: inc
    });
  } catch (error) {
    next(error);
  }
};

export const forcePeriodicCheck = async (req, res, next) => {
  try {
    await systemHealthService.runPeriodicCheck();
    res.status(200).json({ success: true, message: 'Periodic check triggered' });
  } catch (error) {
    next(error);
  }
};
