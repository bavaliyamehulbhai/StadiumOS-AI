import { getIO } from '../../socket/socketServer.js';
import { STATUS, THRESHOLDS } from '../constants/healthConstants.js';

class SocketHealthService {
  constructor() {
    this.totalConnections = 0;
    this.totalDisconnects = 0;
    this.totalReconnects = 0;
    this.errors = 0;
  }

  recordConnection() {
    this.totalConnections++;
  }

  recordDisconnect() {
    this.totalDisconnects++;
  }

  recordError() {
    this.errors++;
  }

  getHealth() {
    let io;
    try {
      io = getIO();
    } catch (e) {
      return {
        status: STATUS.OFFLINE,
        activeClients: 0,
        activeRooms: 0,
        disconnectRate: 0
      };
    }

    // `io.engine.clientsCount` gives the number of connected clients
    const activeClients = io.engine ? io.engine.clientsCount : 0;
    const activeRooms = io.sockets.adapter.rooms.size;
    
    // Disconnect rate relative to active clients
    const disconnectRate = activeClients > 0 
      ? (this.totalDisconnects / (activeClients + this.totalDisconnects)) * 100 
      : 0;

    let status = STATUS.HEALTHY;
    if (disconnectRate > THRESHOLDS.SOCKET_DISCONNECT_RATE_CRITICAL) {
      status = STATUS.CRITICAL;
    } else if (disconnectRate > THRESHOLDS.SOCKET_DISCONNECT_RATE_DEGRADED) {
      status = STATUS.DEGRADED;
    }

    return {
      status,
      activeClients,
      activeRooms,
      disconnectRate: Number(disconnectRate.toFixed(2)),
      totalConnections: this.totalConnections,
      errors: this.errors
    };
  }

  flush() {
    const health = this.getHealth();
    // Keep total disconnects, reconnects for long term or reset? 
    // Let's reset counters to measure rate per window
    this.totalConnections = 0;
    this.totalDisconnects = 0;
    this.errors = 0;
    return health;
  }
}

export default new SocketHealthService();
