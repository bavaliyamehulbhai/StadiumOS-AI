import { auditService } from '../services/auditService.js';

/**
 * Maps Express route paths/methods to our generic Audit modules
 */
const getModuleFromPath = (path) => {
  if (path.includes('/auth')) return 'Authentication';
  if (path.includes('/incidents')) return 'Incident';
  if (path.includes('/tasks')) return 'Volunteer';
  if (path.includes('/crowd')) return 'Crowd';
  if (path.includes('/emergency')) return 'Emergency';
  if (path.includes('/ai')) return 'AI Engine';
  if (path.includes('/dashboard')) return 'Dashboard';
  return 'General';
};

/**
 * Masks sensitive information in request bodies before logging
 */
const maskSensitiveData = (body) => {
  if (!body) return body;
  const masked = { ...body };
  const sensitiveKeys = ['password', 'token', 'secret', 'creditCard'];
  
  Object.keys(masked).forEach(key => {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      masked[key] = '***MASKED***';
    }
  });
  return masked;
};

/**
 * Express middleware to automatically log POST, PUT, PATCH, DELETE requests
 */
export const auditLogger = (req, res, next) => {
  // Only log modifying requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Intercept the response finish event to capture status
    res.on('finish', async () => {
      // Don't log simple polling updates if they happen via POST
      if (req.path.includes('/live') || req.path.includes('/polling')) return;

      const module = getModuleFromPath(req.path);
      const action = `${req.method} ${req.path}`;
      
      let severity = 'INFO';
      if (res.statusCode >= 400 && res.statusCode < 500) severity = 'WARNING';
      if (res.statusCode >= 500) severity = 'ERROR';
      if (req.method === 'DELETE') severity = 'WARNING';

      const logData = {
        action,
        module,
        user: req.user ? req.user._id : null,
        role: req.user ? req.user.role : 'Guest',
        severity,
        status: res.statusCode.toString(),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        metadata: {
          method: req.method,
          query: req.query,
          body: maskSensitiveData(req.body)
        }
      };

      await auditService.logEvent(logData);
    });
  }
  next();
};
