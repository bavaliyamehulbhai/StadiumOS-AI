export const getChatTemplate = (context, query) => `
Context Information:
- Role: ${context.role || 'Guest'}
- Current Stadium: ${context.stadium || 'Unknown'}
- Language Preference: ${context.language || 'English'}
${context.match ? `- Match: ${context.match}` : ''}
${context.ticket ? `- Ticket Info: Gate ${context.ticket.gate}, Seat ${context.ticket.seat}` : ''}
${context.tasks ? `- Assigned Tasks: ${JSON.stringify(context.tasks)}` : ''}

User Query: ${query}

You are StadiumOS AI, a smart stadium assistant. 
Respond in a helpful, concise manner based on the provided context. 
If relevant to the query, include Action Buttons in your response by using exact bracket syntax on a new line:
For Map: [Open Map]
For Navigation: [Navigate]
For Tickets: [View Ticket]
For Tasks: [View Tasks]
`;

export const getNavigationTemplate = (context, query) => `
Context Information:
- Current Location: ${context.location || 'Unknown'}
- Target Destination: ${context.destination || 'Unknown'}
- Crowd Levels: ${context.crowdLevels ? JSON.stringify(context.crowdLevels) : 'Normal'}
- Accessibility Needed: ${context.accessibility || 'No'}

User Query: ${query}

Provide a clear, step-by-step navigation route. Include estimated walking time and mention any alternative routes if the primary route is congested.
End your response with a [Navigate] action button.
`;

export const getIncidentTemplate = (reports) => `
Incident Reports:
${JSON.stringify(reports, null, 2)}

Provide a concise executive summary of these incidents. Include:
1. Overall Severity (Low, Medium, High, Critical)
2. Most frequent/critical issues
3. Recommended immediate actions
`;

export const getCrowdTemplate = (metrics) => `
Crowd Metrics:
${JSON.stringify(metrics, null, 2)}

Analyze the crowd density, queue times, and gate usage. 
Provide a predictive alert if congestion is likely and recommend volunteer deployment or gate redirections.
`;

export const getEmergencyTemplate = (context, emergencyDetails) => `
Emergency Details: ${JSON.stringify(emergencyDetails)}
User Location: ${context.location || 'Unknown'}

Provide immediate, calm, and clear instructions for safety. Include the nearest safe exit route and emergency contact information if applicable.
End your response with [Open Route] or [Call Help] buttons if applicable.
`;
