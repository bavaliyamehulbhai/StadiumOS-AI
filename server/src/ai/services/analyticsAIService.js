import Groq from 'groq-sdk';
import { buildAnalyticsContext } from './analyticsContextService.js';
import { buildAnalyticsPrompt } from './analyticsPromptService.js';
import AIAnalyticsReport from '../../models/AIAnalyticsReport.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generates the AI Executive Report.
 * Returns cached report if valid (unless forceRefresh = true).
 * Falls back to a robust deterministic calculation if AI fails.
 */
export const generateExecutiveReport = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const recentReport = await AIAnalyticsReport.findOne({ reportType: 'Executive' })
      .sort({ createdAt: -1 });
    
    // Cache valid for 5 minutes
    if (recentReport && (new Date() - new Date(recentReport.createdAt)) < 5 * 60 * 1000) {
      return recentReport;
    }
  }

  const context = await buildAnalyticsContext();

  if (process.env.GROQ_API_KEY) {
    const { systemPrompt, userPrompt } = buildAnalyticsPrompt(context);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: MODEL,
        temperature: 0.2, // Low temp for analytics consistency
        max_tokens: 1500,
      });

      const raw = completion.choices[0]?.message?.content || '';

      let aiData;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        aiData = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      } catch (parseErr) {
        console.error('Analytics AI parse error, using fallback:', parseErr.message);
        return await buildFallbackReport(context);
      }

      return await saveReport(context, aiData);

    } catch (groqErr) {
      console.error('Groq call failed for analytics:', groqErr.message);
      // Fall through to deterministic fallback
    }
  } else {
    console.warn('GROQ_API_KEY not set — using deterministic analytics fallback.');
  }

  return await buildFallbackReport(context);
};

const saveReport = async (context, aiData) => {
  const doc = {
    reportType: 'Executive',
    summary: aiData.summary || 'Operational summary generated.',
    healthScore: typeof aiData.healthScore === 'number' ? Math.max(0, Math.min(100, aiData.healthScore)) : 80,
    strengths: Array.isArray(aiData.strengths) ? aiData.strengths : [],
    weaknesses: Array.isArray(aiData.weaknesses) ? aiData.weaknesses : [],
    predictions: Array.isArray(aiData.predictions) ? aiData.predictions : [],
    recommendations: Array.isArray(aiData.recommendations) ? aiData.recommendations : [],
    kpis: context.kpis,
    aiModel: MODEL,
    generatedAt: new Date()
  };

  return await AIAnalyticsReport.create(doc);
};

const buildFallbackReport = async (context) => {
  // Deterministic fallback logic to guarantee UI doesn't break
  let healthScore = 100;
  const strengths = [];
  const weaknesses = [];
  const predictions = [];
  const recommendations = [];

  // Incidents impact
  if (context.kpis.activeIncidents > 5) {
    healthScore -= 15;
    weaknesses.push(`High number of active incidents (${context.kpis.activeIncidents}).`);
    recommendations.push({ action: 'Deploy backup volunteers to incident zones', reason: 'Reduce active incident backlog', priority: 'High' });
  } else if (context.kpis.activeIncidents === 0) {
    strengths.push('Zero active incidents reported.');
  }

  // Emergencies impact
  if (context.activeEmergencies.length > 0) {
    healthScore -= 30;
    weaknesses.push(`${context.activeEmergencies.length} active emergency reported.`);
    recommendations.push({ action: 'Activate emergency protocol', reason: 'Active emergency in progress', priority: 'Critical' });
    predictions.push({ category: 'General', issue: 'Operational disruptions likely', timeframe: 'Next 30 mins', impact: 'Critical' });
  }

  // Crowd impact
  if (context.crowdHighlights.length > 0) {
    healthScore -= 10;
    weaknesses.push(`${context.crowdHighlights.length} zones experiencing high density.`);
    predictions.push({ category: 'Crowd', issue: 'Continued congestion in highlighted zones', timeframe: 'Next 15 mins', impact: 'Medium' });
  } else {
    strengths.push('Crowd flow is normal across all zones.');
  }

  // Parking impact
  if (context.kpis.parkingUtilization > 90) {
    healthScore -= 5;
    weaknesses.push('Parking nearing full capacity.');
    recommendations.push({ action: 'Prepare overflow parking areas', reason: 'Prevent traffic gridlock', priority: 'Medium' });
  }

  // Baseline strength
  if (healthScore > 85) {
    strengths.push('Stadium operations are highly stable.');
  }

  const doc = {
    reportType: 'Executive',
    summary: `Stadium operations are currently running with a health score of ${healthScore}/100. ${weaknesses.length > 0 ? 'Some issues require attention.' : 'All systems normal.'}`,
    healthScore: Math.max(0, healthScore),
    strengths,
    weaknesses,
    predictions,
    recommendations,
    kpis: context.kpis,
    aiModel: 'deterministic-fallback',
    generatedAt: new Date()
  };

  return await AIAnalyticsReport.create(doc);
};
