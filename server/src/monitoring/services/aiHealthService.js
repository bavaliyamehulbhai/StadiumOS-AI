import { STATUS, THRESHOLDS } from '../constants/healthConstants.js';

class AIHealthService {
  constructor() {
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalLatency = 0;
    this.rateLimitErrors = 0;
    
    // Per-feature tracking
    this.features = {
      'Assistant': { reqs: 0, succ: 0, fail: 0 },
      'Crowd': { reqs: 0, succ: 0, fail: 0 },
      'Emergency': { reqs: 0, succ: 0, fail: 0 },
      'Reports': { reqs: 0, succ: 0, fail: 0 }
    };
  }

  recordCall(feature, duration, success, error) {
    this.totalRequests++;
    this.totalLatency += duration;
    
    if (this.features[feature]) {
      this.features[feature].reqs++;
    }

    if (success) {
      this.successfulRequests++;
      if (this.features[feature]) this.features[feature].succ++;
    } else {
      this.failedRequests++;
      if (this.features[feature]) this.features[feature].fail++;
      
      if (error && (error.status === 429 || (error.message && error.message.includes('Rate limit')))) {
        this.rateLimitErrors++;
      }
    }
  }

  getHealth() {
    const avgLatency = this.totalRequests > 0 ? this.totalLatency / this.totalRequests : 0;
    const failureRate = this.totalRequests > 0 ? (this.failedRequests / this.totalRequests) * 100 : 0;

    let status = STATUS.HEALTHY;
    if (failureRate > THRESHOLDS.AI_FAILURE_RATE_CRITICAL || avgLatency > THRESHOLDS.AI_LATENCY_CRITICAL) {
      status = STATUS.CRITICAL;
    } else if (failureRate > THRESHOLDS.AI_FAILURE_RATE_DEGRADED || avgLatency > THRESHOLDS.AI_LATENCY_DEGRADED || this.rateLimitErrors > 0) {
      status = STATUS.DEGRADED;
    }

    // Process feature health
    const featureMetrics = Object.keys(this.features).map(key => {
      const f = this.features[key];
      const rate = f.reqs > 0 ? (f.succ / f.reqs) * 100 : 100;
      return {
        name: key,
        requests: f.reqs,
        successRate: Number(rate.toFixed(1)),
        status: rate < 80 ? 'DEGRADED' : 'HEALTHY'
      };
    });

    return {
      status,
      totalRequests: this.totalRequests,
      successRate: this.totalRequests > 0 ? Number(((this.successfulRequests / this.totalRequests) * 100).toFixed(1)) : 100,
      avgLatency: Math.round(avgLatency),
      failureRate: Number(failureRate.toFixed(2)),
      rateLimitErrors: this.rateLimitErrors,
      features: featureMetrics
    };
  }

  flush() {
    const health = this.getHealth();
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalLatency = 0;
    this.rateLimitErrors = 0;
    Object.keys(this.features).forEach(key => {
      this.features[key] = { reqs: 0, succ: 0, fail: 0 };
    });
    return health;
  }
}

export default new AIHealthService();
