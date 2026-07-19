import mongoose from 'mongoose';
import { STATUS, THRESHOLDS } from '../constants/healthConstants.js';

class DatabaseHealthService {
  async getHealth() {
    let latency = 0;
    let status = STATUS.UNKNOWN;
    
    try {
      const start = Date.now();
      // Simple ping command to measure DB latency
      await mongoose.connection.db.admin().ping();
      latency = Date.now() - start;

      if (latency > THRESHOLDS.DB_LATENCY_CRITICAL) {
        status = STATUS.CRITICAL;
      } else if (latency > THRESHOLDS.DB_LATENCY_DEGRADED) {
        status = STATUS.DEGRADED;
      } else {
        status = STATUS.HEALTHY;
      }
    } catch (error) {
      status = STATUS.OFFLINE;
      console.error('[DB Health] Ping failed:', error);
    }

    return {
      status,
      latency,
      connectionState: this.getConnectionState(mongoose.connection.readyState)
    };
  }

  getConnectionState(readyState) {
    switch (readyState) {
      case 0: return 'DISCONNECTED';
      case 1: return 'CONNECTED';
      case 2: return 'CONNECTING';
      case 3: return 'DISCONNECTING';
      default: return 'UNKNOWN';
    }
  }
}

export default new DatabaseHealthService();
