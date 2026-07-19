import User from '../../models/User.js';
import VolunteerTask from '../../models/VolunteerTask.js';
import Incident from '../../models/Incident.js';
import EmergencyBroadcast from '../../models/EmergencyBroadcast.js';

class VolunteerPerformanceService {
  /**
   * Get overall workforce KPIs for a specific match or stadium
   */
  async getWorkforceOverview(query) {
    const { stadiumId, matchId } = query;
    
    // Total Volunteers assigned
    const volunteerFilter = { role: 'Volunteer', status: { $ne: 'Inactive' } };
    if (stadiumId) volunteerFilter.assignedStadium = stadiumId;
    if (matchId) volunteerFilter.assignedMatch = matchId;
    
    const volunteers = await User.find(volunteerFilter).select('availability performanceScore');
    
    let total = volunteers.length;
    let available = 0;
    let busy = 0;
    let offline = 0;
    let emergency = 0;
    let totalScore = 0;

    volunteers.forEach(v => {
      if (v.availability === 'Available') available++;
      else if (v.availability === 'Busy') busy++;
      else if (v.availability === 'Offline') offline++;
      else if (v.availability === 'Emergency') emergency++;
      
      totalScore += (v.performanceScore || 100);
    });

    const averageScore = total > 0 ? (totalScore / total).toFixed(1) : 100;

    // Task Metrics
    const taskFilter = {};
    if (stadiumId) taskFilter.stadium = stadiumId;
    if (matchId) taskFilter.match = matchId;

    const tasks = await VolunteerTask.find(taskFilter).select('status priority acceptedAt assignedAt completedAt startedAt createdAt');
    
    let activeTasks = 0;
    let completedTasks = 0;
    let totalResponseTimeMs = 0;
    let respondedTasks = 0;

    tasks.forEach(task => {
      if (['Pending', 'Assigned', 'Accepted', 'In Progress'].includes(task.status)) {
        activeTasks++;
      } else if (task.status === 'Completed' || task.status === 'Verified') {
        completedTasks++;
      }

      // Response Time = acceptedAt - assignedAt (or startedAt - assignedAt as fallback)
      const respondTime = task.acceptedAt || task.startedAt;
      const assignTime = task.assignedAt || task.createdAt; 
      
      if (respondTime && assignTime && respondTime > assignTime) {
        totalResponseTimeMs += (new Date(respondTime) - new Date(assignTime));
        respondedTasks++;
      }
    });

    const totalTaskVolume = tasks.length;
    const completionRate = totalTaskVolume > 0 ? ((completedTasks / totalTaskVolume) * 100).toFixed(1) : 0;
    const avgResponseTimeMs = respondedTasks > 0 ? (totalResponseTimeMs / respondedTasks) : 0;
    
    // Format response time nicely (e.g., "1m 32s")
    const formatTime = (ms) => {
      if (ms === 0) return '0s';
      const totalSeconds = Math.floor(ms / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    };

    return {
      workforce: {
        total,
        available,
        busy,
        offline,
        emergency,
        averageScore
      },
      tasks: {
        active: activeTasks,
        completed: completedTasks,
        completionRate: parseFloat(completionRate),
        avgResponseTimeMs,
        avgResponseTimeFormatted: formatTime(avgResponseTimeMs)
      }
    };
  }

  /**
   * Get searchable list of volunteers with performance snapshots
   */
  async getVolunteerDirectory(query) {
    const { stadiumId, matchId, status, skill } = query;
    const filter = { role: 'Volunteer', status: { $ne: 'Inactive' } };
    
    if (stadiumId) filter.assignedStadium = stadiumId;
    if (matchId) filter.assignedMatch = matchId;
    if (status) filter.availability = status;
    if (skill) filter.skills = { $in: [skill] };

    const volunteers = await User.find(filter)
      .select('name avatar availability skills currentZone performanceScore completedTasks averageResponseTime lastActiveAt')
      .sort({ performanceScore: -1 });
      
    return volunteers;
  }

  /**
   * Calculate and update individual volunteer performance score
   */
  async calculateAndUpdateVolunteerScore(volunteerId) {
    const tasks = await VolunteerTask.find({ assignedVolunteer: volunteerId });
    
    if (tasks.length === 0) return 100;

    let completed = 0;
    let responded = 0;
    let totalResponseMs = 0;
    let cancelled = 0;

    tasks.forEach(task => {
      if (task.status === 'Completed' || task.status === 'Verified') completed++;
      if (task.status === 'Cancelled') cancelled++;

      const respondTime = task.acceptedAt || task.startedAt;
      const assignTime = task.assignedAt || task.createdAt;
      
      if (respondTime && assignTime && respondTime > assignTime) {
        totalResponseMs += (new Date(respondTime) - new Date(assignTime));
        responded++;
      }
    });

    const completionRate = completed / (tasks.length - cancelled || 1);
    const avgResponseMs = responded > 0 ? (totalResponseMs / responded) : 0;
    
    // Deterministic Score Logic
    const completionScore = completionRate * 50;
    
    let responseScore = 30;
    if (avgResponseMs > 0) {
      const minutes = avgResponseMs / 60000;
      if (minutes > 2 && minutes <= 5) responseScore = 20;
      else if (minutes > 5 && minutes <= 10) responseScore = 10;
      else if (minutes > 10) responseScore = 5;
    }

    const finalScore = Math.round(completionScore + responseScore + 20);
    const boundedScore = Math.min(Math.max(finalScore, 0), 100);

    await User.findByIdAndUpdate(volunteerId, {
      performanceScore: boundedScore,
      completedTasks: completed,
      averageResponseTime: avgResponseMs
    });

    return boundedScore;
  }

  /**
   * Get detailed performance profile for a specific volunteer
   */
  async getVolunteerProfile(volunteerId) {
    const volunteer = await User.findById(volunteerId).select('-password');
    if (!volunteer) throw new Error('Volunteer not found');

    const tasks = await VolunteerTask.find({ assignedVolunteer: volunteerId })
      .sort({ createdAt: -1 })
      .limit(50);
      
    const recentTasks = tasks.slice(0, 5);

    // Calculate Response Time Trend
    const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Verified');
    
    const responseTrend = completedTasks.slice(0, 10).map(t => {
      const respondTime = t.acceptedAt || t.startedAt;
      const assignTime = t.assignedAt || t.createdAt;
      let ms = 0;
      if (respondTime && assignTime && respondTime > assignTime) {
        ms = new Date(respondTime) - new Date(assignTime);
      }
      return {
        taskId: t._id,
        title: t.title,
        priority: t.priority,
        responseTimeMs: ms,
        date: t.createdAt
      };
    }).reverse();

    return {
      volunteer,
      metrics: {
        totalTasksAssigned: tasks.length,
        completedTasks: volunteer.completedTasks,
        performanceScore: volunteer.performanceScore,
        avgResponseTimeMs: volunteer.averageResponseTime
      },
      recentTasks,
      responseTrend
    };
  }

  /**
   * Check workforce workload imbalance
   */
  async getWorkloadAnalysis(stadiumId) {
    const activeTasks = await VolunteerTask.find({ 
      stadium: stadiumId,
      status: { $in: ['Assigned', 'Accepted', 'In Progress'] },
      assignedVolunteer: { $exists: true, $ne: null }
    }).populate('assignedVolunteer', 'name currentZone availability');

    const workloadMap = {};
    activeTasks.forEach(task => {
      const volId = task.assignedVolunteer._id.toString();
      if (!workloadMap[volId]) {
        workloadMap[volId] = {
          volunteer: task.assignedVolunteer,
          activeCount: 0,
          tasks: []
        };
      }
      workloadMap[volId].activeCount++;
      workloadMap[volId].tasks.push({ id: task._id, priority: task.priority });
    });

    const overloaded = Object.values(workloadMap).filter(w => w.activeCount >= 3);
    
    return {
      totalActiveAssignments: activeTasks.length,
      overloadedVolunteers: overloaded,
      hasImbalance: overloaded.length > 0
    };
  }
}

export default new VolunteerPerformanceService();
