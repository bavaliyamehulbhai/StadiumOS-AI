// Deterministic evacuation helper — calculates safest exits from crowd data
// Used to enrich AI prompts AND as a standalone fallback

const STADIUM_EXITS = [
  { id: 'gate-a', label: 'Gate A (North)', walkingTime: 3 },
  { id: 'gate-b', label: 'Gate B (East)', walkingTime: 2 },
  { id: 'gate-c', label: 'Gate C (South)', walkingTime: 4 },
  { id: 'gate-d', label: 'Gate D (West)', walkingTime: 2 },
  { id: 'exit-e1', label: 'Emergency Exit E1', walkingTime: 1 },
  { id: 'exit-e2', label: 'Emergency Exit E2 (Accessible)', walkingTime: 2 },
];

/**
 * Given crowd zone data and an affected zone, returns a ranked list of safe exits.
 * @param {Array} crowdZones - Array of crowd objects from DB
 * @param {string} affectedZone - The zone where the emergency occurred
 * @returns {Array} Ranked safe exits
 */
export const rankSafeExits = (crowdZones, affectedZone = '') => {
  // Build a density map by zone label
  const densityMap = {};
  crowdZones.forEach(z => {
    densityMap[z.zone?.toLowerCase()] = z.densityPercentage || 0;
  });

  // Score each exit (lower density = better; affected zone exits are penalized)
  const scored = STADIUM_EXITS.map(exit => {
    const zoneKey = exit.label.toLowerCase();
    const isAffected = affectedZone && exit.label.toLowerCase().includes(affectedZone.toLowerCase());
    const density = densityMap[zoneKey] || Math.floor(Math.random() * 40 + 10); // mock if no data
    const score = isAffected ? 9999 : density + exit.walkingTime * 5;

    let crowdLevel = 'Low';
    if (density > 85) crowdLevel = 'Critical';
    else if (density > 65) crowdLevel = 'High';
    else if (density > 40) crowdLevel = 'Medium';

    return {
      exit: exit.label,
      walkingTimeMinutes: exit.walkingTime,
      crowdLevel,
      density,
      score,
      isAffected,
      reason: isAffected
        ? `Avoid — this exit is near the emergency zone.`
        : `Density at ${density}%. Walk time approximately ${exit.walkingTime} minutes.`
    };
  });

  // Sort by score ascending; filter out affected zone exits from top recommendations
  return scored
    .sort((a, b) => a.score - b.score)
    .filter(e => !e.isAffected)
    .slice(0, 3)
    .map(({ exit, walkingTimeMinutes, crowdLevel, reason }) =>
      ({ exit, walkingTimeMinutes, crowdLevel, reason })
    );
};

/**
 * Generates ordered evacuation steps based on emergency type and context.
 */
export const buildEvacuationSteps = (emergencyType, safeExits, affectedZone) => {
  const primaryExit = safeExits[0]?.exit || 'Gate D';
  const secondaryExit = safeExits[1]?.exit || 'Gate C';

  const typeSteps = {
    'Fire': [
      `Immediately activate fire alarm for zone: ${affectedZone}.`,
      `Direct all visitors away from ${affectedZone} using PA system.`,
      `Route primary crowd flow through ${primaryExit}.`,
      `Route secondary crowd flow through ${secondaryExit}.`,
      `Seal access to ${affectedZone} — deploy security cordon.`,
      `Guide Fire Response Team to the affected zone.`,
      `Dispatch Medical Team to ${primaryExit} for triage.`,
      `Coordinate with traffic control for emergency vehicle access.`
    ],
    'Medical': [
      `Dispatch Medical Team to the reported location immediately.`,
      `Clear a path through ${primaryExit} for ambulance access.`,
      `Request crowd to step back from the incident zone.`,
      `Assign 2 volunteers to guide emergency responders.`,
      `Monitor crowd density at ${affectedZone} and redirect if necessary.`,
      `Update the Central Command with patient status every 5 minutes.`
    ],
    'Crowd Stampede': [
      `CRITICAL: Activate all PA channels immediately.`,
      `Instruct crowd to remain calm and stop moving.`,
      `Open all available exits: ${primaryExit} and ${secondaryExit}.`,
      `Deploy Crowd Control Team to create space at ${affectedZone}.`,
      `Prioritize evacuation of children, elderly, and disabled persons first.`,
      `Dispatch Medical Teams to the zone for immediate triage.`,
      `Prevent additional crowd from entering ${affectedZone}.`,
      `Maintain continuous PA announcements every 60 seconds.`
    ],
    'default': [
      `Secure the affected zone: ${affectedZone}.`,
      `Alert all staff via emergency channel.`,
      `Direct visitors to ${primaryExit}.`,
      `Deploy response team to ${affectedZone}.`,
      `Keep backup route ${secondaryExit} open.`,
      `Report status to Central Command.`
    ]
  };

  return typeSteps[emergencyType] || typeSteps['default'];
};
