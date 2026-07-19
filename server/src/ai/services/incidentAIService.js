import groq from '../../config/groq.js';
import { buildIncidentContext } from './incidentContextService.js';
import { generateIncidentPrompt } from './incidentPromptService.js';
import IncidentAIAnalysis from '../../models/IncidentAIAnalysis.js';

const MODEL = process.env.AI_MODEL || 'llama-3.1-8b-instant';

export const analyzeIncident = async (incidentId, forceRegenerate = false) => {
  // Check if analysis already exists
  if (!forceRegenerate) {
    const existing = await IncidentAIAnalysis.findOne({ incident: incidentId });
    if (existing) return existing;
  }

  // Build Context & Prompt
  const context = await buildIncidentContext(incidentId);
  const prompt = generateIncidentPrompt(context);

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      temperature: 0.2,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Parse JSON safely
    let aiData;
    try {
      // Find JSON block if groq wrapped it in markdown
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      aiData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse Groq response:', responseText);
      throw new Error('AI returned invalid format');
    }

    // Save to database
    const updateData = {
      incident: incidentId,
      summary: aiData.summary || 'Summary unavailable.',
      severity: aiData.severity || 'Medium',
      confidence: aiData.confidence || 80,
      recommendedActions: aiData.recommendedActions || [],
      requiredResources: aiData.requiredResources || [],
      estimatedResolution: aiData.estimatedResolution || 'Unknown',
      riskLevel: aiData.riskLevel || 'Warning',
      reasoning: aiData.reasoning || '',
      aiModel: MODEL
    };

    const analysis = await IncidentAIAnalysis.findOneAndUpdate(
      { incident: incidentId },
      updateData,
      { new: true, upsert: true }
    );

    return analysis;

  } catch (error) {
    console.error('Error analyzing incident (Groq API Rate Limit?):', error.message);
    console.log('Using Fallback Incident Analysis due to API error.');
    
    // Fallback Mock AI Response for Demo purposes when API limits hit
    const updateData = {
      incident: incidentId,
      summary: `[Fallback] Emergency detected regarding ${context.incidentTitle}. Immediate response required.`,
      severity: context.reportedPriority === 'Critical' ? 'High' : 'Medium',
      confidence: 95,
      recommendedActions: [
        'Dispatch nearest available volunteer immediately.',
        'Secure the perimeter around the incident zone.',
        'Notify on-site medical or security staff.'
      ],
      requiredResources: ['Security', 'Medical'],
      estimatedResolution: '15-30 minutes',
      riskLevel: 'Warning',
      reasoning: 'Fallback response triggered due to AI API rate limits.',
      aiModel: 'llama-fallback-mock'
    };

    const analysis = await IncidentAIAnalysis.findOneAndUpdate(
      { incident: incidentId },
      updateData,
      { new: true, upsert: true }
    );

    return analysis;
  }
};
