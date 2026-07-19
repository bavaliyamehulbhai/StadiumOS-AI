import { STATUS, THRESHOLDS } from '../constants/healthConstants.js';

class APIMonitoringService {
  constructor() {
    this.resetMetrics();
  }

  resetMetrics() {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalLatency = 0;
    this.slowEndpoints = new Map();
    this.errorsByType = new Map();
  }

  recordRequest(route, method, statusCode, duration, isError, errorType) {
    this.totalRequests++;
    this.totalLatency += duration;

    if (isError || statusCode >= 400) {
      this.failedRequests++;
      if (errorType) {
        this.errorsByType.set(errorType, (this.errorsByType.get(errorType) || 0) + 1);
      } else {
        const type = statusCode >= 500 ? 'Server Error' : 'Client Error';
        this.errorsByType.set(type, (this.errorsByType.get(type) || 0) + 1);
      }
    } else {
      this.successfulRequests++;
    }

    if (duration > THRESHOLDS.API_LATENCY_DEGRADED) {
      const endpointKey = `${method} ${route}`;
      const current = this.slowEndpoints.get(endpointKey) || { count: 0, totalDuration: 0 };
      this.slowEndpoints.set(endpointKey, {
        count: current.count + 1,
        totalDuration: current.totalDuration + duration
      });
    }
  }

  getMetrics() {
    const avgLatency = this.totalRequests > 0 ? this.totalLatency / this.totalRequests : 0;
    const errorRate = this.totalRequests > 0 ? (this.failedRequests / this.totalRequests) * 100 : 0;

    let status = STATUS.HEALTHY;
    if (errorRate > THRESHOLDS.API_ERROR_RATE_CRITICAL || avgLatency > THRESHOLDS.API_LATENCY_CRITICAL) {
      status = STATUS.CRITICAL;
    } else if (errorRate > THRESHOLDS.API_ERROR_RATE_DEGRADED || avgLatency > THRESHOLDS.API_LATENCY_DEGRADED) {
      status = STATUS.DEGRADED;
    }

    // Process slow endpoints
    const slowEndpointsArr = Array.from(this.slowEndpoints.entries())
      .map(([route, data]) => ({
        route,
        count: data.count,
        avgLatency: data.totalDuration / data.count
      }))
      .sort((a, b) => b.avgLatency - a.avgLatency)
      .slice(0, 5); // top 5

    // Format errors
    const recentErrors = Array.from(this.errorsByType.entries()).map(([type, count]) => ({ type, count }));

    return {
      status,
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      avgLatency: Math.round(avgLatency),
      errorRate: Number(errorRate.toFixed(2)),
      slowEndpoints: slowEndpointsArr,
      recentErrors
    };
  }

  // To be called by Snapshot service periodically
  flush() {
    const metrics = this.getMetrics();
    this.resetMetrics();
    return metrics;
  }
}

export default new APIMonitoringService();
