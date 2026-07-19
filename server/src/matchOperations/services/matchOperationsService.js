import Match from '../../models/Match.js';
import Incident from '../../models/Incident.js';
import VolunteerTask from '../../models/VolunteerTask.js';
import AuditLog from '../../models/AuditLog.js';
import reportContextService from '../../reports/services/reportContextService.js';
import { getIO } from '../../socket/socketServer.js';

class MatchOperationsService {
  async getOperationsState(matchId) {
    const match = await Match.findById(matchId).populate('stadium').lean();
    if (!match) throw new Error("Match not found");

    // Re-use Phase 6 context builder for the heavy lifting of data aggregation
    const snapshot = await reportContextService.buildMetricsSnapshot(null, matchId);
    
    // Add real-time active data
    const activeIncidents = await Incident.find({ match: matchId, status: { $ne: 'Resolved' } }).lean();
    const activeTasks = await VolunteerTask.find({ match: matchId, status: { $nin: ['Completed', 'Verified', 'Cancelled'] } }).populate('assignedVolunteer', 'name').lean();
    const recentActivity = await AuditLog.find({ 
        createdAt: { $gte: new Date(new Date().getTime() - 4 * 3600000) } 
    }).sort({ createdAt: -1 }).limit(20).lean();

    return {
      match,
      health: snapshot.healthScore,
      metrics: {
        crowd: snapshot.crowdMetrics,
        incident: snapshot.incidentMetrics,
        volunteer: snapshot.volunteerMetrics,
        parking: snapshot.parkingMetrics
      },
      activeIncidents,
      activeTasks,
      recentActivity
    };
  }

  async startOperations(matchId, userId, role) {
    const match = await Match.findByIdAndUpdate(matchId, {
      status: 'Live',
      operationsStartedAt: new Date(),
      operationsStartedBy: userId,
      commandMode: 'NORMAL'
    }, { new: true });

    await AuditLog.create({
      action: `Started Match Operations for ${match.title}`,
      module: 'Admin',
      user: userId,
      role: role,
      severity: 'SUCCESS'
    });

    try { getIO().emit('match.operations.updated', { matchId, status: 'Live', mode: 'NORMAL' }); } catch(_) {}
    return match;
  }

  async endOperations(matchId, userId, role) {
    // Check if critical emergencies exist before allowing end? (Mock logic: just allow)
    const match = await Match.findByIdAndUpdate(matchId, {
      status: 'Completed',
      operationsEndedAt: new Date(),
      operationsEndedBy: userId,
      commandMode: 'NORMAL'
    }, { new: true });

    await AuditLog.create({
      action: `Ended Match Operations for ${match.title}`,
      module: 'Admin',
      user: userId,
      role: role,
      severity: 'SUCCESS'
    });

    try { getIO().emit('match.operations.updated', { matchId, status: 'Completed', mode: 'NORMAL' }); } catch(_) {}
    return match;
  }

  async triggerEmergency(matchId, userId, role) {
    const match = await Match.findByIdAndUpdate(matchId, {
      commandMode: 'EMERGENCY'
    }, { new: true });

    await AuditLog.create({
      action: `ACTIVATED EMERGENCY COMMAND MODE for ${match.title}`,
      module: 'Emergency',
      user: userId,
      role: role,
      severity: 'CRITICAL'
    });

    try { getIO().emit('match.operations.updated', { matchId, status: match.status, mode: 'EMERGENCY' }); } catch(_) {}
    return match;
  }

  async resolveEmergency(matchId, userId, role) {
    const match = await Match.findByIdAndUpdate(matchId, {
      commandMode: 'NORMAL'
    }, { new: true });

    await AuditLog.create({
      action: `Resolved Emergency Command Mode for ${match.title}`,
      module: 'Emergency',
      user: userId,
      role: role,
      severity: 'SUCCESS'
    });

    try { getIO().emit('match.operations.updated', { matchId, status: match.status, mode: 'NORMAL' }); } catch(_) {}
    return match;
  }
}

export default new MatchOperationsService();
