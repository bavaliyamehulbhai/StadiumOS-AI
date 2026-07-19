import SystemHealthSnapshot from '../../models/SystemHealthSnapshot.js';

class HealthSnapshotService {
  async saveSnapshot(score, apiHealth, dbHealth, socketHealth, aiHealth) {
    try {
      await SystemHealthSnapshot.create({
        systemScore: score,
        apiLatency: apiHealth.avgLatency || 0,
        errorRate: apiHealth.errorRate || 0,
        activeConnections: socketHealth.activeClients || 0,
        databaseLatency: dbHealth.latency || 0,
        aiLatency: aiHealth.avgLatency || 0,
        aiFailureRate: aiHealth.failureRate || 0
      });
    } catch (error) {
      console.error('[HealthSnapshotService] Failed to save snapshot:', error);
    }
  }

  async getHistory(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return SystemHealthSnapshot.find({ timestamp: { $gte: since } })
      .sort({ timestamp: 1 })
      .lean();
  }
}

export default new HealthSnapshotService();
