// Deterministic resource planner — provides standard resource requirements per emergency type
// Used to enrich AI prompts AND as a standalone fallback

const RESOURCE_TEMPLATES = {
  'Fire': [
    { team: 'Fire Response Team', count: 2, priority: 'Critical', reason: 'Required for immediate fire suppression.' },
    { team: 'Medical Team', count: 2, priority: 'High', reason: 'On standby for burn injuries and smoke inhalation.' },
    { team: 'Security Officers', count: 4, priority: 'High', reason: 'Crowd control and zone exclusion enforcement.' },
    { team: 'Evacuation Volunteers', count: 6, priority: 'Medium', reason: 'Guide visitors to safe exits.' },
  ],
  'Medical': [
    { team: 'Medical Team', count: 3, priority: 'Critical', reason: 'Primary emergency medical response required.' },
    { team: 'Ambulance / Paramedics', count: 1, priority: 'Critical', reason: 'Patient transport and advanced life support.' },
    { team: 'Security Officers', count: 2, priority: 'Medium', reason: 'Maintain clear access for medical personnel.' },
    { team: 'Support Volunteers', count: 4, priority: 'Low', reason: 'Crowd management and emotional support.' },
  ],
  'Crowd Stampede': [
    { team: 'Crowd Control Team', count: 8, priority: 'Critical', reason: 'Immediate crowd dispersal required to prevent further injuries.' },
    { team: 'Medical Team', count: 4, priority: 'Critical', reason: 'Mass casualty readiness required.' },
    { team: 'Security Officers', count: 6, priority: 'Critical', reason: 'Zone control and traffic management.' },
    { team: 'Traffic Control', count: 3, priority: 'High', reason: 'Manage external vehicle flow for emergency access.' },
  ],
  'Bomb Threat': [
    { team: 'Bomb Disposal Unit', count: 1, priority: 'Critical', reason: 'Specialist team required for threat assessment.' },
    { team: 'Security Officers', count: 10, priority: 'Critical', reason: 'Full stadium perimeter lockdown.' },
    { team: 'Police Liaison', count: 2, priority: 'Critical', reason: 'Coordinate with law enforcement.' },
    { team: 'Medical Team', count: 2, priority: 'High', reason: 'Standby for any injuries during evacuation.' },
    { team: 'Evacuation Volunteers', count: 8, priority: 'High', reason: 'Orderly evacuation of all zones.' },
  ],
  'Lost Child': [
    { team: 'Security Officers', count: 3, priority: 'High', reason: 'Search coordination and gate monitoring.' },
    { team: 'Support Volunteers', count: 4, priority: 'High', reason: 'Search teams across stadium zones.' },
    { team: 'Medical Team', count: 1, priority: 'Medium', reason: 'Standby in case child requires medical attention.' },
  ],
  'Security Threat': [
    { team: 'Security Officers', count: 8, priority: 'Critical', reason: 'Immediate threat neutralization and area lockdown.' },
    { team: 'Police Liaison', count: 2, priority: 'Critical', reason: 'Law enforcement coordination required.' },
    { team: 'Medical Team', count: 2, priority: 'High', reason: 'Standby for potential injuries.' },
    { team: 'Evacuation Team', count: 4, priority: 'Medium', reason: 'Ready for partial evacuation if required.' },
  ],
  'Power Failure': [
    { team: 'Technical Team', count: 3, priority: 'High', reason: 'Restore power and assess electrical hazards.' },
    { team: 'Security Officers', count: 5, priority: 'High', reason: 'Crowd management in low-visibility conditions.' },
    { team: 'Volunteers with Torches', count: 6, priority: 'Medium', reason: 'Guide visitors safely through dark areas.' },
  ],
  'Weather Alert': [
    { team: 'Security Officers', count: 4, priority: 'High', reason: 'Manage crowd movement to indoor areas.' },
    { team: 'Medical Team', count: 2, priority: 'Medium', reason: 'Treat potential weather-related injuries.' },
    { team: 'Shelter Volunteers', count: 6, priority: 'Medium', reason: 'Direct visitors to covered zones.' },
  ],
  'default': [
    { team: 'Security Officers', count: 4, priority: 'High', reason: 'Maintain order and assess situation.' },
    { team: 'Medical Team', count: 2, priority: 'Medium', reason: 'On standby for any injuries.' },
    { team: 'Volunteer Coordinators', count: 3, priority: 'Low', reason: 'Support crowd management.' },
  ]
};

/**
 * Returns standard resource requirements for a given emergency type.
 * @param {string} emergencyType
 * @returns {Array}
 */
export const getResourcePlan = (emergencyType) => {
  return RESOURCE_TEMPLATES[emergencyType] || RESOURCE_TEMPLATES['default'];
};

/**
 * Returns a plain-text summary of resources for use in AI prompts.
 * @param {string} emergencyType
 * @returns {string}
 */
export const getResourceSummary = (emergencyType) => {
  const plan = getResourcePlan(emergencyType);
  return plan.map(r => `${r.team} ×${r.count} (${r.priority})`).join(', ');
};
