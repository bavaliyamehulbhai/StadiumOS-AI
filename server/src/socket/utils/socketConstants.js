export const SOCKET_EVENTS = {
  // Connection Lifecycle
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Client to Server Actions
  JOIN_ROOM: 'room:join',
  LEAVE_ROOM: 'room:leave',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',

  // Incidents
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_UPDATED: 'incident:updated',
  INCIDENT_RESOLVED: 'incident:resolved',
  INCIDENT_CLOSED: 'incident:closed',

  // Volunteers
  TASK_ASSIGNED: 'volunteer:assigned',
  TASK_ACCEPTED: 'volunteer:accepted',
  TASK_COMPLETED: 'volunteer:completed',

  // Operations
  CROWD_UPDATED: 'crowd:updated',
  DASHBOARD_UPDATED: 'dashboard:updated',
  MAP_UPDATED: 'map:updated',
  
  // AI
  AI_SUMMARY_GENERATED: 'ai:summary:generated',
  AI_RECOMMENDATION: 'ai:recommendation',

  // Emergency
  EMERGENCY_ALERT: 'emergency:alert',
  EMERGENCY_RESOLVED: 'emergency:resolved'
};
