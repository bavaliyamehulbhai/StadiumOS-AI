import apiMonitoringService from '../services/apiMonitoringService.js';

export const requestMetricsMiddleware = (req, res, next) => {
  const start = process.hrtime();
  
  // Track response finished
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3) + (diff[1] * 1e-6); // to milliseconds
    
    // Check if error based on status code
    const isError = res.statusCode >= 400;
    
    // We can infer error type loosely from status or if we attached it to res.locals
    let errorType = null;
    if (res.locals && res.locals.errorType) {
      errorType = res.locals.errorType;
    }

    apiMonitoringService.recordRequest(req.originalUrl || req.url, req.method, res.statusCode, duration, isError, errorType);
  });

  next();
};
