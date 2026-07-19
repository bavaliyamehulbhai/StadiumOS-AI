import Incident from '../../models/Incident.js';
import Crowd from '../../models/Crowd.js';
import VolunteerTask from '../../models/VolunteerTask.js';
import Match from '../../models/Match.js';
import { Parking } from '../../models/Parking.js';
import EmergencyBroadcast from '../../models/EmergencyBroadcast.js';
import { generateAIResponse } from '../../ai/services/groqService.js';
import mongoose from 'mongoose';

class AnalyticsService {
  
  /**
   * Get the global or stadium-specific analytics overview
   */
  async getOverviewAnalytics({ stadiumId, matchId, startDate, endDate }) {
    const matchQuery = {};
    if (stadiumId) matchQuery.stadium = new mongoose.Types.ObjectId(stadiumId);
    if (matchId) matchQuery._id = new mongoose.Types.ObjectId(matchId);
    if (startDate && endDate) {
      matchQuery.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // 1. Incidents Aggregation
    const incidentQuery = {};
    if (stadiumId) incidentQuery.stadium = new mongoose.Types.ObjectId(stadiumId);
    
    const incidents = await Incident.aggregate([
      { $match: incidentQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $in: ['$status', ['Reported', 'Assigned', 'In Progress']] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
        }
      }
    ]);

    // 2. Volunteer Tasks Aggregation
    const volunteerTasks = await VolunteerTask.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } }
        }
      }
    ]);

    // 3. Emergency Broadcasts
    const emergencyQuery = {};
    if (stadiumId) emergencyQuery.stadiumId = new mongoose.Types.ObjectId(stadiumId);
    const emergencies = await EmergencyBroadcast.aggregate([
      { $match: emergencyQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] } }
        }
      }
    ]);

    // 4. Calculate Health Score
    const incidentData = incidents[0] || { total: 0, active: 0, critical: 0, resolved: 0 };
    const volunteerData = volunteerTasks[0] || { total: 0, completed: 0, inProgress: 0 };
    const emergencyData = emergencies[0] || { total: 0, active: 0 };

    const healthScore = this.calculateHealthScore({
      activeIncidents: incidentData.active,
      criticalIncidents: incidentData.critical,
      activeEmergencies: emergencyData.active,
      volunteerCompletionRate: volunteerData.total > 0 ? (volunteerData.completed / volunteerData.total) : 1
    });

    return {
      healthScore,
      incidents: incidentData,
      volunteers: volunteerData,
      emergencies: emergencyData,
    };
  }

  /**
   * Deterministic Health Score Formula
   */
  calculateHealthScore({ activeIncidents, criticalIncidents, activeEmergencies, volunteerCompletionRate }) {
    let score = 100;
    
    // Penalize for active emergencies heavily
    if (activeEmergencies > 0) score -= (activeEmergencies * 25);
    
    // Penalize for incidents
    score -= (criticalIncidents * 10);
    score -= (activeIncidents * 2);
    
    // Bonus for volunteer readiness
    if (volunteerCompletionRate >= 0.8) score += 5;
    if (volunteerCompletionRate < 0.5) score -= 10;
    
    return Math.max(0, Math.min(100, score)); // Clamp between 0 and 100
  }

  /**
   * Fetch historical trends for charts
   */
  async getTrends({ stadiumId }) {
    // Mocking historical trend by grouping incidents by day
    const incidentTrends = await Incident.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    return {
      incidents: incidentTrends.map(t => ({ date: t._id, count: t.count }))
    };
  }

  /**
   * Generate AI Executive Summary based on current analytics
   */
  async generateExecutiveSummary(analyticsData) {
    const prompt = `
You are an expert Stadium Operations AI Analyst.
Given the following real-time analytics data, provide a concise Executive Summary (max 4 sentences).
Do not hallucinate data. Only use the numbers provided.
Format with markdown. Include overall health, primary risks, and a single operational recommendation.

Data:
- Health Score: ${analyticsData.healthScore}/100
- Active Incidents: ${analyticsData.incidents.active} (${analyticsData.incidents.critical} Critical)
- Active Emergencies: ${analyticsData.emergencies.active}
- Volunteer Completion: ${Math.round((analyticsData.volunteers.completed / (analyticsData.volunteers.total || 1)) * 100)}%

Summary:
`;

    try {
      const response = await generateAIResponse(
        'You are an expert Stadium Operations AI Analyst.',
        prompt
      );
      return response;
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      return 'AI Executive Summary is temporarily unavailable due to rate limits. Operations are stable.';
    }
  }

}

export default new AnalyticsService();
