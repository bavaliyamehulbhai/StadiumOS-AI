import Groq from 'groq-sdk';
import { buildEmergencyContext } from './emergencyContextService.js';
import { buildEmergencyPrompt } from './emergencyPromptService.js';
import { rankSafeExits, buildEvacuationSteps } from './evacuationService.js';
import { getResourcePlan } from './resourcePlanningService.js';
import EmergencyAIAnalysis from '../../models/EmergencyAIAnalysis.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

/**
 * Main entry point — generates a full AI Command Brief for an emergency.
 * Never throws: always returns a valid result (AI or deterministic fallback).
 */
export const generateEmergencyAnalysis = async (emergencyId, forceRegenerate = false) => {
  // Return cached analysis if it exists and isn't being forced
  if (!forceRegenerate) {
    const cached = await EmergencyAIAnalysis.findOne({ emergency: emergencyId });
    if (cached) return cached;
  }

  // Build context
  const context = await buildEmergencyContext(emergencyId);

  // Try Groq AI
  if (process.env.GROQ_API_KEY) {
    const { systemPrompt, userPrompt } = buildEmergencyPrompt(context);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: MODEL,
        temperature: 0.15,
        max_tokens: 1500,
      });

      const raw = completion.choices[0]?.message?.content || '';

      // Parse JSON — handle markdown-wrapped responses
      let aiData;
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        aiData = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      } catch (parseErr) {
        console.error('Emergency AI parse error, using fallback:', parseErr.message);
        return buildFallback(emergencyId, context);
      }

      return await saveAnalysis(emergencyId, context, aiData);

    } catch (groqErr) {
      console.error('Groq call failed for emergency analysis:', groqErr.message);
      // Fall through to deterministic fallback
    }
  } else {
    console.warn('GROQ_API_KEY not set — using deterministic emergency fallback.');
  }

  return buildFallback(emergencyId, context);
};

/**
 * Saves the AI result to DB and returns a plain object.
 */
const saveAnalysis = async (emergencyId, context, aiData) => {
  const doc = {
    emergency: emergencyId,
    emergencyType: context.type,
    severity: context.severity,
    affectedZone: context.zone,
    summary: aiData.summary || 'AI analysis generated.',
    overallRisk: aiData.overallRisk || context.severity || 'Medium',
    confidence: typeof aiData.confidence === 'number' ? aiData.confidence : 80,
    safeExits: Array.isArray(aiData.safeExits) ? aiData.safeExits : context.preComputedSafeExits,
    resources: Array.isArray(aiData.resources) ? aiData.resources : getResourcePlan(context.type),
    evacuationSteps: Array.isArray(aiData.evacuationSteps) ? aiData.evacuationSteps : [],
    medicalGuidance: aiData.medicalGuidance || '',
    immediateActions: Array.isArray(aiData.immediateActions) ? aiData.immediateActions : [],
    estimatedResolutionMinutes: typeof aiData.estimatedResolutionMinutes === 'number'
      ? aiData.estimatedResolutionMinutes : 15,
    warnings: Array.isArray(aiData.warnings) ? aiData.warnings : [],
    aiModel: MODEL,
    generatedAt: new Date()
  };

  return await EmergencyAIAnalysis.findOneAndUpdate(
    { emergency: emergencyId },
    doc,
    { new: true, upsert: true }
  );
};

/**
 * Deterministic fallback — builds a rich Command Brief from context data alone.
 * This ensures the UI always has something useful to display.
 */
const buildFallback = async (emergencyId, context) => {
  const safeExits = context.preComputedSafeExits?.length
    ? context.preComputedSafeExits
    : rankSafeExits([], context.zone);

  const resources = getResourcePlan(context.type);
  const evacuationSteps = buildEvacuationSteps(context.type, safeExits, context.zone);

  const severityMessages = {
    'Critical': `CRITICAL ALERT: ${context.type} reported at ${context.zone}. Immediate response required.`,
    'High': `High-severity ${context.type} at ${context.zone}. Emergency response teams should be deployed now.`,
    'Medium': `${context.type} reported at ${context.zone}. Situation is being assessed. Monitor closely.`,
    'Low': `Low-severity ${context.type} at ${context.zone}. Standard protocols apply.`
  };

  const fallbackData = {
    emergency: emergencyId,
    emergencyType: context.type,
    severity: context.severity,
    affectedZone: context.zone,
    summary: severityMessages[context.severity] ||
      `${context.type} at ${context.zone}. Coordinate response teams immediately.`,
    overallRisk: context.severity || 'Medium',
    confidence: 70, // Lower confidence for fallback
    safeExits,
    resources,
    evacuationSteps,
    medicalGuidance: `Deploy medical team to ${context.zone} immediately. ${
      context.crowd.affectedZone
        ? `Current density at affected zone is ${context.crowd.affectedZone.density}% — approach with caution.`
        : 'Maintain clear access for emergency vehicles.'
    }`,
    immediateActions: [
      `Secure zone: ${context.zone}`,
      `Activate emergency channel — alert all staff`,
      `Deploy ${resources[0]?.team || 'Response Team'} immediately`,
      `Open PA system — broadcast calm evacuation instructions`,
      `Redirect crowd to ${safeExits[0]?.exit || 'Gate D'}`,
    ],
    estimatedResolutionMinutes: context.severity === 'Critical' ? 25 : context.severity === 'High' ? 18 : 10,
    warnings: [
      context.crowd.nearbyZones?.length > 0
        ? `High crowd density detected at nearby zones: ${context.crowd.nearbyZones.map(z => z.zone).join(', ')}.`
        : 'Monitor crowd movement in all adjacent zones.',
      `${context.volunteers.available} volunteers estimated available for deployment.`
    ],
    aiModel: 'deterministic-fallback',
    generatedAt: new Date()
  };

  return await EmergencyAIAnalysis.findOneAndUpdate(
    { emergency: emergencyId },
    fallbackData,
    { new: true, upsert: true }
  );
};
