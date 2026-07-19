import { buildCrowdContext } from './crowdContextService.js';
import { buildCrowdPrompt } from './crowdPromptService.js';
import CrowdAIAnalysis from '../../models/CrowdAIAnalysis.js';
import Stadium from '../../models/Stadium.js';
import mongoose from 'mongoose';
import NotificationService from '../../services/notificationService.js';
import { CrowdSocketService } from '../../crowd/services/crowdSocketService.js';
import User from '../../models/User.js';
import Crowd from '../../models/Crowd.js';

// simple memory cache to avoid spamming the same prediction
const lastPredictionCache = {};

export const generateCrowdInsights = async (stadiumId = null) => {
  try {
    const context = await buildCrowdContext(stadiumId);
    const { systemPrompt, userPrompt } = buildCrowdPrompt(context);

    // Call Groq AI
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.warn('GROQ_API_KEY missing – using fallback analysis');
      return getFallbackAnalysis(context);
    }

    let parsedContent;
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API Error:', response.status, errorText);
        return getFallbackAnalysis(context);
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) return getFallbackAnalysis(context);

      try {
        parsedContent = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse Groq JSON response:', raw);
        return getFallbackAnalysis(context);
      }
    } catch (fetchErr) {
      console.error('Groq fetch error:', fetchErr.message);
      return getFallbackAnalysis(context);
    }

    // Resolve a real stadiumId for saving (skip DB save if none found)
    let resolvedStadiumId = stadiumId;
    if (!resolvedStadiumId || !mongoose.Types.ObjectId.isValid(resolvedStadiumId)) {
      // Try to find any stadium
      const anyStadium = await Stadium.findOne().select('_id');
      resolvedStadiumId = anyStadium?._id || null;
    }

    if (resolvedStadiumId) {
      try {
        await CrowdAIAnalysis.create({
          stadium: resolvedStadiumId,
          summary: parsedContent.summary || '',
          overallRiskLevel: parsedContent.overallRiskLevel || 'Low',
          confidence: parsedContent.confidence || 80,
          predictions: parsedContent.predictions || [],
          recommendations: parsedContent.recommendations || [],
          rawContextUsed: context
        });
      } catch (dbErr) {
        // Don't fail the whole request if DB save fails
        console.error('Failed to save CrowdAIAnalysis to DB:', dbErr.message);
      }
    }

    return parsedContent;

  } catch (error) {
    console.error('Error in generateCrowdInsights:', error);
    return getFallbackAnalysis({});
  }
};

// Rich fallback if Groq is unavailable or rate-limited (free tier)
const getFallbackAnalysis = (context) => {
  const zones = context?.zones || [];
  const highRisk = zones.filter(z => z.riskLevel === 'High' || z.riskLevel === 'Critical');

  return {
    summary: highRisk.length > 0
      ? `Live analysis shows ${highRisk.length} high-risk zone(s) including ${highRisk.map(z => z.zone).join(', ')}. Proactive action recommended.`
      : `Stadium is operating within safe capacity. All zones are within acceptable density thresholds.`,
    overallRiskLevel: highRisk.length > 2 ? 'High' : highRisk.length > 0 ? 'Medium' : 'Low',
    confidence: 72,
    predictions: zones.slice(0, 3).map(z => ({
      zone: z.zone,
      currentDensity: z.densityPercentage || 0,
      predictedDensity: Math.min(100, (z.densityPercentage || 0) + 10),
      timeframeMinutes: 10,
      risk: z.riskLevel || 'Low',
      reasoning: `Zone is at ${z.densityPercentage || 0}% capacity with an average wait time of ${z.averageWaitTime || 0} minutes.`
    })),
    recommendations: [
      {
        actionType: 'Deploy Volunteers',
        targetZone: highRisk[0]?.zone || 'Gate A',
        description: `Deploy additional volunteers to monitor and assist crowd flow at ${highRisk[0]?.zone || 'Gate A'}.`,
        priority: highRisk.length > 0 ? 'High' : 'Medium'
      },
      {
        actionType: 'General',
        targetZone: 'All Gates',
        description: 'Continue monitoring crowd density. Activate PA announcements to guide fans to less congested entrances.',
        priority: 'Low'
      }
    ]
  };
};

export const generateCrowdPrediction = async (crowdId) => {
  try {
    const zone = await Crowd.findById(crowdId).populate('stadium', 'name');
    if (!zone) return;
    
    // Prevent spamming groq for the same zone (cooldown 2 minutes)
    const now = Date.now();
    if (lastPredictionCache[zone._id] && (now - lastPredictionCache[zone._id]) < 120000) {
      return;
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    let aiData;

    if (!groqApiKey) {
      aiData = getFallbackZonePrediction(zone);
    } else {
      const prompt = `
      You are an AI crowd control expert for a stadium.
      A zone is currently experiencing HIGH or CRITICAL density.
      Zone: ${zone.zone} (${zone.category})
      Stadium: ${zone.stadium?.name}
      Current Occupancy: ${zone.densityPercentage}%
      Current Wait Time: ${zone.averageWaitTime} minutes
      Risk Level: ${zone.riskLevel}

      Generate a concise JSON response with NO markdown wrappers.
      {
        "prediction": "A 1-sentence prediction of what will happen in the next 10-15 minutes.",
        "recommendation": "A 1-sentence actionable recommendation for the Organizer.",
        "actionRequired": true or false
      }
      `;

      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL || 'llama-3.1-8b-instant',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          aiData = JSON.parse(data.choices?.[0]?.message?.content);
        } else {
          aiData = getFallbackZonePrediction(zone);
        }
      } catch (err) {
        aiData = getFallbackZonePrediction(zone);
      }
    }

    // Save prediction cache
    lastPredictionCache[zone._id] = now;

    // Emit the insight to dashboard
    CrowdSocketService.emitCrowdPredictionReady({
      zoneId: zone._id,
      zoneName: zone.zone,
      ...aiData
    });

    // If critical action required, notify organizers
    if (aiData.actionRequired) {
      const organizers = await User.find({ role: { $in: ['Organizer', 'Admin'] } });
      await Promise.all(organizers.map(org => {
        const rolePrefix = org.role === 'Admin' ? '/admin' : '/organizer';
        return NotificationService.sendNotification({
          recipient: org._id,
          title: 'Crowd AI Alert',
          message: `${zone.zone}: ${aiData.recommendation}`,
          type: 'WARNING',
          category: 'AI',
          priority: 'HIGH',
          actionUrl: `${rolePrefix}/crowd`
        });
      }));
    }

    return aiData;
  } catch (error) {
    console.error('Crowd AI Error:', error.message);
  }
};

const getFallbackZonePrediction = (zone) => {
  return {
    prediction: `${zone.zone} will likely exceed safe limits within the next 15 minutes due to increasing inflow.`,
    recommendation: `Deploy 2 additional volunteers to ${zone.zone} and direct visitors to alternative gates.`,
    actionRequired: zone.riskLevel === 'Critical'
  };
};
