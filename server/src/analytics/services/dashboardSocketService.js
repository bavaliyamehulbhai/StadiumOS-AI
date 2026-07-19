import { getIO } from '../../socket/socketServer.js';
import DashboardService from '../../services/dashboardService.js';
// import removed

export class DashboardSocketService {
  static intervalId = null;
  static lastAiSummary = null;
  
  static startBroadcasting() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    console.log('[DashboardSocket] Starting Live Analytics Broadcasting loop (every 10s)...');
    
    // Broadcast every 10 seconds
    this.intervalId = setInterval(async () => {
      try {
        const io = getIO();
        if (!io) return;
        
        // --- 1. Organizer Dashboard Data ---
        // Reuse the existing heavy lifting from DashboardService
        const organizerData = await DashboardService.getOrganizerDashboard();
        
        // Calculate Stadium Health Score (0-100)
        // Base 100, minus for critical incidents, minus for crowd density > 80%
        let healthScore = 100;
        
        if (organizerData.stats.criticalIncidents > 0) {
          healthScore -= (organizerData.stats.criticalIncidents * 5);
        }
        
        const density = parseInt(organizerData.stats.crowdDensity); // "78%" -> 78
        if (!isNaN(density) && density > 80) {
          healthScore -= (density - 80); 
        }
        
        healthScore = Math.max(0, Math.min(100, healthScore)); // Clamp between 0-100
        organizerData.stats.healthScore = healthScore;
        
        // --- 2. AI Executive Brief ---
        const aiExecutiveBrief = this.lastAiSummary || await this.generateMockAIBrief(organizerData.stats);

        // Broadcast to Organizer Room
        io.to('role:Organizer').emit('dashboard:kpi:updated', {
          stats: organizerData.stats,
          activities: organizerData.recentActivities,
          aiBrief: aiExecutiveBrief
        });

        // --- 3. Admin Dashboard Data ---
        const adminData = await DashboardService.getAdminDashboard();
        io.to('role:Admin').emit('dashboard:admin:updated', {
          stats: adminData.stats,
          health: adminData.systemHealth,
          activities: adminData.recentActivities
        });

      } catch (error) {
        console.error('[DashboardSocket] Error in broadcast loop:', error);
      }
    }, 10000); // 10 seconds
  }

  static stopBroadcasting() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  static async generateMockAIBrief(stats) {
    if (stats.criticalIncidents > 0) {
      return `Critical Alert: ${stats.criticalIncidents} active incidents detected. Recommend immediate volunteer dispatch.`;
    } else if (parseInt(stats.crowdDensity) > 85) {
      return `High Crowd Density (${stats.crowdDensity}). Open overflow gates and redirect fan traffic.`;
    } else if (stats.availableVolunteers < 10) {
      return `Low Volunteer Availability. Re-assign staff from Gate C to high-traffic areas.`;
    }
    return `Operations nominal. Stadium Health is optimal. Attendance steady.`;
  }
}
