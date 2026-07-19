import { STATUS } from '../constants/healthConstants.js';

class HealthScoreService {
  calculate(apiHealth, dbHealth, socketHealth, aiHealth) {
    let score = 100;

    // API Health (30%)
    if (apiHealth.status === STATUS.CRITICAL) score -= 30;
    else if (apiHealth.status === STATUS.DEGRADED) score -= 15;
    else if (apiHealth.status === STATUS.OFFLINE) score -= 30;

    // DB Health (25%)
    if (dbHealth.status === STATUS.CRITICAL) score -= 25;
    else if (dbHealth.status === STATUS.DEGRADED) score -= 12;
    else if (dbHealth.status === STATUS.OFFLINE) score -= 25;

    // Socket Health (20%)
    if (socketHealth.status === STATUS.CRITICAL) score -= 20;
    else if (socketHealth.status === STATUS.DEGRADED) score -= 10;
    else if (socketHealth.status === STATUS.OFFLINE) score -= 20;

    // AI Health (15%)
    if (aiHealth.status === STATUS.CRITICAL) score -= 15;
    else if (aiHealth.status === STATUS.DEGRADED) score -= 7;
    else if (aiHealth.status === STATUS.OFFLINE) score -= 15;

    // Ensure score is within 0-100
    return Math.max(0, Math.min(100, score));
  }
}

export default new HealthScoreService();
