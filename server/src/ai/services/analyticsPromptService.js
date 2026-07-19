export const buildAnalyticsPrompt = (context) => {
  const systemPrompt = `You are StadiumOS AI Executive Analyst.
Your role is to analyze stadium operational data across Crowd, Parking, Tickets, Incidents, and Emergencies.
You provide executive insights, actionable recommendations, operational predictions, and compute a "Stadium Health Score" (0-100).

RULES:
1. Base your analysis ONLY on the provided context.
2. Be concise, professional, and actionable.
3. Return ONLY valid JSON with no markdown wrapping, no code blocks, no extra text.

REQUIRED JSON RESPONSE FORMAT:
{
  "summary": "2-3 sentences summarizing the overall operational state.",
  "healthScore": 85,
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1"],
  "predictions": [
    {
      "category": "Crowd" | "Parking" | "Security" | "Medical" | "General",
      "issue": "Brief description of predicted issue.",
      "timeframe": "When it is expected (e.g., 'In 15 minutes').",
      "impact": "Low" | "Medium" | "High" | "Critical"
    }
  ],
  "recommendations": [
    {
      "action": "Specific action to take.",
      "reason": "Why this action is needed.",
      "priority": "Low" | "Medium" | "High" | "Critical"
    }
  ]
}`;

  const userPrompt = `Analyze the following operational data and generate the Executive JSON Report:

MATCH CONTEXT:
- Match: ${context.match ? context.match.title : 'No match data'}
- Status: ${context.match ? context.match.status : 'N/A'}

KEY PERFORMANCE INDICATORS (KPIs):
- Attendance: ${context.kpis.attendance.toLocaleString()}
- Estimated Revenue: ₹${context.kpis.revenue.toLocaleString()}
- Parking Utilization: ${context.kpis.parkingUtilization}%
- Available Volunteers: ~${context.kpis.availableVolunteers}

INCIDENTS & EMERGENCIES:
- Active Incidents: ${context.kpis.activeIncidents} (Open: ${context.incidentsSummary['Open']}, In Progress: ${context.incidentsSummary['In Progress']}, Resolved: ${context.incidentsSummary['Resolved']})
- Active Emergencies: ${context.activeEmergencies.length > 0 ? context.activeEmergencies.map(e => `${e.type} (${e.severity}) at ${e.zone}`).join('; ') : 'None'}

CROWD HIGHLIGHTS (High/Critical Risk Zones):
${context.crowdHighlights.length > 0 ? context.crowdHighlights.map(c => `- ${c.zone}: ${c.density}% density (${c.risk} risk)`).join('\n') : '- All zones operating within safe limits.'}

Based on this data, generate the JSON response.`;

  return { systemPrompt, userPrompt };
};
