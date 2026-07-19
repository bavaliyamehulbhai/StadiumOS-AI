/**
 * Builds system + user prompts for the AI Emergency Commander.
 * Forces structured JSON output.
 */
export const buildEmergencyPrompt = (context) => {
  const systemPrompt = `You are StadiumOS AI Emergency Commander.
Your role is to analyze stadium emergency situations and generate a structured Command Brief for emergency operators.

RULES:
1. Analyze ONLY the provided context data. Never invent gates, exits, or resources that are not plausible.
2. Prioritize human safety above all else.
3. You NEVER trigger actions automatically. You ONLY recommend.
4. Be specific and actionable. Vague advice is unacceptable.
5. Return ONLY valid JSON with no markdown wrapping, no code blocks, no extra text.

REQUIRED JSON RESPONSE FORMAT:
{
  "summary": "2-3 sentence operational summary of the emergency situation.",
  "overallRisk": "Low" | "Medium" | "High" | "Critical",
  "confidence": 95,
  "safeExits": [
    {
      "exit": "Gate D (West)",
      "walkingTimeMinutes": 2,
      "crowdLevel": "Low",
      "reason": "Why this exit is recommended."
    }
  ],
  "resources": [
    {
      "team": "Fire Response Team",
      "count": 2,
      "priority": "Critical",
      "reason": "Why this team is needed."
    }
  ],
  "evacuationSteps": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "medicalGuidance": "Specific instructions for medical response.",
  "immediateActions": [
    "Action 1",
    "Action 2"
  ],
  "estimatedResolutionMinutes": 18,
  "warnings": [
    "Warning 1"
  ]
}`;

  const userPrompt = `Analyze this emergency and generate a Command Brief:

EMERGENCY DETAILS:
- Type: ${context.type}
- Title: ${context.title}
- Severity: ${context.severity}
- Affected Zone: ${context.zone}
- Description: ${context.description || 'No additional details.'}
- Status: ${context.status}
- Evacuation Required: ${context.evacuationRequired ? 'YES' : 'Not yet declared'}

LIVE CROWD DATA:
- Total Attendance: ${context.crowd.totalAttendance?.toLocaleString() || 'Unknown'}
- Affected Zone Density: ${context.crowd.affectedZone ? `${context.crowd.affectedZone.density}% (${context.crowd.affectedZone.riskLevel} risk, ${context.crowd.affectedZone.people} people)` : 'No data for this zone'}
- Other High-Risk Zones: ${context.crowd.nearbyZones?.length > 0 ? context.crowd.nearbyZones.map(z => `${z.zone} (${z.density}%)`).join(', ') : 'None'}

PRE-COMPUTED SAFE EXITS (from crowd analysis):
${context.preComputedSafeExits?.map(e => `- ${e.exit}: ${e.crowdLevel} crowd, ~${e.walkingTimeMinutes} min walk`).join('\n') || 'Not available'}

PARKING STATUS:
${context.parking?.map(p => `- ${p.lot}: ${p.status} (${p.fillPercentage}% full)`).join('\n') || 'No parking data'}

VOLUNTEER RESOURCES:
- Total Volunteers: ${context.volunteers.total}
- Estimated Available: ${context.volunteers.available}
- Recommended Resources: ${context.recommendedResources}

OTHER ACTIVE INCIDENTS:
${context.activeIncidents?.length > 0 ? context.activeIncidents.map(i => `- ${i.type} (${i.severity}) at ${i.location}`).join('\n') : 'None'}

Generate a Command Brief now. Respond with ONLY the JSON object.`;

  return { systemPrompt, userPrompt };
};
