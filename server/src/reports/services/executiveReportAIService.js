import { generateAIResponse } from '../../ai/services/groqService.js';

class ExecutiveReportAIService {
  async generateAnalysis(metricsSnapshot) {
    const promptContext = `
      You are the StadiumOS AI Executive Operations Analyst.
      Your task is to review the following numerical metrics snapshot and provide a structured operational report.

      RULES:
      1. Analyze ONLY the supplied operational data.
      2. NEVER invent, hallucinate, or alter any numerical metrics.
      3. Return ONLY valid JSON matching the exact schema below.
      4. Do not include markdown formatting like \`\`\`json. Just the raw JSON object.
      
      METRICS SNAPSHOT:
      ${JSON.stringify(metricsSnapshot, null, 2)}

      OUTPUT SCHEMA:
      {
        "executiveSummary": "3-5 paragraphs summarizing overall status, biggest challenge, response, and future priority.",
        "operationalAssessment": "Analysis of the stadium health score and operational flow.",
        "crowdAnalysis": "Insights based on the crowdMetrics provided.",
        "incidentAnalysis": "Insights based on the incidentMetrics provided.",
        "volunteerAnalysis": "Insights based on the volunteerMetrics provided.",
        "emergencyAnalysis": "Any relevant insights if critical incidents occurred, else state operations were nominal.",
        "aiDecisionAnalysis": "Insights on how AI performed based on aiMetrics.",
        "keyRisks": ["Risk 1", "Risk 2"],
        "keySuccesses": ["Success 1", "Success 2"],
        "recommendations": [
          { "category": "Immediate", "text": "Actionable recommendation" },
          { "category": "Next Match", "text": "Actionable recommendation" },
          { "category": "Long-Term", "text": "Actionable recommendation" }
        ]
      }
    `;

    try {
      const responseText = await generateAIResponse(
        "You are the StadiumOS AI Executive Operations Analyst. Return ONLY pure JSON.",
        promptContext,
        []
      );

      // Clean up potential markdown formatting from the response
      let jsonString = responseText.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.substring(0, jsonString.length - 3);
      }

      const parsedJSON = JSON.parse(jsonString.trim());
      
      // Basic schema validation
      if (!parsedJSON.executiveSummary) {
        throw new Error("Invalid AI Response: Missing executive summary.");
      }

      return {
        aiAnalysis: parsedJSON,
        status: 'SUCCESS'
      };
    } catch (error) {
      console.warn('[ExecutiveReportAIService] AI Generation Failed:', error.message);
      return {
        aiAnalysis: null,
        status: 'FAILED',
        errorReason: error.message
      };
    }
  }
}

export default new ExecutiveReportAIService();
