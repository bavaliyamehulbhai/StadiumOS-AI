export const getNavigationSystemPrompt = () => {
  return `You are StadiumOS AI Navigation Copilot.
Your job is to recommend the best navigation routes for users within the stadium based on their specific context.

Always consider:
1. Crowd levels (Avoid congested areas over 75% capacity)
2. User's Parking (if applicable)
3. Active Incidents (e.g., Avoid fire or hazards)
4. Accessibility mode (if true, strictly avoid stairs/escalators and prefer ramps/elevators)
5. Assigned Gate and Seat (for fans)

Respond strictly in valid JSON format.
The output MUST be an object with the following structure:
{
  "destination": "Name of destination",
  "recommendations": [
    {
      "routeName": "Name of route (e.g., 'Blue Route', 'Accessible Route A')",
      "eta": "Estimated time in minutes (e.g., '4 min')",
      "crowdLevel": "Low/Medium/High",
      "reason": "Why this route is recommended (e.g., 'Fastest and least crowded.')",
      "isPrimary": true, // only one should be true
      "warnings": ["Any warnings, e.g., 'Keep left due to cleaning'"]
    },
    {
      "routeName": "Alternative Route name",
      "eta": "...",
      "crowdLevel": "...",
      "reason": "...",
      "isPrimary": false,
      "warnings": []
    }
  ],
  "generalWarnings": ["Overall warnings if any"]
}

Never invent routes that would be physically impossible. Provide 2-3 logical route recommendations.`;
};

export const buildNavigationUserPrompt = (context) => {
  let prompt = `I need navigation to: ${context.destination || 'My assigned gate'}.\n\n`;
  prompt += `Here is my context:\n`;
  prompt += `- Role: ${context.role}\n`;
  prompt += `- Accessibility Mode: ${context.accessibilityMode ? 'ON (Need wheelchair access)' : 'OFF'}\n`;
  
  if (context.ticket) {
    prompt += `- Ticket: Gate ${context.ticket.gate}, Section ${context.ticket.section}, Seat ${context.ticket.seat}\n`;
  }
  
  if (context.parking) {
    prompt += `- Parking: Lot ${context.parking.lot}, Spot ${context.parking.spot}\n`;
  }
  
  if (context.crowd && context.crowd.length > 0) {
    prompt += `- Crowd Warnings: ${context.crowd.map(c => `${c.zone} is ${c.density}% full`).join(', ')}\n`;
  } else {
    prompt += `- Crowd Warnings: None currently.\n`;
  }
  
  if (context.incidents && context.incidents.length > 0) {
    prompt += `- Incidents to Avoid: ${context.incidents.map(i => `${i.type} at ${i.location}`).join(', ')}\n`;
  } else {
    prompt += `- Incidents: None.\n`;
  }

  return prompt;
};
