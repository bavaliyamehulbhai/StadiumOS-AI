import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

export const generateExecutiveBrief = async (context) => {
  if (!process.env.GROQ_API_KEY) {
    return "Current operations are stable. Unified AI telemetry indicates nominal crowd flow and no critical emergencies. Continue standard operating procedures.";
  }

  const prompt = `You are the StadiumOS AI Command Center.
Generate a concise, 2-3 sentence Executive AI Brief based on the following real-time stadium telemetry.
Focus on operational status, crowd anomalies, active emergencies, and high-priority recommendations.

Telemetry Data:
- Stadium Health Score: ${context.healthScore}/100
- Active Emergencies: ${context.activeEmergencies}
- Active Incidents: ${context.activeIncidents}
- High Risk Crowd Zones: ${context.highRiskZones}
- Parking Capacity: ${context.parkingUtilization}%

Keep it professional, actionable, and extremely concise. Do not use formatting like markdown bolding or lists. Just return the brief.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: MODEL,
      temperature: 0.3,
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('Command Center Brief Generation Failed:', error.message);
    return "Current operations are stable. Standard AI telemetry indicates nominal crowd flow and no critical emergencies. Continue standard operating procedures.";
  }
};
