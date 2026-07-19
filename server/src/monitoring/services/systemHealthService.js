import apiMonitoringService from './apiMonitoringService.js';
import databaseHealthService from './databaseHealthService.js';
import socketHealthService from './socketHealthService.js';
import aiHealthService from './aiHealthService.js';
import runtimeMetricsService from './runtimeMetricsService.js';
import healthScoreService from './healthScoreService.js';
import healthSnapshotService from './healthSnapshotService.js';
import systemIncidentService from './systemIncidentService.js';
import { getIO } from '../../socket/socketServer.js';
import { STATUS, SYSTEM_INCIDENT_TYPES, SERVICES } from '../constants/healthConstants.js';

class SystemHealthService {
  constructor() {
    // We can run a periodic snapshot save every 1 minute
    this.snapshotInterval = setInterval(() => this.runPeriodicCheck(), 60000);
  }

  async getOverallHealth() {
    const apiHealth = apiMonitoringService.getMetrics();
    const dbHealth = await databaseHealthService.getHealth();
    const socketHealth = socketHealthService.getHealth();
    const aiHealth = aiHealthService.getHealth();
    const runtime = runtimeMetricsService.getMetrics();

    const score = healthScoreService.calculate(apiHealth, dbHealth, socketHealth, aiHealth);

    let status = STATUS.HEALTHY;
    if (score < 50) status = STATUS.CRITICAL;
    else if (score < 90) status = STATUS.DEGRADED;

    return {
      status,
      score,
      timestamp: new Date(),
      services: {
        api: apiHealth,
        database: dbHealth,
        socket: socketHealth,
        ai: aiHealth
      },
      runtime
    };
  }

  async runPeriodicCheck() {
    try {
      const apiHealth = apiMonitoringService.flush();
      const aiHealth = aiHealthService.flush();
      const socketHealth = socketHealthService.flush();
      const dbHealth = await databaseHealthService.getHealth();

      const score = healthScoreService.calculate(apiHealth, dbHealth, socketHealth, aiHealth);

      await healthSnapshotService.saveSnapshot(score, apiHealth, dbHealth, socketHealth, aiHealth);

      // Check for incidents
      await this.checkIncidents(apiHealth, dbHealth, socketHealth, aiHealth);

      // Emit live update
      try {
        const fullHealth = await this.getOverallHealth();
        getIO().to('role:Admin').emit('system.health.updated', fullHealth);
      } catch (e) {
        // Socket not ready
      }
    } catch (error) {
      console.error('[SystemHealthService] Error in periodic check:', error);
    }
  }

  async checkIncidents(apiHealth, dbHealth, socketHealth, aiHealth) {
    // DB Incidents
    if (dbHealth.status === STATUS.CRITICAL) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.MONGODB, SYSTEM_INCIDENT_TYPES.DATABASE_DOWN, 'CRITICAL', 'Database Unreachable', 'MongoDB ping failed or latency critically high.');
    } else if (dbHealth.status === STATUS.DEGRADED) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.MONGODB, SYSTEM_INCIDENT_TYPES.DATABASE_LATENCY, 'WARNING', 'Database Degraded', 'MongoDB latency is higher than usual.');
    } else {
      await systemIncidentService.resolveIncidentByType(SERVICES.MONGODB, SYSTEM_INCIDENT_TYPES.DATABASE_DOWN);
      await systemIncidentService.resolveIncidentByType(SERVICES.MONGODB, SYSTEM_INCIDENT_TYPES.DATABASE_LATENCY);
    }

    // API Incidents
    if (apiHealth.status === STATUS.CRITICAL) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.REST_API, SYSTEM_INCIDENT_TYPES.HIGH_ERROR_RATE, 'CRITICAL', 'API Critical', 'API is experiencing critical error rates or latency.');
    } else if (apiHealth.status === STATUS.DEGRADED) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.REST_API, SYSTEM_INCIDENT_TYPES.HIGH_API_LATENCY, 'WARNING', 'API Degraded', 'API error rate or latency is elevated.');
    } else {
      await systemIncidentService.resolveIncidentByType(SERVICES.REST_API, SYSTEM_INCIDENT_TYPES.HIGH_ERROR_RATE);
      await systemIncidentService.resolveIncidentByType(SERVICES.REST_API, SYSTEM_INCIDENT_TYPES.HIGH_API_LATENCY);
    }

    // Socket Incidents
    if (socketHealth.status === STATUS.CRITICAL || socketHealth.status === STATUS.DEGRADED) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.SOCKET, SYSTEM_INCIDENT_TYPES.SOCKET_DEGRADED, socketHealth.status === STATUS.CRITICAL ? 'CRITICAL' : 'WARNING', 'Socket Infrastructure Degraded', 'High disconnect rate detected.');
    } else {
      await systemIncidentService.resolveIncidentByType(SERVICES.SOCKET, SYSTEM_INCIDENT_TYPES.SOCKET_DEGRADED);
    }

    // AI Incidents
    if (aiHealth.status === STATUS.CRITICAL) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.AI, SYSTEM_INCIDENT_TYPES.AI_PROVIDER_DOWN, 'CRITICAL', 'AI Provider Down', 'Critical failure rate from Groq AI.');
    } else if (aiHealth.status === STATUS.DEGRADED) {
      await systemIncidentService.detectAndCreateIncident(SERVICES.AI, SYSTEM_INCIDENT_TYPES.AI_HIGH_FAILURE_RATE, 'WARNING', 'AI Provider Degraded', 'Elevated failures or rate limits from Groq AI.');
    } else {
      await systemIncidentService.resolveIncidentByType(SERVICES.AI, SYSTEM_INCIDENT_TYPES.AI_PROVIDER_DOWN);
      await systemIncidentService.resolveIncidentByType(SERVICES.AI, SYSTEM_INCIDENT_TYPES.AI_HIGH_FAILURE_RATE);
    }
  }
}

export default new SystemHealthService();
