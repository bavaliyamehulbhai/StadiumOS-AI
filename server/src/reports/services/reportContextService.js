import Match from '../../models/Match.js';
import Incident from '../../models/Incident.js';
import VolunteerTask from '../../models/VolunteerTask.js';
import { Parking } from '../../models/Parking.js';
import AuditLog from '../../models/AuditLog.js';

class ReportContextService {
  async buildMetricsSnapshot(stadiumId, matchId) {
    // Collect fundamental context
    let match = null;
    if (matchId) {
      match = await Match.findById(matchId).populate('stadium').lean();
    } else if (stadiumId) {
      match = await Match.findOne({ stadium: stadiumId, status: { $in: ['Live', 'Completed'] } })
        .sort({ matchDate: -1 })
        .populate('stadium').lean();
        
      if (!match) {
        // Fallback to any match for the stadium if no Live/Completed exists
        match = await Match.findOne({ stadium: stadiumId })
          .sort({ matchDate: -1 })
          .populate('stadium').lean();
      }
    }

    if (!match) {
      // Ultimate fallback for demo purposes
      match = await Match.findOne().sort({ matchDate: -1 }).populate('stadium').lean();
    }

    if (!match) {
      throw new Error("No operational match found to generate report.");
    }

    const actualMatchId = match._id;
    const actualStadiumId = match.stadium._id;

    // 1. Crowd Metrics
    const capacity = match.stadium.capacity;
    const attendance = match.bookedSeats;
    const peakDensity = match.status === 'Completed' ? 98 : (attendance / capacity) * 100; // Simulated peak
    const crowdMetrics = {
      totalAttendance: attendance,
      capacity: capacity,
      peakDensity: Math.min(Math.round(peakDensity), 100),
      mostCrowdedZone: "Gate A (Historical Pattern)",
    };

    // 2. Incident Metrics
    const incidents = await Incident.find({ stadium: actualStadiumId, match: actualMatchId }).lean();
    const totalIncidents = incidents.length;
    const criticalIncidents = incidents.filter(i => i.priority === 'Critical').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'Resolved').length;
    let incidentResponseMs = 0;
    
    incidents.forEach(inc => {
      // rough heuristic for incident metrics
      if (inc.status === 'Resolved' && inc.createdAt && inc.updatedAt) {
        incidentResponseMs += (new Date(inc.updatedAt) - new Date(inc.createdAt));
      }
    });

    const incidentMetrics = {
      total: totalIncidents,
      critical: criticalIncidents,
      resolved: resolvedIncidents,
      avgResolutionTimeMs: resolvedIncidents > 0 ? (incidentResponseMs / resolvedIncidents) : 0,
    };

    // 3. Volunteer Metrics
    const tasks = await VolunteerTask.find({ stadium: actualStadiumId, match: actualMatchId }).lean();
    const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Verified').length;
    const totalTasks = tasks.length;
    
    const volunteerMetrics = {
      totalTasksAssigned: totalTasks,
      completedTasks: completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      activeVolunteers: [...new Set(tasks.map(t => t.assignedVolunteer?.toString()).filter(Boolean))].length
    };

    // 4. Parking Metrics
    const parkingLots = await Parking.find({ stadium: actualStadiumId }).lean();
    let totalSpots = 0;
    let occupiedSpots = 0;
    parkingLots.forEach(lot => {
      totalSpots += lot.capacity || 0;
      occupiedSpots += lot.occupied || 0;
    });

    const parkingMetrics = {
      totalLots: parkingLots.length,
      overallUtilization: totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0,
    };

    // 5. Audit & AI Activity
    // Fetch last 50 audit logs during match window
    const auditLogs = await AuditLog.find({ 
      createdAt: { $gte: new Date(new Date().getTime() - 12 * 3600000) } // Last 12 hrs
    }).sort({ createdAt: -1 }).limit(50).lean();

    const aiDecisions = auditLogs.filter(log => log.aiGenerated || log.module === 'AI Orchestrator');
    const aiMetrics = {
      totalDecisions: aiDecisions.length,
      sampleActions: aiDecisions.slice(0, 3).map(a => a.action)
    };

    // 6. Calculate Health Score
    let score = 100;
    // Penalty for critical unresolved
    if (criticalIncidents > 0 && criticalIncidents > resolvedIncidents) score -= 15;
    // Penalty for poor task completion
    if (volunteerMetrics.completionRate > 0 && volunteerMetrics.completionRate < 80) score -= 10;
    // Penalty for high crowd
    if (crowdMetrics.peakDensity > 95) score -= 5;
    
    const healthScore = Math.max(score, 0);

    return {
      matchId: actualMatchId,
      stadiumId: actualStadiumId,
      healthScore,
      match: {
        title: `${match.teamA || 'Home'} vs ${match.teamB || 'Away'}`,
        status: match.status,
        date: match.matchDate
      },
      crowdMetrics,
      incidentMetrics,
      volunteerMetrics,
      parkingMetrics,
      aiMetrics,
      timelineEvents: auditLogs.filter(l => l.severity === 'WARNING' || l.severity === 'CRITICAL').map(l => ({
        time: l.createdAt,
        event: l.action,
        module: l.module
      }))
    };
  }
}

export default new ReportContextService();
