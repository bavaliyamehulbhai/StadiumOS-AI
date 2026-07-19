import { generateAIResponse } from '../../ai/services/groqService.js';
import User from '../../models/User.js';

class VolunteerRecommendationService {
  async recommendVolunteers(context) {
    const { requiredSkill, zone, emergencyLevel } = context;

    try {
      // 1. Fetch available volunteers
      const query = { role: 'Volunteer', status: { $ne: 'Inactive' } };
      if (emergencyLevel === 'Critical') {
        query.availability = { $in: ['Available', 'Busy'] }; // in critical, pull from busy
      } else {
        query.availability = 'Available';
      }

      const candidates = await User.find(query)
        .select('name skills currentZone availability performanceScore completedTasks')
        .lean();

      if (candidates.length === 0) {
        return { recommendations: [], fallbackUsed: true, reason: 'No available volunteers found.' };
      }

      // 2. Prepare context for AI
      const promptContext = `
        Incident Context:
        - Required Skill: ${requiredSkill || 'Any'}
        - Target Zone: ${zone || 'Any'}
        - Emergency Level: ${emergencyLevel || 'Standard'}

        Available Candidate Pool:
        ${JSON.stringify(candidates.map(c => ({
          id: c._id,
          name: c.name,
          skills: c.skills,
          zone: c.currentZone,
          score: c.performanceScore,
          status: c.availability
        })), null, 2)}

        Task: Select the top 3 best-suited volunteers from the pool to handle this incident.
        Consider skill match, zone proximity (if same zone, higher priority), and performance score.
        Return ONLY valid JSON matching this schema:
        {
          "recommendations": [
            { "id": "volunteer_id", "name": "Volunteer Name", "reason": "Why they were chosen" }
          ]
        }
      `;

      try {
        const responseText = await generateAIResponse(
          "You are an expert workforce allocation AI for a smart stadium. Only return JSON.",
          promptContext,
          []
        );

        const parsed = JSON.parse(responseText.trim());
        return {
          recommendations: parsed.recommendations,
          fallbackUsed: false
        };
      } catch (aiError) {
        console.warn('[VolunteerRecommendationService] AI Failed/Rate Limited, using deterministic fallback.', aiError.message);
        return this._deterministicFallback(candidates, requiredSkill, zone);
      }
    } catch (error) {
      console.error('[VolunteerRecommendationService] Error:', error.message);
      return { recommendations: [], fallbackUsed: true, reason: 'Internal error calculating recommendations.' };
    }
  }

  _deterministicFallback(candidates, requiredSkill, zone) {
    let scoredCandidates = candidates.map(c => {
      let score = c.performanceScore || 50;
      
      // Skill match bonus
      if (requiredSkill && c.skills && c.skills.includes(requiredSkill)) {
        score += 30;
      }
      
      // Zone match bonus
      if (zone && c.currentZone === zone) {
        score += 20;
      }

      // Penalty for being busy
      if (c.availability === 'Busy') {
        score -= 20;
      }

      return {
        id: c._id,
        name: c.name,
        totalScore: score,
        reason: `Deterministic fallback: Skill match (${c.skills?.includes(requiredSkill)}), Zone match (${c.currentZone === zone})`
      };
    });

    // Sort descending by score
    scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);

    return {
      recommendations: scoredCandidates.slice(0, 3).map(c => ({
        id: c.id,
        name: c.name,
        reason: c.reason
      })),
      fallbackUsed: true
    };
  }
}

export default new VolunteerRecommendationService();
