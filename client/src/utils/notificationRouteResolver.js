/**
 * Resolves the frontend route for a notification based on its entity type and the user's role.
 * This prevents hardcoding role-specific routes (e.g. /admin/incidents vs /organizer/incidents) in the database.
 * 
 * @param {Object} notification The notification object containing entityType, entityId, and actionUrl
 * @param {String} userRole The role of the currently logged in user
 * @returns {String} The resolved frontend URL
 */
export const resolveNotificationRoute = (notification, userRole) => {
  const { entityType, entityId, actionUrl, category } = notification;

  // If there's an explicit hardcoded actionUrl and no entityType, fallback to it
  if (actionUrl && !entityType) {
    return actionUrl;
  }

  const role = userRole?.toLowerCase() || 'fan';

  switch (entityType?.toUpperCase()) {
    case 'INCIDENT':
      if (role === 'admin') return `/admin/incidents/${entityId || ''}`;
      if (role === 'organizer') return `/organizer/incidents/${entityId || ''}`;
      if (role === 'volunteer') return `/volunteer/incidents`; // Volunteers might only have a list view
      return '/incidents';

    case 'TASK':
    case 'VOLUNTEERTASK':
      if (role === 'volunteer') return `/volunteer/tasks/${entityId || ''}`;
      if (role === 'organizer') return `/organizer/tasks/${entityId || ''}`;
      if (role === 'admin') return `/admin/tasks`;
      return '/tasks';

    case 'MATCH':
      if (role === 'admin') return `/admin/matches`;
      if (role === 'organizer') return `/organizer/matches`;
      return '/matches';
      
    case 'GATE':
    case 'CROWD':
      return `/map?mode=crowd&zone=${entityId || ''}`;
      
    case 'PARKING':
      return `/map?mode=parking&zone=${entityId || ''}`;

    default:
      // Fallbacks based on Category if EntityType is missing
      switch (category?.toUpperCase()) {
        case 'EMERGENCY':
          if (role === 'admin') return '/admin/emergency-rules';
          if (role === 'organizer') return '/emergency/dashboard';
          return '/map?mode=emergency';
        case 'SYSTEM':
          if (role === 'admin') return '/admin';
          return '/';
        case 'AI':
          if (role === 'admin') return '/admin/ai-settings';
          if (role === 'organizer') return '/ai/command-center';
          return '/';
        default:
          return '/'; // Dashboard or Home
      }
  }
};
