import os from 'os';

class RuntimeMetricsService {
  getMetrics() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    // CPU usage is complex in Node.js, we can do a simple average load
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    
    // Calculate simple CPU percentage based on 1m load average / num cpus
    const cpuPercent = Math.min((loadAvg[0] / cpus.length) * 100, 100).toFixed(1);

    return {
      uptime: this.formatUptime(uptime),
      memory: {
        rss: this.formatBytes(memoryUsage.rss),
        heapTotal: this.formatBytes(memoryUsage.heapTotal),
        heapUsed: this.formatBytes(memoryUsage.heapUsed)
      },
      cpu: {
        cores: cpus.length,
        usagePercent: cpuPercent
      },
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    };
  }

  formatBytes(bytes) {
    return Math.round(bytes / 1024 / 1024) + ' MB';
  }

  formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  }
}

export default new RuntimeMetricsService();
