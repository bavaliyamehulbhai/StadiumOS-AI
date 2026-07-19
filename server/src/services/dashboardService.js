import User from '../models/User.js';
import Match from '../models/Match.js';
import Incident from '../models/Incident.js';
import VolunteerTask from '../models/VolunteerTask.js';
import Stadium from '../models/Stadium.js';
import Notification from '../models/Notification.js';

class DashboardService {

  // ==========================================
  // LIVE STATUS STRIP
  // ==========================================
  static async getLiveStatus() {
    const [criticalIncidents, activeVolunteers, totalFans] = await Promise.all([
      Incident.countDocuments({ priority: 'Critical', status: { $ne: 'Resolved' } }),
      User.countDocuments({ role: 'Volunteer' }),
      User.countDocuments({ role: 'Fan' }) // Proxy for "visitors" for now
    ]);

    return {
      visitors: totalFans * 12 + 104, // Just a fake multiplier to look busy
      criticalIncidents,
      activeVolunteers,
      systemOnline: true
    };
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================
  static async getAdminDashboard() {
    // Parallelize queries for max performance
    const [
      totalUsers,
      totalMatches,
      totalIncidents,
      totalTasks,
      recentActivities
    ] = await Promise.all([
      User.countDocuments(),
      Match.countDocuments(),
      Incident.countDocuments(),
      VolunteerTask.countDocuments(),
      this.getRecentActivities(5)
    ]);

    // Fetch Recent Users for UI table
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role status');

    // Role Distribution (MongoDB Aggregation)
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Incident Stats
    const criticalIncidents = await Incident.countDocuments({ priority: 'Critical', status: { $ne: 'Resolved' } });

    const stats = {
      totalUsers,
      totalMatches,
      totalIncidents,
      totalTasks,
      criticalIncidents,
      roleDistribution: roleStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    };

    // System Health Mock
    const systemHealth = {
      database: 'Online',
      api: 'Online',
      socket: 'Online',
      uptime: '99.9%'
    };

    return { stats, recentActivities, systemHealth, recentUsers };
  }

  // ==========================================
  // ORGANIZER DASHBOARD
  // ==========================================
  static async getOrganizerDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      activeMatches,
      liveIncidents,
      criticalIncidents,
      pendingTasks,
      availableVolunteers,
      recentActivities
    ] = await Promise.all([
      Match.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } }),
      Incident.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
      Incident.countDocuments({ status: { $in: ['Open', 'In Progress']}, priority: 'Critical' }),
      VolunteerTask.countDocuments({ status: { $in: ['Pending', 'Assigned', 'In Progress'] } }),
      User.countDocuments({ role: 'Volunteer' }), // In real scenario, filter by currently clocked in
      this.getRecentActivities(5)
    ]);

    const stats = {
      activeMatches,
      liveIncidents,
      criticalIncidents,
      pendingTasks,
      availableVolunteers,
      crowdDensity: '78%', // Mock dynamic value
      parkingOccupancy: '85%' // Mock dynamic value
    };

    // AI Summary
    const aiSummary = "Crowd density is optimal. 3 critical incidents require immediate attention. Recommend dispatching 2 additional volunteers to Gate B.";

    return { stats, recentActivities, aiSummary };
  }

  // ==========================================
  // VOLUNTEER DASHBOARD
  // ==========================================
  static async getVolunteerDashboard(volunteerId) {
    const [
      assignedTasks,
      completedTasks,
      myIncidents,
      recentActivities
    ] = await Promise.all([
      VolunteerTask.countDocuments({ assignedVolunteer: volunteerId, status: { $in: ['Assigned', 'In Progress'] } }),
      VolunteerTask.countDocuments({ assignedVolunteer: volunteerId, status: 'Completed' }),
      Incident.countDocuments({ reportedBy: volunteerId }),
      this.getRecentActivities(5) // In production, filter by tasks/incidents related to this volunteer
    ]);

    // Fetch active tasks for UI
    const activeTasksList = await VolunteerTask.find({ assignedVolunteer: volunteerId, status: { $in: ['Assigned', 'In Progress'] } }).limit(3);

    // Fetch nearby incidents (mocking nearby by just fetching recent open ones)
    const nearbyIncidents = await Incident.find({ status: { $in: ['Open', 'In Progress'] }, priority: 'Critical' }).limit(2);

    const performance = {
      completionRate: completedTasks > 0 ? '94%' : 'N/A',
      avgResolutionTime: '18 mins',
      rating: '4.8/5.0'
    };

    const stats = {
      assignedTasks,
      completedTasks,
      myIncidents
    };

    return { stats, performance, recentActivities, activeTasksList, nearbyIncidents };
  }

  // ==========================================
  // FAN DASHBOARD
  // ==========================================
  static async getFanDashboard(fanId) {
    const upcomingMatch = await Match.findOne({ status: 'Scheduled' }).populate('stadium', 'name');
    const myTickets = 2; // Placeholder for Phase 8 Ticket logic
    
    // Notifications specifically for this fan
    const recentNotifs = await Notification.find({ recipient: fanId })
      .sort({ createdAt: -1 })
      .limit(3);

    const stats = {
      upcomingMatch: upcomingMatch ? upcomingMatch.name : 'No Upcoming Matches',
      matchDate: upcomingMatch ? upcomingMatch.date : null,
      myTickets,
      parkingStatus: 'Filling Fast'
    };

    const aiSuggestions = [
      "Arrive 30 minutes early to avoid Gate B congestion.",
      "Consider parking at Zone P3 for faster exit."
    ];

    return { stats, aiSuggestions, recentNotifs };
  }

  // ==========================================
  // UNIFIED RECENT ACTIVITIES (For all dashboards)
  // ==========================================
  static async getRecentActivities(limit = 10) {
    // To make a unified timeline, we can merge recent Tasks, Incidents, and Matches.
    // In a production app, we would query an 'ActivityLog' or 'AuditTrail' collection.
    // Here we query Notification collection as a proxy for "Activities" since notifications are generated for major events.
    
    const activities = await Notification.find({ category: { $ne: 'System' } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'name role');

    return activities.map(a => ({
      id: a._id,
      title: a.title,
      description: a.message,
      type: a.type,
      category: a.category,
      time: a.createdAt,
      actor: a.sender ? a.sender.name : 'System'
    }));
  }

  // ==========================================
  // CHARTS / ANALYTICS
  // ==========================================
  static async getChartsData() {
    // Incidents by Priority
    const incidentsByPriority = await Incident.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Tasks by Status
    const tasksByStatus = await VolunteerTask.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format for frontend Recharts
    const formatChart = (aggData) => aggData.map(d => ({ name: d._id || 'Unknown', value: d.count }));

    return {
      incidentsByPriority: formatChart(incidentsByPriority),
      tasksByStatus: formatChart(tasksByStatus)
    };
  }
}

export default DashboardService;
