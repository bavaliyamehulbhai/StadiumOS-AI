import User from '../../models/User.js';

class EmergencyTargetService {
  /**
   * Resolves target user IDs based on roles and zones.
   * For MVP: if targetZones are provided, we could use a geospatial query, 
   * but typically we just notify all users of the selected roles and let the frontend 
   * filter or display different messages based on their zone.
   * To keep it robust, we'll fetch all active users of the target roles.
   */
  static async resolveTargets(targetRoles, targetZones) {
    let query = { status: 'Active' };
    
    if (targetRoles && targetRoles.length > 0) {
      query.role = { $in: targetRoles };
    }

    // Phase 4 Note: If we need true zone-based backend filtering, we would 
    // use a $geoWithin query against User.currentLocation.
    // For now, we return all users in the role. The client handles the location logic.
    
    const users = await User.find(query).select('_id role');
    return users;
  }
}

export default EmergencyTargetService;
